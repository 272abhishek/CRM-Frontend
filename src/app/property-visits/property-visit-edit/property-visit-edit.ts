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
  RouterModule
} from '@angular/router';

import {
  PropertyVisitService
} from '../property-visit';

import {
  PropertyVisit,
  VisitStatus
} from '../propertyInterface';


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


  // =====================================================
  // VISIT FORM
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

                ''

            });


            this.loading =
              false;


            // Force UI update

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


            alert(

              error.error?.message ||

              'Failed to load visit'

            );

          }

      });

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


    if (

      this.visitForm.invalid

    ) {


      this.visitForm

        .markAllAsTouched();


      alert(

        'Please fill all required fields'

      );


      return;

    }


    const id =
      this.visit?._id;


    if (!id) {


      alert(

        'Visit ID missing'

      );


      return;

    }


    this.saving =
      true;


    this.cdr.detectChanges();


    const formValue =
      this.visitForm.getRawValue();


    const payload = {


      visitDate:

        formValue.visitDate,


      status:

        formValue.status,


      notes:

        formValue.notes

    };


    console.log(

      'UPDATE VISIT PAYLOAD:',

      payload

    );


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


            alert(

              'Property visit updated successfully'

            );


            this.saving =
              false;


            this.cdr.detectChanges();


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


            alert(

              error.error?.message ||

              'Failed to update visit'

            );

          }

      });

  }

}