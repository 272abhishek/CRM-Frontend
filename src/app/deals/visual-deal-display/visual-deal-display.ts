import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Chart,
  registerables
} from 'chart.js';

import {
  Deal,
  DealService
} from '../deal';


// =====================================================
// REGISTER CHART.JS
// =====================================================

Chart.register(
  ...registerables
);


// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector:
    'app-visual-deal-display',

  standalone:
    true,

  imports: [

    CommonModule

  ],

  templateUrl:
    './visual-deal-display.html',

  styleUrl:
    './visual-deal-display.scss'

})


export class VisualDealDisplay

  implements

    OnInit,

    OnDestroy {


  // =====================================================
  // CANVAS REFERENCES
  // =====================================================

  @ViewChild(
    'statusChart'
  )

  statusChart?:
    ElementRef<HTMLCanvasElement>;


  @ViewChild(
    'paymentChart'
  )

  paymentChart?:
    ElementRef<HTMLCanvasElement>;


  @ViewChild(
    'amountChart'
  )

  amountChart?:
    ElementRef<HTMLCanvasElement>;


  @ViewChild(
    'commissionChart'
  )

  commissionChart?:
    ElementRef<HTMLCanvasElement>;


  // =====================================================
  // DATA
  // =====================================================

  deals:
    Deal[] = [];


  loading:
    boolean = false;


  errorMessage:
    string = '';


  // =====================================================
  // KPI
  // =====================================================

  totalDeals:
    number = 0;


  totalDealAmount:
    number = 0;


  totalCommission:
    number = 0;


  closedDeals:
    number = 0;


  openDeals:
    number = 0;


  negotiationDeals:
    number = 0;


  cancelledDeals:
    number = 0;


  pendingPayments:
    number = 0;


  partialPayments:
    number = 0;


  paidPayments:
    number = 0;


  completedPayments:
    number = 0;


  // =====================================================
  // CHARTS
  // =====================================================

  private charts:
    Chart[] = [];


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private dealService:
      DealService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit():
    void {

    this.loadDeals();

  }


  // =====================================================
  // LOAD DEALS
  // =====================================================

  loadDeals():
    void {


    this.loading =
      true;


    this.errorMessage =
      '';


    this.destroyCharts();


    this.dealService

      .getDeals({

        page:
          1,

        limit:
          1000

      })

      .subscribe({

        // =============================================
        // SUCCESS
        // =============================================

        next:
          (response: any) => {


            console.log(

              'DEAL ANALYTICS RESPONSE:',

              response

            );


            if (

              Array.isArray(

                response

              )

            ) {

              this.deals =
                response;

            }


            else if (

              Array.isArray(

                response?.data

              )

            ) {

              this.deals =
                response.data;

            }


            else if (

              Array.isArray(

                response?.deals

              )

            ) {

              this.deals =
                response.deals;

            }


            else {

              this.deals =
                [];

            }


            this.calculateKPIs();


            this.loading =
              false;


            this.cdr.detectChanges();


            setTimeout(() => {

              this.createCharts();

            }, 300);

          },


        // =============================================
        // ERROR
        // =============================================

        error:
          (error: any) => {


            console.error(

              'DEAL ANALYTICS ERROR:',

              error

            );


            this.deals =
              [];


            this.loading =
              false;


            this.errorMessage =

              error?.error?.message ||

              error?.error?.error ||

              'Unable to load deal analytics.';

          }

      });

  }


  // =====================================================
  // CALCULATE KPI
  // =====================================================

  calculateKPIs():
    void {


    this.totalDeals =
      this.deals.length;


    this.totalDealAmount =

      this.deals.reduce(

        (

          total,

          deal

        ) =>

          total +

          Number(

            (deal as any).amount ||

            0

          ),

        0

      );


    this.totalCommission =

      this.deals.reduce(

        (

          total,

          deal

        ) =>

          total +

          Number(

            (deal as any).commissionEarned ||

            0

          ),

        0

      );


    this.closedDeals =

      this.deals.filter(

        deal =>

          this.getStatusValue(

            deal

          ).toLowerCase() ===

          'closed'

      ).length;


    this.openDeals =

      this.deals.filter(

        deal =>

          this.getStatusValue(

            deal

          ).toLowerCase() ===

          'open'

      ).length;


    this.negotiationDeals =

      this.deals.filter(

        deal =>

          this.getStatusValue(

            deal

          ).toLowerCase() ===

          'negotiation'

      ).length;


    this.cancelledDeals =

      this.deals.filter(

        deal =>

          this.getStatusValue(

            deal

          ).toLowerCase() ===

          'cancelled'

      ).length;


    this.pendingPayments =

      this.deals.filter(

        deal =>

          this.getPaymentStatus(

            deal

          ).toLowerCase() ===

          'pending'

      ).length;


    this.partialPayments =

      this.deals.filter(

        deal =>

          this.getPaymentStatus(

            deal

          ).toLowerCase() ===

          'partial'

      ).length;


    this.paidPayments =

      this.deals.filter(

        deal =>

          this.getPaymentStatus(

            deal

          ).toLowerCase() ===

          'paid'

      ).length;


    this.completedPayments =

      this.deals.filter(

        deal =>

          this.getPaymentStatus(

            deal

          ).toLowerCase() ===

          'completed'

      ).length;

  }


  // =====================================================
  // STATUS VALUE
  // =====================================================

  getStatusValue(

    deal:
      Deal

  ):
    string {


    return String(

      (deal as any).status ||

      'Open'

    );

  }


  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  getPaymentStatus(

    deal:
      Deal

  ):
    string {


    return String(

      (deal as any).paymentStatus ||

      'Pending'

    );

  }


  // =====================================================
  // CREATE ALL CHARTS
  // =====================================================

  private createCharts():
    void {


    this.destroyCharts();


    this.createStatusChart();


    this.createPaymentChart();


    this.createAmountChart();


    this.createCommissionChart();

  }


  // =====================================================
  // STATUS CHART
  // =====================================================

  private createStatusChart():
    void {


    const canvas =

      this.statusChart

        ?.nativeElement;


    if (

      !canvas

    ) {

      console.warn(

        'Status chart canvas not available'

      );


      return;

    }


    const statusCounts = {

      Open:
        0,

      Negotiation:
        0,

      Closed:
        0,

      Cancelled:
        0

    };


    this.deals.forEach(

      deal => {


        const status =

          this.getStatusValue(

            deal

          );


        if (

          status in

          statusCounts

        ) {


          statusCounts[

            status as keyof

            typeof statusCounts

          ]++;

        }

      }

    );


    const chart =

      new Chart(

        canvas,

        {

          type:
            'doughnut',

          data: {

            labels: [

              'Open',

              'Negotiation',

              'Closed',

              'Cancelled'

            ],

            datasets: [

              {

                data: [

                  statusCounts.Open,

                  statusCounts.Negotiation,

                  statusCounts.Closed,

                  statusCounts.Cancelled

                ],

                borderWidth:
                  0,

                hoverOffset:
                  8

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            cutout:
              '68%',

            plugins: {

              legend: {

                position:
                  'bottom',

                labels: {

                  padding:
                    18,

                  usePointStyle:
                    true

                }

              }

            }

          }

        }

      );


    this.charts.push(

      chart

    );

  }


  // =====================================================
  // PAYMENT CHART
  // =====================================================

  private createPaymentChart():
    void {


    const canvas =

      this.paymentChart

        ?.nativeElement;


    if (

      !canvas

    ) {

      console.warn(

        'Payment chart canvas not available'

      );


      return;

    }


    const paymentCounts = {

      Pending:
        0,

      Partial:
        0,

      Paid:
        0,

      Completed:
        0

    };


    this.deals.forEach(

      deal => {


        const status =

          this.getPaymentStatus(

            deal

          );


        if (

          status in

          paymentCounts

        ) {


          paymentCounts[

            status as keyof

            typeof paymentCounts

          ]++;

        }

      }

    );


    const chart =

      new Chart(

        canvas,

        {

          type:
            'doughnut',

          data: {

            labels: [

              'Pending',

              'Partial',

              'Paid',

              'Completed'

            ],

            datasets: [

              {

                data: [

                  paymentCounts.Pending,

                  paymentCounts.Partial,

                  paymentCounts.Paid,

                  paymentCounts.Completed

                ],

                borderWidth:
                  0,

                hoverOffset:
                  8

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            cutout:
              '68%',

            plugins: {

              legend: {

                position:
                  'bottom',

                labels: {

                  padding:
                    18,

                  usePointStyle:
                    true

                }

              }

            }

          }

        }

      );


    this.charts.push(

      chart

    );

  }


  // =====================================================
  // AMOUNT CHART
  // =====================================================

  private createAmountChart():
    void {


    const canvas =

      this.amountChart

        ?.nativeElement;


    if (

      !canvas

    ) {

      console.warn(

        'Amount chart canvas not available'

      );


      return;

    }


    const sortedDeals = [

      ...this.deals

    ]

      .sort(

        (

          a,

          b

        ) =>

          new Date(

            (a as any).createdAt ||

            ''

          ).getTime() -

          new Date(

            (b as any).createdAt ||

            ''

          ).getTime()

      )

      .slice(

        -12

      );


    const chart =

      new Chart(

        canvas,

        {

          type:
            'line',

          data: {

            labels:

              sortedDeals.map(

                deal =>

                  (deal as any).createdAt

                    ? new Date(

                        (deal as any).createdAt

                      ).toLocaleDateString(

                        'en-IN',

                        {

                          day:
                            '2-digit',

                          month:
                            'short'

                        }

                      )

                    : 'N/A'

              ),

            datasets: [

              {

                label:
                  'Deal Amount',

                data:

                  sortedDeals.map(

                    deal =>

                      Number(

                        (deal as any).amount ||

                        0

                      )

                  ),

                tension:
                  0.4,

                fill:
                  true,

                pointRadius:
                  4,

                pointHoverRadius:
                  7

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              },

              tooltip: {

                callbacks: {

                  label:

                    context =>

                      `₹${Number(

                        context.raw

                      ).toLocaleString(

                        'en-IN'

                      )}`

                }

              }

            },

            scales: {

              y: {

                beginAtZero:
                  true,

                ticks: {

                  callback:

                    value =>

                      `₹${Number(

                        value

                      ).toLocaleString(

                        'en-IN'

                      )}`

                }

              }

            }

          }

        }

      );


    this.charts.push(

      chart

    );

  }


  // =====================================================
  // COMMISSION CHART
  // =====================================================

  private createCommissionChart():
    void {


    const canvas =

      this.commissionChart

        ?.nativeElement;


    if (

      !canvas

    ) {

      console.warn(

        'Commission chart canvas not available'

      );


      return;

    }


    const sortedDeals = [

      ...this.deals

    ]

      .sort(

        (

          a,

          b

        ) =>

          Number(

            (b as any).commissionEarned ||

            0

          ) -

          Number(

            (a as any).commissionEarned ||

            0

          )

      )

      .slice(

        0,

        10

      );


    const chart =

      new Chart(

        canvas,

        {

          type:
            'bar',

          data: {

            labels:

              sortedDeals.map(

                deal =>

                  this.getClientName(

                    deal

                  )

              ),

            datasets: [

              {

                label:
                  'Commission',

                data:

                  sortedDeals.map(

                    deal =>

                      Number(

                        (deal as any)

                          .commissionEarned ||

                        0

                      )

                  ),

                borderRadius:
                  10,

                barThickness:
                  32

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              },

              tooltip: {

                callbacks: {

                  label:

                    context =>

                      `₹${Number(

                        context.raw

                      ).toLocaleString(

                        'en-IN'

                      )}`

                }

              }

            },

            scales: {

              y: {

                beginAtZero:
                  true,

                ticks: {

                  callback:

                    value =>

                      `₹${Number(

                        value

                      ).toLocaleString(

                        'en-IN'

                      )}`

                }

              }

            }

          }

        }

      );


    this.charts.push(

      chart

    );

  }


  // =====================================================
  // CLIENT NAME
  // =====================================================

  getClientName(

    deal:
      Deal

  ):
    string {


    const client:
      any =

      (deal as any).clientId;


    if (

      client &&

      typeof client ===

      'object'

    ) {


      return (

        client.name ||

        client.fullName ||

        client.email ||

        'Unknown Client'

      );

    }


    return (

      (deal as any).clientName ||

      'Unknown Client'

    );

  }


  // =====================================================
  // PROPERTY NAME
  // =====================================================

  getPropertyName(

    deal:
      Deal

  ):
    string {


    const property:
      any =

      (deal as any).propertyId;


    if (

      property &&

      typeof property ===

      'object'

    ) {


      return (

        property.title ||

        property.name ||

        'Unknown Property'

      );

    }


    return (

      (deal as any).propertyName ||

      'Unknown Property'

    );

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(

    status?:
      string

  ):
    string {


    return (

      String(

        status ||

        'Open'

      )

        .toLowerCase()

        .replace(

          /\s+/g,

          '-'

        )

    );

  }


  // =====================================================
  // DESTROY CHARTS
  // =====================================================

  private destroyCharts():
    void {


    this.charts.forEach(

      chart =>

        chart.destroy()

    );


    this.charts = [];

  }


  // =====================================================
  // DESTROY COMPONENT
  // =====================================================

  ngOnDestroy():
    void {


    this.destroyCharts();

  }

}