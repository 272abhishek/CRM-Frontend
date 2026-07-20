import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api'; // adjust path if needed
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule,MatError  } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { } from '@angular/material/form-field';
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
    private router: Router
  ) {
    // ✅ initialize form inside constructor
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.api.post('/auth/login', this.form.value).subscribe({
        next: (res: any) => {
          console.log(res.token)
          localStorage.setItem('jwt', res.token);
          
          
           this.router.navigate(['/profile']);
          // switch (res.user?.role) {
          //   case 'admin': this.router.navigate(['/admin-dashboard']); break;
          //   case 'agent': this.router.navigate(['/agent-dashboard']); break;
          //   case 'client': this.router.navigate(['/client-dashboard']); break;
          //   case 'builder': this.router.navigate(['/builder-dashboard']); break;
          //   case 'seller': this.router.navigate(['/seller-dashboard']); break;
          //   default: this.router.navigate(['/dashboard']);
          // }
        },
        error: (err) => {
          alert(err.error?.message || 'Login failed, please try again.');
        }
      });
    }
  }
}
