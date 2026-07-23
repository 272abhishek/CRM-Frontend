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
  DealService,
  Deal,
  DealQueryParams
} from '../deal';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';


@Component({

  selector:
    'app-deal-list',

  standalone:
    true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterModule

  ],

  templateUrl:
    './deal-list.html',

  styleUrls:
    ['./deal-list.scss']

})


export class DealList
implements OnInit {


  // =====================================================
  // UI STATE
  // =====================================================

  showFilters =
    false;


  loading =
    false;


  deals:
    Deal[] = [];


  userRole:
    string | null = null;


  currentPage:
    number = 1;


  pageSize:
    number = 10;


  totalItems:
    number = 0;


  totalPages:
    number = 1;


  // =====================================================
  // FILTER FORM
  // =====================================================

  filterForm =
    new FormGroup({

      q:
        new FormControl(''),

      name:
        new FormControl(''),

      status:
        new FormControl(''),

      paymentStatus:
        new FormControl(''),

      propertyId:
        new FormControl(''),

      clientId:
        new FormControl(''),

      minDealAmount:
        new FormControl(''),

      maxDealAmount:
        new FormControl(''),

      minCommissionAmount:
        new FormControl(''),

      maxCommissionAmount:
        new FormControl(''),

      minCommissionPercentage:
        new FormControl(''),

      maxCommissionPercentage:
        new FormControl(''),

      dealDate:
        new FormControl(''),

      fromDate:
        new FormControl(''),

      toDate:
        new FormControl('')

    });


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private router:
      Router,

    private dealService:
      DealService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit() {


    const rawUser =
      localStorage.getItem('user');


    if (rawUser) {

      try {

        const user =
          JSON.parse(rawUser);


        this.userRole =
          user.role;

      }

      catch (error) {

        console.error(
          'Invalid user data',
          error
        );

      }

    }


    this.loadDeals();


    // Auto filter

    this.filterForm.valueChanges
      .subscribe(() => {


        this.currentPage =
          1;


        this.loadDeals();

      });

  }


  // =====================================================
  // LOAD DEALS
  // =====================================================

  loadDeals() {


    this.loading =
      true;


    const f =
      this.filterForm.value;


    const params:
      DealQueryParams = {


      page:
        this.currentPage,


      limit:
        this.pageSize,


      q:
        f.q || undefined,


      name:
        f.name || undefined,


      status:
        f.status || undefined,


      paymentStatus:
        f.paymentStatus || undefined,


      propertyId:
        f.propertyId || undefined,


      clientId:
        f.clientId || undefined

    };


    // =====================================================
    // DEAL AMOUNT RANGE
    // =====================================================

    this.addRangeFilter(

      params,

      'dealAmount',

      f.minDealAmount,

      f.maxDealAmount

    );


    // =====================================================
    // COMMISSION AMOUNT RANGE
    // =====================================================

    this.addRangeFilter(

      params,

      'commissionAmount',

      f.minCommissionAmount,

      f.maxCommissionAmount

    );


    // =====================================================
    // COMMISSION PERCENTAGE RANGE
    // =====================================================

    this.addRangeFilter(

      params,

      'commissionPercentage',

      f.minCommissionPercentage,

      f.maxCommissionPercentage

    );


    // =====================================================
    // DEAL DATE
    // =====================================================

    if (f.dealDate) {

      params['dealDate'] =
        f.dealDate;

    }


    // =====================================================
    // DATE RANGE
    // =====================================================

    if (f.fromDate) {

      params['dealDate[min]'] =
        f.fromDate;

    }


    if (f.toDate) {

      params['dealDate[max]'] =
        f.toDate;

    }


    // =====================================================
    // API CALL
    // =====================================================

    this.dealService
      .getDeals(params)
      .subscribe({

        next: (res) => {


          this.deals =
            res.data;


          this.totalItems =
            res.total;


          this.totalPages =
            Math.ceil(

              res.total /
              this.pageSize

            ) || 1;


          this.loading =
            false;


          this.cdr.detectChanges();

        },


        error: (err) => {


          console.error(
            'Failed to load deals',
            err
          );


          this.loading =
            false;


          alert(

            err.error?.message ||

            err.error?.error ||

            'Failed to load deals'

          );

        }

      });

  }


  // =====================================================
  // RANGE FILTER HELPER
  // =====================================================

  private addRangeFilter(

    params:
      DealQueryParams,

    field:
      string,

    min:
      any,

    max:
      any

  ) {


    if (

      min !== null &&

      min !== undefined &&

      min !== ''

    ) {

      params[`${field}[min]`] =
        min;

    }


    if (

      max !== null &&

      max !== undefined &&

      max !== ''

    ) {

      params[`${field}[max]`] =
        max;

    }

  }


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  clearFilters() {


    this.filterForm.reset({

      q:
        '',

      name:
        '',

      status:
        '',

      paymentStatus:
        '',

      propertyId:
        '',

      clientId:
        '',

      minDealAmount:
        '',

      maxDealAmount:
        '',

      minCommissionAmount:
        '',

      maxCommissionAmount:
        '',

      minCommissionPercentage:
        '',

      maxCommissionPercentage:
        '',

      dealDate:
        '',

      fromDate:
        '',

      toDate:
        ''

    });


    this.currentPage =
      1;


    this.loadDeals();

  }


  // =====================================================
  // PAGINATION
  // =====================================================

  goToPage(

    page:
      number

  ) {


    if (

      page < 1 ||

      page > this.totalPages

    ) {

      return;

    }


    this.currentPage =
      page;


    this.loadDeals();

  }


  // =====================================================
  // EDIT DEAL
  // =====================================================

  editDeal(

    id:
      string

  ) {


    this.router.navigate([

      '/deals/edit',

      id

    ]);

  }


  // =====================================================
  // VIEW DEAL
  // =====================================================

  viewDeal(

    id:
      string

  ) {


    this.router.navigate([

      '/deals',

      id

    ]);

  }


  // =====================================================
  // DELETE DEAL
  // =====================================================

  deleteDeal(

    id:
      string

  ) {


    if (

      !confirm(

        'Are you sure you want to delete this deal?'

      )

    ) {

      return;

    }


    this.dealService
      .deleteDeal(id)
      .subscribe({

        next: () => {


          this.deals =
            this.deals.filter(

              deal =>
                deal._id !== id

            );


          this.totalItems--;


          // Agar current page empty ho jaye

          if (

            this.deals.length === 0 &&

            this.currentPage > 1

          ) {

            this.currentPage--;


            this.loadDeals();

          }

        },


        error: (err) => {


          console.error(
            'Delete failed',
            err
          );


          alert(

            err.error?.message ||

            err.error?.error ||

            'Delete failed'

          );

        }

      });

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(

    status:
      string | undefined

  ) {


    if (!status) {

      return 'default';

    }


    return status

      .toLowerCase()

      .replace(

        /\s+/g,

        '-'

      );

  }


  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  get pages(): number[] {


    return Array.from(

      {

        length:
          this.totalPages

      },

      (_, index) =>
        index + 1

    );

  }

}