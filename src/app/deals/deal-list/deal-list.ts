// src/app/deals/deal-list/deal-list.ts

import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationServices } from '../../core/notification/notification-services';
import { DealService, Deal, DealQueryParams } from '../deal';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './deal-list.html',
  styleUrls: ['./deal-list.scss']
})
export class DealList implements OnInit {
  // ===================================================
  // DESTROY REF
  // ===================================================
  private destroyRef = inject(DestroyRef);

  // ===================================================
  // UI STATE
  // ===================================================
  showFilters = false;
  loading = false;

  // ===================================================
  // DEAL DATA
  // ===================================================
  deals: Deal[] = [];
  userRole: string | null = null;

  // ===================================================
  // PAGINATION
  // ===================================================
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  // ===================================================
  // FILTER FORM
  // ===================================================
  filterForm = new FormGroup({
    q: new FormControl<string>('', { nonNullable: true }),
    name: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<string>('', { nonNullable: true }),
    paymentStatus: new FormControl<string>('', { nonNullable: true }),
    propertyId: new FormControl<string>('', { nonNullable: true }),
    clientId: new FormControl<string>('', { nonNullable: true }),
    minDealAmount: new FormControl<string>('', { nonNullable: true }),
    maxDealAmount: new FormControl<string>('', { nonNullable: true }),
    minCommissionAmount: new FormControl<string>('', { nonNullable: true }),
    maxCommissionAmount: new FormControl<string>('', { nonNullable: true }),
    minCommissionPercentage: new FormControl<string>('', { nonNullable: true }),
    maxCommissionPercentage: new FormControl<string>('', { nonNullable: true }),
    dealDate: new FormControl<string>('', { nonNullable: true }),
    fromDate: new FormControl<string>('', { nonNullable: true }),
    toDate: new FormControl<string>('', { nonNullable: true })
  });

  constructor(
    private router: Router,
    private dealService: DealService,
    private cdr: ChangeDetectorRef,
     private notification: NotificationServices
  ) {}

