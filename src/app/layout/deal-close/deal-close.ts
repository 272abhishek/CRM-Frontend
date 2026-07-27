import {
  Component
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';


@Component({

  selector: 'app-deal-close',

  standalone: true,

  imports: [

    RouterLink,

    RouterLinkActive,

    RouterOutlet

  ],

  templateUrl: './deal-close.html',

  styleUrl: './deal-close.scss'

})


export class DealClose {

}