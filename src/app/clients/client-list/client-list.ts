import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Client, ClientInterface, ClientQueryParams } from '../client';
import { NotificationServices } from '../../core/notification/notification-services';
@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-list.html',
  styleUrls: ['./client-list.scss']
})
export class ClientList implements OnInit {
  showFilters = false;
  clients: ClientInterface[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;

  filterForm = new FormGroup({
    q: new FormControl(''),
    name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    budgetMin: new FormControl(''),
    budgetMax: new FormControl(''),
    requirement: new FormControl(''),
    interestedProject: new FormControl(''),
    preferredLocation: new FormControl(''),
    timeline: new FormControl(''),
    leadSource: new FormControl(''),
    priority: new FormControl(''),
    communicationPreference: new FormControl('')
  });

  constructor(
    private router: Router,
    private clientService: Client,
    private cdr: ChangeDetectorRef,
    private notification: NotificationServices
  ) {}

  ngOnInit() {
    this.loadClients();

    // Auto filter while typing/changing
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadClients();
    });
  }

  loadClients() {
    const f = this.filterForm.value;

    const params: ClientQueryParams = {
      page: this.currentPage,
      limit: this.pageSize,
      q: f.q || undefined,
      name: f.name || undefined,
      phone: f.phone || undefined,
      email: f.email || undefined,
      requirement: f.requirement || undefined,
      interestedProject: f.interestedProject || undefined,
      preferredLocation: f.preferredLocation || undefined,
      timeline: f.timeline || undefined,
      leadSource: f.leadSource || undefined,
      priority: f.priority || undefined,
      communicationPreference: f.communicationPreference || undefined
    };

    // Range filter for budget
    this.addRangeFilter(params, 'budget', f.budgetMin, f.budgetMax);

    this.clientService.getClients(params).subscribe({
      next: (res) => {
        this.clients = res.data;
        this.totalItems = res.total;
        this.totalPages = Math.ceil(res.total / this.pageSize) || 1;
        this.cdr.detectChanges();
      },
      error: (err) => {

  console.error(err);

  this.notification.error(

    err?.error?.error ||

    err?.error?.message ||

    err?.message ||

    'Failed to load clients'

  );

}
    });
  }

  private addRangeFilter(params: ClientQueryParams, field: string, min: any, max: any) {
    if (min !== null && min !== undefined && min !== '') {
      params[`${field}[min]`] = min;
    }
    if (max !== null && max !== undefined && max !== '') {
      params[`${field}[max]`] = max;
    }
  }

  clearFilters() {
    this.filterForm.reset({
      q: '',
      name: '',
      phone: '',
      email: '',
      budgetMin: '',
      budgetMax: '',
      requirement: '',
      interestedProject: '',
      preferredLocation: '',
      timeline: '',
      leadSource: '',
      priority: '',
      communicationPreference: ''
    });
    this.currentPage = 1;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadClients();
  }

  editClient(id: string) {
    this.router.navigate(['/clients/edit', id]);
  }
async deleteClient(id: string) {

  const confirmed = await this.notification.confirmDelete(
    'Delete Client?',
    'This action cannot be undone.'
  );

  if (!confirmed) return;

  this.clientService.deleteClient(id).subscribe({

    next: (res: any) => {

      this.clients = this.clients.filter(c => c._id !== id);

      this.totalItems--;

      this.notification.success(
        res?.message || 'Client deleted successfully'
      );

    },

    error: (err) => {

      this.notification.error(
        err?.error?.error ||
        err?.error?.message ||
        err?.message ||
        'Delete failed'
      );

    }

  });

}
}
