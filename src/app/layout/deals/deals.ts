import { Component } from '@angular/core';

import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';


@Component({

  selector: 'app-deal',

  standalone: true,

  imports: [

    RouterOutlet,

    RouterLink,

    RouterLinkActive

  ],

  templateUrl: './deals.html',

  styleUrl: './deals.scss'

})


export class Deals {


}