
// src/app/property-visits/property-visit-edit/property-visit-edit.ts

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterModule,
  
} from '@angular/router';

import {
  PropertyVisitService
} from '../property-visit';

import {
  PropertyVisit,
  VisitStatus,
  VisitClient,
  VisitProperty
} from '../propertyInterface';
import { NotificationServices } from '../../core/notification/notification-services';

@Component({

  selector:
    'app-property-visit-edit',

  standalone:
    true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterModule

  ],

  templateUrl:
    './property-visit-edit.html',

  styleUrl:
    './property-visit-edit.scss'

})


export class PropertyVisitEdit

implements OnInit {


  // =====================================================
  // VISIT
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


  saving:
    boolean =
    false;
    today = new Date()
  .toISOString()
  .split('T')[0];

  // =====================================================
  // FORM
  // =====================================================

  visitForm =

    new FormGroup({

      visitDate:

        new FormControl<string>(

          '',

          {

            nonNullable:
              true,

            validators: [

              Validators.required

            ]

          }

        ),


      status:

        new FormControl<VisitStatus>(

          'Planned',

          {

            nonNullable:
              true,

            validators: [

              Validators.required

            ]

          }

        ),


      notes:

        new FormControl<string>(

          '',

          {

            nonNullable:
              true

          }

        ),


      // =================================================
      // TOKEN AMOUNT
      // =================================================

      tokenAmount:

        new FormControl<number | null>(

          null,

          [

            Validators.min(0)

          ]

        ),


      // =================================================
      // FINAL DEAL AMOUNT
      // =================================================

      amount:

        new FormControl<number | null>(

          null,

          [

            Validators.min(0)

          ]

        )

    });


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private route:
      ActivatedRoute,

    private service:
      PropertyVisitService,

    private router:
      Router,

    private cdr:
      ChangeDetectorRef,
        private notification: NotificationServices

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

      this.notification.error('Visit ID missing');

      this.cdr.detectChanges();

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


    this.cdr.detectChanges();


    this.service

      .getVisitById(id)

      .subscribe({

        next:

          (response: any) => {

            console.log(

              'EDIT VISIT RESPONSE:',

              response

            );


            const visit:

              PropertyVisit =

              response?.data ||

              response;


            this.visit =
              visit;


            this.visitForm.patchValue({

              visitDate:

                this.formatDateForInput(

                  visit.visitDate

                ),


              status:

                visit.status ||

                'Planned',


              notes:

                visit.notes ||

                '',


              // Existing deal values
              // if available

              tokenAmount:

                (visit as any)

                  .dealId

                  ?.tokenAmount ??

                null,


              amount:

                (visit as any)

                  .dealId

                  ?.amount ??

                null

            });


            this.loading =
              false;


            this.cdr.detectChanges();

          },


        error:

          (error) => {

            console.error(

              'LOAD VISIT ERROR:',

              error

            );


            this.loading =
              false;


            this.cdr.detectChanges();


            this.notification.error(
  error.error?.message ||
  'Failed to load visit'
);

          }

      });

  }


  // =====================================================
  // CLIENT HELPER
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
  // PROPERTY HELPER
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
  // DATE FORMAT
  // =====================================================

  formatDateForInput(

    date:
      string |

      undefined

  ): string {

    if (!date) {

      return '';

    }


    const parsedDate =

      new Date(date);


    if (

      isNaN(

        parsedDate.getTime()

      )

    ) {

      return '';

    }


    return parsedDate

      .toISOString()

      .split('T')[0];

  }


  // =====================================================
  // UPDATE VISIT
  // =====================================================

  submit(): void {


    // =================================================
    // FORM VALIDATION
    // =================================================

    if (

      this.visitForm.invalid

    ) {

      this.visitForm

        .markAllAsTouched();

this.notification.warning(
  'Please fill all required fields'
);

      return;

    }


    const id =

      this.visit?._id;


    if (!id) {

     this.notification.error(
  'Visit ID missing'
);

      return;

    }


    this.saving =
      true;


    this.cdr.detectChanges();


    const formValue =

      this.visitForm

        .getRawValue();


    // =================================================
    // PAYLOAD
    // =================================================

    const payload = {


      visitDate:

        formValue.visitDate,


      status:

        formValue.status,


      notes:

        formValue.notes,


      // Token amount

      tokenAmount:

        formValue.tokenAmount || 0,


      // Final deal amount

      amount:

        formValue.amount || 0

    };


    console.log(

      'UPDATE VISIT PAYLOAD:',

      payload

    );


    // =================================================
    // API CALL
    // =================================================

    this.service

      .updateVisit(

        id,

        payload

      )

      .subscribe({

        next:

          (response) => {

            console.log(

              'VISIT UPDATED:',

              response

            );


            this.saving =
              false;


            this.cdr.detectChanges();


            this.notification.success(

  formValue.status === 'Closed'
    ? 'Visit closed and deal created successfully'
    : 'Property visit updated successfully'

);


            this.router.navigate([

              '/property-visits',

              id

            ]);

          },


        error:

          (error) => {

            console.error(

              'UPDATE VISIT ERROR:',

              error

            );


            this.saving =
              false;


            this.cdr.detectChanges();


           this.notification.error(

  error.error?.message ||

  error.error?.error ||

  'Failed to update visit'

);

          }

      });

  }

}

