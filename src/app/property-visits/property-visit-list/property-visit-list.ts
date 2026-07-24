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
  VisitStatus
} from '../propertyInterface';

import {
  PropertyVisitService
} from '../property-visit';


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
        new FormControl<string>(''),

      clientId:
        new FormControl<string>(''),

      propertyId:
        new FormControl<string>(''),

      status:
        new FormControl<string>('')

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
      ChangeDetectorRef

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
  // LOAD VISITS
  // =====================================================

  loadVisits(): void {


    this.loading =
      true;


    const f =
      this.filterForm.getRawValue();


    // =====================================================
    // STATUS TYPE-SAFE VALUE
    // =====================================================

    const status =
      this.isValidVisitStatus(

        f.status

      )

        ? f.status

        : undefined;


    // =====================================================
    // QUERY PARAMS
    // =====================================================

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


    // =====================================================
    // API CALL
    // =====================================================

    this.visitService

      .getVisits(params)

      .subscribe({

        next:

          (res) => {


            console.log(

              'Property Visits Response:',

              res

            );


            // =================================================
            // DATA
            // =================================================

            this.visits =

              Array.isArray(res?.data)

                ? res.data

                : [];


            // =================================================
            // TOTAL ITEMS
            // =================================================

            this.totalItems =

              Number(

                res?.totalItems ??

                this.visits.length

              );


            // =================================================
            // TOTAL PAGES
            // =================================================

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


            alert(

              err.error?.message ||

              'Failed to load property visits'

            );

          }

      });

  }


  // =====================================================
  // VISIT STATUS VALIDATOR
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

      'Not Interested',

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
  // NEXT PAGE
  // =====================================================

  nextPage(): void {


    if (

      this.currentPage <

      this.totalPages

    ) {


      this.currentPage++;


      this.loadVisits();

    }

  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {


    if (

      this.currentPage > 1

    ) {


      this.currentPage--;


      this.loadVisits();

    }

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
  // VIEW DETAIL
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

  deleteVisit(

    id:
      string

  ): void {


    const confirmed =

      confirm(

        'Are you sure you want to delete this visit?'

      );


    if (

      !confirmed

    ) {

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


            if (

              this.visits.length === 0 &&

              this.currentPage > 1

            ) {


              this.currentPage--;


              this.loadVisits();

            }

            else {


              this.loading =
                false;


              this.cdr.detectChanges();

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


            alert(

              err.error?.message ||

              'Failed to delete visit'

            );

          }

      });

  }

}