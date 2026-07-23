import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLink
} from '@angular/router';

@Component({
  selector: 'app-property',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './property.html',
  styleUrl: './property.scss'
})
export class Property {}