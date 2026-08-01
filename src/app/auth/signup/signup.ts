import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api'; // ✅ correct path
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationServices } from '../../core/notification/notification-services';
@Component({
  selector: 'app-signup',
   standalone: true,
  templateUrl: './signup.html',
  imports : [CommonModule, ReactiveFormsModule,MatFormFieldModule, MatInputModule],
  styleUrls: ['./signup.scss']
})
export class Signup {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private notification: NotificationServices
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''], // optional
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }
onSubmit() {

  if (this.form.invalid) {

    this.form.markAllAsTouched();

    return;

  }

  this.api.post('/auth/register', this.form.value).subscribe({

    next: (res: any) => {

      this.notification.success(

        res?.message || 'Account created successfully'

      );

      this.router.navigate(['/login']);

    },

    error: (err) => {

      console.error(err);

      const message =

        err?.error?.error ||

        err?.error?.message ||

        err?.message ||

        'Signup failed';

      this.notification.error(message);

    }

  });

}
}

