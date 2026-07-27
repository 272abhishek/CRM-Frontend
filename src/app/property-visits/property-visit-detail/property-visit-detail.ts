// src/app/property-visits/property-visit-detail/property-visit-detail.ts

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
  PropertyVisit,
  VisitClient,
  VisitProperty,
  VisitUser,
  VisitDeal
} from '../propertyInterface';

import {
  PropertyVisitService
} from '../property-visit';


@Component({

  selector:
    'app-property-visit-detail',

  standalone:
    true,

  imports: [

    CommonModule,

    RouterModule

  ],

  templateUrl:
    './property-visit-detail.html',

  styleUrls: [

    './property-visit-detail.scss'

  ]

})


export class PropertyVisitDetail

implements OnInit {


  // =====================================================
  // VISIT DATA
  // =====================================================

  visit:
    PropertyVisit | null =
    null;


  // =====================================================
  // LOADING
  // =====================================================

  loading:
    boolean =
    true;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private route:
      ActivatedRoute,

    private service:
      PropertyVisitService,

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

      alert(
        'Visit ID missing'
      );

      return;

    }


    this.loadVisit(id);

  }


  // =====================================================
  // LOAD VISIT
  // =====================================================

  loadVisit(

    id:
      string

  ): void {

    this.loading =
      true;


    this.service

      .getVisitById(id)

      .subscribe({

        next:

          (response: any) => {

            console.log(

              'VISIT DETAIL RESPONSE:',

              response

            );


            this.visit =

              response?.data ||

              response;


            this.loading =
              false;


            this.cdr.detectChanges();

          },


        error:

          (error) => {

            console.error(

              'GET VISIT DETAIL ERROR:',

              error

            );


            this.loading =
              false;


            alert(

              error.error?.message ||

              'Failed to load visit'

            );

          }

      });

  }


  // =====================================================
  // CLIENT HELPERS
  // =====================================================

  getClient():

    VisitClient | null {

    if (

      !this.visit ||

      typeof this.visit.clientId === 'string'

    ) {

      return null;

    }


    return this.visit.clientId;

  }


  // =====================================================
  // PROPERTY HELPERS
  // =====================================================

  getProperty():

    VisitProperty | null {

    if (

      !this.visit ||

      typeof this.visit.propertyId === 'string'

    ) {

      return null;

    }


    return this.visit.propertyId;

  }


  // =====================================================
  // SELLER HELPERS
  // =====================================================

  getSeller():

    VisitUser | null {

    if (

      !this.visit ||

      !this.visit.sellerId ||

      typeof this.visit.sellerId === 'string'

    ) {

      return null;

    }


    return this.visit.sellerId;

  }


  // =====================================================
  // CREATED BY
  // =====================================================

  getCreatedBy():

    VisitUser | null {

    if (

      !this.visit ||

      !this.visit.createdBy ||

      typeof this.visit.createdBy === 'string'

    ) {

      return null;

    }


    return this.visit.createdBy;

  }


  // =====================================================
  // DEAL
  // =====================================================

  getDeal():

    VisitDeal | null {

    if (

      !this.visit ||

      !this.visit.dealId ||

      typeof this.visit.dealId === 'string'

    ) {

      return null;

    }


    return this.visit.dealId;

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(

    status:
      string | undefined

  ): string {

    if (!status) {

      return 'status-unknown';

    }


    return (

      'status-' +

      status

        .toLowerCase()

        .replace(

          /\s+/g,

          '-'

        )

    );

  }

}