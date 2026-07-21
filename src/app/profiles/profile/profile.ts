import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ApiService } from '../../core/api'; // ✅ adjust path if needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
 
  user: any = null;

  constructor(private api: ApiService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
  console.log('Profile Component Loaded');

  this.api.get('/auth/profile').subscribe({
    next: (res: any) => {
      console.log('Profile Response:', res);

      this.user = { ...res.data }; // 👈 Spread operator use karo
 this.cdr.detectChanges(); // 👈 force manual update
      console.log('User:', this.user);
    }
  });
}
}