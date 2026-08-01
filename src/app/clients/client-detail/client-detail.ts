import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Client, ClientInterface } from '../client';
import { NotificationServices } from '../../core/notification/notification-services';
@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss',
})
export class ClientDetail implements OnInit {

  client: ClientInterface | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private clientService: Client,
    private router: Router,
    private cdr:ChangeDetectorRef,
    private notification: NotificationServices

  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');

    if (!clientId) {
     this.errorMessage = 'Client ID not found';
this.notification.error('Client ID not found');
this.loading = false;
return;
    }

    this.loadClient(clientId);
  }

  loadClient(id: string): void {
    this.clientService.getClientById(id).subscribe({

      next: (response) => {
        this.client = response;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Client Details:', response);
      },

      error: (err) => {
        console.error('Client Detail Error:', err);

  const message =
    err?.error?.error ||
    err?.error?.message ||
    err?.message ||
    'Failed to load client details';

  this.errorMessage = message;

  this.notification.error(message);

  this.loading = false;
      }

    });
  }

  editClient(): void {
    if (this.client?._id) {
      this.router.navigate(['/clients/edit', this.client._id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}