  // ===================================================
  // INIT
  // ===================================================
  ngOnInit(): void {
    this.loadUser();
    this.loadDeals();

    // AUTO FILTER
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadDeals();
      });
  }

  // ===================================================
  // LOAD USER
  // ===================================================
  private loadUser(): void {
    const rawUser = localStorage.getItem('user');

    if (!rawUser) {
      return;
    }

    try {
      const user = JSON.parse(rawUser);
      this.userRole = user?.role || null;
    } catch (error) {

  console.error('Invalid user data:', error);

  this.userRole = null;

  this.notification.error(
    'Invalid user session. Please login again.'
  );

}
  }

  // ===================================================
  // CLIENT DISPLAY
  // ===================================================
  getClientName(deal: Deal): string {
    if (typeof deal.clientId === 'object' && deal.clientId !== null) {
      return deal.clientId.name || 'Unknown Client';
    }
    return deal.clientId || '—';
  }

  getClientPhone(deal: Deal): string {
    if (typeof deal.clientId === 'object' && deal.clientId !== null) {
      return deal.clientId.phone || '—';
    }
    return '—';
  }

  getClientEmail(deal: Deal): string {
    if (typeof deal.clientId === 'object' && deal.clientId !== null) {
      return deal.clientId.email || '—';
    }
    return '—';
  }

  getClientId(deal: Deal): string {
    if (typeof deal.clientId === 'object' && deal.clientId !== null) {
      return deal.clientId._id || '—';
    }
    return deal.clientId || '—';
  }

  // ===================================================
  // PROPERTY DISPLAY
  // ===================================================
  getPropertyTitle(deal: Deal): string {
    if (typeof deal.propertyId === 'object' && deal.propertyId !== null) {
      return deal.propertyId.title || 'Unknown Property';
    }
    return deal.propertyId || '—';
  }

  getPropertyAddress(deal: Deal): string {
    if (typeof deal.propertyId === 'object' && deal.propertyId !== null) {
      return deal.propertyId.address || '—';
    }
    return '—';
  }

  getPropertyId(deal: Deal): string {
    if (typeof deal.propertyId === 'object' && deal.propertyId !== null) {
      return deal.propertyId._id || '—';
    }
    return deal.propertyId || '—';
  }

  // ===================================================
  // LOAD DEALS
  // ===================================================
  loadDeals(): void {
    this.loading = true;

    const f = this.filterForm.getRawValue();

    const params: DealQueryParams = {
      page: this.currentPage,
      limit: this.pageSize,
      q: this.getValue(f.q),
      name: this.getValue(f.name),
      status: this.getValue(f.status),

      // `paymentStatus` on DealQueryParams is a literal union, but the
      // form control is a plain string (bound to a <select> whose options
      // are already constrained to those literal values in the template).
      // Cast here, at the single point it enters the typed params object,
      // rather than weakening the control or query-params type everywhere.
      paymentStatus: this.getValue(f.paymentStatus) as DealQueryParams['paymentStatus'],

      propertyId: this.getValue(f.propertyId),
      clientId: this.getValue(f.clientId)
    };

    // DEAL AMOUNT
    this.addRangeFilter(params, 'dealAmount', f.minDealAmount, f.maxDealAmount);

    // COMMISSION AMOUNT
    this.addRangeFilter(params, 'commissionAmount', f.minCommissionAmount, f.maxCommissionAmount);

    // COMMISSION PERCENTAGE
    this.addRangeFilter(
      params,
      'commissionPercentage',
      f.minCommissionPercentage,
      f.maxCommissionPercentage
    );

    // EXACT DEAL DATE
    if (f.dealDate) {
      params['dealDate'] = f.dealDate;
    }

    // DATE RANGE
    if (f.fromDate) {
      params['dealDate[min]'] = f.fromDate;
    }

    if (f.toDate) {
      params['dealDate[max]'] = f.toDate;
    }

    // API
    this.dealService.getDeals(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.deals = res?.data || [];
          this.totalItems = res?.total ?? this.deals.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('FAILED TO LOAD DEALS:', err);
          this.deals = [];
          this.totalItems = 0;
          this.totalPages = 1;
          this.loading = false;
          this.cdr.detectChanges();
          alert(err?.error?.message || err?.error?.error || 'Failed to load deals');
        }
      });
  }

  // ===================================================
  // STRING VALUE HELPER
  // ===================================================
  private getValue(value: string | null | undefined): string | undefined {
    if (value === null || value === undefined || value.trim() === '') {
      return undefined;
    }
    return value.trim();
  }

  // ===================================================
  // RANGE FILTER HELPER
  // ===================================================
  private addRangeFilter(
    params: DealQueryParams,
    field: string,
    min: string | null | undefined,
    max: string | null | undefined
  ) {
    if (min !== null && min !== undefined && min !== '') {
      params[`${field}[min]`] = min;
    }

    if (max !== null && max !== undefined && max !== '') {
      params[`${field}[max]`] = max;
    }
  }

  // ===================================================
  // CLEAR FILTERS
  // ===================================================
  clearFilters(): void {
    this.filterForm.reset({
      q: '',
      name: '',
      status: '',
      paymentStatus: '',
      propertyId: '',
      clientId: '',
      minDealAmount: '',
      maxDealAmount: '',
      minCommissionAmount: '',
      maxCommissionAmount: '',
      minCommissionPercentage: '',
      maxCommissionPercentage: '',
      dealDate: '',
      fromDate: '',
      toDate: ''
    });

    this.currentPage = 1;
  }

  // ===================================================
  // PAGE SIZE
  // ===================================================
  changePageSize(size: number): void {
    this.pageSize = Number(size) || 10;
    this.currentPage = 1;
    this.loadDeals();
  }

  // ===================================================
  // PAGINATION
  // ===================================================
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.loadDeals();
  }

  // ===================================================
  // EDIT DEAL
  // ===================================================
  editDeal(id: string): void {
    this.router.navigate(['/deals/edit', id]);
  }

  // ===================================================
  // VIEW DEAL
  // ===================================================
  viewDeal(id: string): void {
    this.router.navigate(['/deals', id]);
  }

  // ===================================================
  // DELETE DEAL
  // ===================================================
  async deleteDeal(id: string): Promise<void> {

  const confirmed = await this.notification.confirmDelete(
  'Delete Deal?',
  'This action cannot be undone.'
);

if (!confirmed) {
  return;
}

  this.dealService
    .deleteDeal(id)
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({

      next: (res: any) => {

        this.deals = this.deals.filter(

          deal => deal._id !== id

        );

        this.totalItems = Math.max(

          0,

          this.totalItems - 1

        );

        this.totalPages =

          Math.ceil(

            this.totalItems / this.pageSize

          ) || 1;

        this.notification.success(

          res?.message ||

          'Deal deleted successfully'

        );

        if (

          this.deals.length === 0 &&

          this.currentPage > 1

        ) {

          this.currentPage--;

          this.loadDeals();

        }

      },

      error: (err) => {

        console.error(

          'DELETE DEAL ERROR:',

          err

        );

        this.notification.error(

          err?.error?.error ||

          err?.error?.message ||

          err?.message ||

          'Delete failed'

        );

      }

    });

}

  // ===================================================
  // STATUS CLASS
  // ===================================================
  getStatusClass(status: string | undefined): string {
    if (!status) {
      return 'default';
    }
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  // ===================================================
  // PAGE NUMBERS
  // ===================================================
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}