import {
  Component
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';


@Component({

  selector: 'app-property',

  standalone: true,

  imports: [

    RouterLink,

    RouterLinkActive,

    RouterOutlet

  ],

  templateUrl: './property.html',

  styleUrl: './property.scss'

})


export class Property {


}