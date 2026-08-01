import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { DealService, Deal, DealClient, DealProperty } from '../deal';
import { NotificationServices } from '../../core/notification/notification-services';
type CommissionStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected';
type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Completed';

@Component({
  selector: 'app-deal-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './deal-edit.html',
  styleUrl: './deal-edit.scss'
})
export class DealEdit implements OnInit {
  // ===================================================
  // STATE
  // ===================================================
  loading = false;
  saving = false;
  dealId = '';
  deal: Deal | null = null;

  // ===================================================
  // FORM — ONLY COMMISSION STATUS + PAYMENT STATUS EDITABLE
  // ===================================================
  dealForm = new FormGroup({
    commissionStatus: new FormControl<CommissionStatus>('Pending', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    paymentStatus: new FormControl<PaymentStatus>('Pending', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dealService: DealService,
    private cdr: ChangeDetectorRef,
     private notification: NotificationServices
  ) {}

  // ===================================================
  // INIT
  // ===================================================
  ngOnInit(): void {
    this.dealId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.dealId) {
      this.notification.error('Deal ID not found');
      this.router.navigate(['/deals']);
      return;
    }

    this.loadDeal();
  }

  // ===================================================
  // LOAD DEAL
  // ===================================================
  loadDeal(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.dealService.getDealById(this.dealId).subscribe({
      next: (res: Deal) => {
        this.deal = res;

        this.dealForm.patchValue({
          commissionStatus: res.commissionStatus ?? 'Pending',
          paymentStatus: res.paymentStatus ?? 'Pending'
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notification.error(
  err?.error?.error ||
  err?.error?.message ||
  err?.message ||
  'Failed to load deal'
);
        
      }
    });
  }

  // ===================================================
  // UPDATE DEAL
  // ===================================================
  updateDeal(): void {
    if (this.dealForm.invalid) {
      this.dealForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.cdr.detectChanges();

    const value = this.dealForm.getRawValue();

    const payload: Partial<Deal> = {
      commissionStatus: value.commissionStatus,
      paymentStatus: value.paymentStatus
    };

    this.dealService.updateDeal(this.dealId, payload).subscribe({
    next: (res: any) => {

  this.saving = false;

  this.cdr.detectChanges();

  this.notification.success(
    res?.message ||
    'Deal updated successfully'
  );

  this.router.navigate(['/deals']);

},
      error: (err) => {
        this.notification.error(
  err?.error?.error ||
  err?.error?.message ||
  err?.message ||
  'Failed to update deal'
);
      }
    });
  }

  // ===================================================
  // CLIENT
  // ===================================================
  getClient(deal: Deal): DealClient | null {
    if (typeof deal.clientId === 'object' && deal.clientId !== null) {
      return deal.clientId;
    }
    return null;
  }

  getClientId(deal: Deal): string {
    const client: any = deal.clientId;

    if (typeof client === 'object' && client !== null) {
      return client._id || '—';
    }
    return client || '—';
  }

  // ===================================================
  // PROPERTY
  // ===================================================
  getProperty(deal: Deal): DealProperty | null {
    if (typeof deal.propertyId === 'object' && deal.propertyId !== null) {
      return deal.propertyId;
    }
    return null;
  }

  getPropertyId(deal: Deal): string {
    const property: any = deal.propertyId;

    if (typeof property === 'object' && property !== null) {
      return property._id || '—';
    }
    return property || '—';
  }

  // ===================================================
  // USER DETAILS
  // ===================================================
  getUserId(user: any): string {
    if (!user) {
      return '—';
    }
    if (typeof user === 'object') {
      return user._id || '—';
    }
    return user;
  }

  getUserName(user: any): string {
    if (!user) {
      return '—';
    }
    if (typeof user === 'object') {
      return user.name || user.fullName || '—';
    }
    return '—';
  }

  getUserEmail(user: any): string {
    if (!user || typeof user !== 'object') {
      return '—';
    }
    return user.email || '—';
  }

  getUserPhone(user: any): string {
    if (!user || typeof user !== 'object') {
      return '—';
    }
    return user.phone || user.mobile || '—';
  }

  // ===================================================
  // FORM ERROR
  // ===================================================
  hasError(controlName: string, error: string): boolean {
    const control = this.dealForm.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }

  // ===================================================
  // CANCEL
  // ===================================================
  cancel(): void {
    this.router.navigate(['/deals']);
  }
}