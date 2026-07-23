import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  Deal,
  DealService
} from '../deal';


@Component({

  selector:
    'app-deal-detail',

  standalone:
    true,

  imports: [

    CommonModule,

    RouterModule

  ],

  templateUrl:
    './deal-detail.html',

  styleUrls: [

    './deal-detail.scss'

  ]

})


export class DealDetail
implements OnInit {


  // =====================================================
  // DEAL DATA
  // =====================================================

  deal:
    Deal | null =
    null;


  // =====================================================
  // LOADING STATE
  // =====================================================

  loading:
    boolean =
    true;


  // =====================================================
  // ERROR STATE
  // =====================================================

  errorMessage:
    string =
    '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private route:
      ActivatedRoute,

    private dealService:
      DealService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {


    const id =
      this.route
        .snapshot
        .paramMap
        .get('id');


    if (!id) {

      this.loading =
        false;

      this.errorMessage =
        'Deal ID not found';

      return;

    }


    this.loadDeal(id);

  }


  // =====================================================
  // LOAD DEAL
  // =====================================================

  private loadDeal(
    id: string
  ): void {


    this.loading =
      true;


    this.dealService
      .getDealById(id)
      .subscribe({

        next: (
          response: Deal
        ) => {


          this.deal =
            response;


          this.loading =
            false;


          this.errorMessage =
            '';


          console.log(

            'Deal Details:',

            this.deal

          );


          this.cdr
            .detectChanges();

        },


        error: (
          err
        ) => {


          console.error(

            'Failed to load deal:',

            err

          );


          this.loading =
            false;


          this.errorMessage =

            err.error?.message ||

            'Failed to load deal';


          this.cdr
            .detectChanges();

        }

      });

  }

}