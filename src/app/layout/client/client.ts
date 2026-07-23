import {
  Component
} from '@angular/core';

import {
  RouterOutlet,
  RouterLink
} from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './client.html',
  styleUrl: './client.scss'
})
export class Client {}