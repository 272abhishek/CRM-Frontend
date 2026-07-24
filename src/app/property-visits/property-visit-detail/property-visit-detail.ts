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
          (res: any) => {


            console.log(

              'VISIT DETAIL RESPONSE:',

              res

            );


            // Backend response:
            // { data: visit }

            this.visit =
              res?.data || res;
            

            this.loading =
              false;


            this.cdr

              .detectChanges();

          },


        error:
          (err) => {


            console.error(

              'GET VISIT DETAIL ERROR:',

              err

            );


            this.loading =
              false;


            alert(

              err.error?.message ||

              'Failed to load visit'

            );

          }

      });

  }


  // =====================================================
  // CHECK POPULATED OBJECT
  // =====================================================

  isPopulatedObject(

    value:
      any

  ): boolean {


    return (

      value !== null &&

      typeof value === 'object' &&

      '_id' in value

    );

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