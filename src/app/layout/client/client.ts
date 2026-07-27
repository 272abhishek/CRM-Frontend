import {
  Component
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';


@Component({

  selector: 'app-client',

  standalone: true,

  imports: [

    RouterLink,

    RouterLinkActive,

    RouterOutlet

  ],

  templateUrl: './client.html',

  styleUrl: './client.scss'

})


export class Client {

}