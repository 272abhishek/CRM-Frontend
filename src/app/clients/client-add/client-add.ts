import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Client } from '../client';
import { NotificationServices } from '../../core/notification/notification-services';
@Component({
  selector: 'app-client-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './client-add.html',
  styleUrls: ['./client-add.scss']
})
export class ClientAdd {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: Client,
    private router: Router,
    private notification: NotificationServices
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      budget: [null],
      requirement: [''],
      interestedProject: [''],
      preferredLocation: [''],
      timeline: [''],
      followUpNotes: [''],
      leadSource: [''],
      priority: ['Medium', Validators.required],
      communicationPreference: ['Call', Validators.required]
    });
  }

  private getUser() {
    const raw = localStorage.getItem('user');

    if (!raw) return null;

    try {
      const user = JSON.parse(raw);

      return {
        id: user._id || user.id,
        role: user.role
      };
    } catch {
      return null;
    }
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const user = this.getUser();

    if (!user) {
      this.notification.warning('Session expired, please login again.');
      return;
    }

    const formValue = this.clientForm.value;

    const payload = {
      ...formValue,

      followUpNotes: formValue.followUpNotes?.trim()
        ? [
            {
              note: formValue.followUpNotes.trim()
            }
          ]
        : [],

      createdBy: user.id
    };

    this.clientService.createClient(payload).subscribe({
      next: (res: any) => {
        this.notification.success(
    res?.message || 'Client created successfully!'
  );
        this.router.navigate(['/clients']);
      },

      error: (err) => {
       console.error('❌ Create Client Error:', err);

  const message =
    err?.error?.error ||
    err?.error?.message ||
    err?.message ||
    'Failed to create client';

  this.notification.error(message);
      }
    });
  }
}