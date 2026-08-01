// src/app/property-visits/property-visit-list/property-visit-list.ts

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  PropertyVisit,
  PropertyVisitQueryParams,
  VisitStatus,
  VisitClient,
  VisitProperty
} from '../propertyInterface';

import {
  PropertyVisitService
} from '../property-visit';

import { NotificationServices } from '../../core/notification/notification-services';
// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector:
    'app-property-visit-list',

  standalone:
    true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterModule

  ],

  templateUrl:
    './property-visit-list.html',

  styleUrls: [

    './property-visit-list.scss'

  ]

})


// =====================================================
// CLASS
// =====================================================

export class PropertyVisitList
implements OnInit {


  // =====================================================
  // VISITS
  // =====================================================

  visits:
    PropertyVisit[] = [];


  // =====================================================
  // PAGINATION
  // =====================================================

  currentPage:
    number = 1;


  pageSize:
    number = 10;


  totalItems:
    number = 0;


  totalPages:
    number = 1;


  // =====================================================
  // UI
  // =====================================================

  showFilters:
    boolean = false;


  loading:
    boolean = false;


  // =====================================================
  // FILTER FORM
  // =====================================================

  filterForm =

    new FormGroup({

      q:
        new FormControl<string>('', {

          nonNullable:
            true

        }),


      clientId:
        new FormControl<string>('', {

          nonNullable:
            true

        }),


      propertyId:
        new FormControl<string>('', {

          nonNullable:
            true

        }),


      status:
        new FormControl<string>('', {

          nonNullable:
            true

        })

    });


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private visitService:
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


    this.loadVisits();


    this.filterForm.valueChanges

      .subscribe(() => {


        this.currentPage =
          1;


        this.loadVisits();

      });

  }


  // =====================================================
  // CLIENT TYPE GUARD
  // =====================================================

  isClientObject(

    clientId:
      string |

      VisitClient

  ): clientId is VisitClient {


    return (

      typeof clientId ===

      'object' &&

      clientId !== null

    );

  }


  // =====================================================
  // PROPERTY TYPE GUARD
  // =====================================================

  isPropertyObject(

    propertyId:
      string |

      VisitProperty

  ): propertyId is VisitProperty {


    return (

      typeof propertyId ===

      'object' &&

      propertyId !== null

    );

  }


  // =====================================================
  // CLIENT NAME
  // =====================================================

  getClientName(

    visit:
      PropertyVisit

  ): string {


    if (

      this.isClientObject(

        visit.clientId

      )

    ) {


      return (

        visit.clientId.name ||

        '—'

      );

    }


    return (

      visit.clientId ||

      '—'

    );

  }


  // =====================================================
  // CLIENT PHONE
  // =====================================================

  getClientPhone(

    visit:
      PropertyVisit

  ): string {


    if (

      this.isClientObject(

        visit.clientId

      )

    ) {


      return (

        visit.clientId.phone ||

        ''

      );

    }


    return '';

  }


  // =====================================================
  // PROPERTY TITLE
  // =====================================================

  getPropertyTitle(

    visit:
      PropertyVisit

  ): string {


    if (

      this.isPropertyObject(

        visit.propertyId

      )

    ) {


      return (

        visit.propertyId.title ||

        '—'

      );

    }


    return (

      visit.propertyId ||

      '—'

    );

  }


  // =====================================================
  // PROPERTY AREA
  // =====================================================

  getPropertyArea(

    visit:
      PropertyVisit

  ): string {


    if (

      this.isPropertyObject(

        visit.propertyId

      )

    ) {


      return (

        visit.propertyId.area ||

        ''

      );

    }


    return '';

  }


  // =====================================================
  // LOAD VISITS
  // =====================================================

  loadVisits(): void {


    this.loading =
      true;


    const f =
      this.filterForm.getRawValue();


    const status =

      this.isValidVisitStatus(

        f.status

      )

        ? f.status

        : undefined;


    const params:

      PropertyVisitQueryParams = {


      page:
        this.currentPage,


      limit:
        this.pageSize,


      q:
        f.q || undefined,


      clientId:
        f.clientId || undefined,


      propertyId:
        f.propertyId || undefined,


      status:
        status

    };


    this.visitService

      .getVisits(params)

      .subscribe({

        next:

          (res) => {


            console.log(

              'Property Visits Response:',

              res

            );


            this.visits =

              Array.isArray(

                res?.data

              )

                ? res.data

                : [];


            this.totalItems =

              Number(

                res?.totalItems ??

                this.visits.length

              );


            this.totalPages =

              Number(

                res?.totalPages ??

                Math.ceil(

                  this.totalItems /

                  this.pageSize

                )

              ) || 1;


            this.loading =
              false;


            this.cdr.detectChanges();

          },


        error:

          (err) => {


            console.error(

              'Load Property Visits Error:',

              err

            );


            this.visits =
              [];


            this.totalItems =
              0;


            this.totalPages =
              1;


            this.loading =
              false;


            this.cdr.detectChanges();


           this.notification.error(

  err.error?.message ||

  'Failed to load property visits'

);

          }

      });

  }


  // =====================================================
  // STATUS VALIDATOR
  // =====================================================

  private isValidVisitStatus(

    status:
      string |

      null |

      undefined

  ): status is VisitStatus {


    return [

      'Scheduled',

      'Planned',

      'Visited',

      'Interested',

      'Not Interested',

      'Shortlisted',

      'Selected',

      'Rejected',

      'Negotiation',

      'Closed',

      'Cancelled'

    ].includes(

      status as VisitStatus

    );

  }


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  clearFilters(): void {


    this.filterForm.reset({

      q:
        '',

      clientId:
        '',

      propertyId:
        '',

      status:
        ''

    });


    this.currentPage =
      1;


    this.loadVisits();

  }


  // =====================================================
  // GO TO PAGE
  // =====================================================

  goToPage(

    page:
      number

  ): void {


    if (

      page < 1 ||

      page > this.totalPages

    ) {

      return;

    }


    this.currentPage =
      page;


    this.loadVisits();

  }


  // =====================================================
  // EDIT VISIT
  // =====================================================

  editVisit(

    id:
      string

  ): void {


    this.router.navigate([

      '/property-visits/edit',

      id

    ]);

  }


  // =====================================================
  // VIEW VISIT
  // =====================================================

  viewVisit(

    id:
      string

  ): void {


    this.router.navigate([

      '/property-visits',

      id

    ]);

  }


  // =====================================================
  // DELETE VISIT
  // =====================================================
// =====================================================
// DELETE VISIT
// =====================================================

async deleteVisit(

  id:
    string

): Promise<void> {


  const confirmed =

    await this.notification.confirmDelete(

      'Delete Property Visit?',

      'This property visit will be permanently deleted.'

    );


  if (!confirmed) {

    return;

  }


  this.loading =
    true;


  this.visitService

    .deleteVisit(id)

    .subscribe({

      next:

        () => {


          this.visits =

            this.visits.filter(

              visit =>

                visit._id !== id

            );


          this.totalItems =

            Math.max(

              0,

              this.totalItems - 1

            );


          this.totalPages =

            Math.ceil(

              this.totalItems /

              this.pageSize

            ) || 1;


          this.loading =
            false;


          this.cdr.detectChanges();


          this.notification.success(

            'Property visit deleted successfully'

          );


          if (

            this.visits.length === 0 &&

            this.currentPage > 1

          ) {


            this.currentPage--;


            this.loadVisits();

          }

        },


      error:

        (err) => {


          console.error(

            'Delete Visit Error:',

            err

          );


          this.loading =
            false;


          this.cdr.detectChanges();


          this.notification.error(

            err.error?.message ||

            'Failed to delete property visit'

          );

        }

    });

}

}