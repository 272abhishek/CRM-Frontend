import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api'; // adjust path if needed
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule,MatError  } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { } from '@angular/material/form-field';
import { NotificationServices } from '../../core/notification/notification-services';
@Component({
  selector: 'app-login',
   standalone: true,
  templateUrl: './login.html',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatError],
  styleUrls: ['./login.scss']
})
export class Login {
  form: FormGroup;
user: any;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private notification: NotificationServices
  ) {
    // ✅ initialize form inside constructor
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
onSubmit() {

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.api.post('/auth/login', this.form.value).subscribe({

    next: (res: any) => {

      localStorage.setItem('jwt', res.token);

      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      this.notification.success(
        res?.message || 'Login successful'
      );

      this.router.navigate(['/profile']);

    },

    error: (err) => {

      console.error(err);

      const message =
        err?.error?.error ||
        err?.error?.message ||
        err?.message ||
        'Login failed';

      this.notification.error(message);

    }

  });

}
}
