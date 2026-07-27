import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
  import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ RouterLink,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

constructor(
  private router: Router
) {}
  logout(): void {

  localStorage.clear();

  this.router.navigate(['/login']);

}
}
