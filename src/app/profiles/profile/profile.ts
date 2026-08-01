import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import { ApiService } from '../../core/api';
import { NotificationServices } from '../../core/notification/notification-services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile.html',
  styleUrls: [
    './profile.scss'
  ]
})
export class Profile implements OnInit {

  // ===================================================
  // STATE
  // ===================================================

  user: any = null;

  loading = false;

  // ===================================================
  // CONSTRUCTOR
  // ===================================================

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationServices
  ) {}

  // ===================================================
  // INIT
  // ===================================================

  ngOnInit(): void {

    this.loadProfile();

  }

  // ===================================================
  // LOAD PROFILE
  // ===================================================

  loadProfile(): void {

    this.loading = true;

    console.log('Profile Component Loaded');

    this.api
      .get('/auth/profile')
      .subscribe({

        next: (res: any) => {

          console.log('Profile Response:', res);

          this.user = {
            ...res.data
          };

          this.loading = false;

          this.cdr.detectChanges();

          console.log('User:', this.user);

        },

        error: (err: any) => {

          console.error(
            'PROFILE LOAD ERROR:',
            err
          );

          this.loading = false;

          this.notification.error(

            err?.error?.message ||

            err?.error?.error ||

            'Failed to load profile.'

          );

          this.cdr.detectChanges();

        }

      });

  }

}