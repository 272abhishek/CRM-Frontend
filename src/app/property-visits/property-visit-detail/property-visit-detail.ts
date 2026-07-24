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

  PropertyVisit

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


  visit:
    PropertyVisit | null =
    null;


  loading:
    boolean =
    true;


  constructor(

    private route:
      ActivatedRoute,

    private service:
      PropertyVisitService,

    private cdr:
      ChangeDetectorRef

  ) {}


  ngOnInit(): void {


    const id =
      this.route

        .snapshot

        .paramMap

        .get('id');


    if (!id) {

      return;

    }


    this.service
      .getVisitById(id)
      .subscribe({

        next:
          (res) => {


            this.visit =
              res;


            this.loading =
              false;


            this.cdr
              .detectChanges();

          },


        error:
          (err) => {


            this.loading =
              false;


            alert(

              err.error?.message ||

              'Failed to load visit'

            );

          }

      });

  }

}