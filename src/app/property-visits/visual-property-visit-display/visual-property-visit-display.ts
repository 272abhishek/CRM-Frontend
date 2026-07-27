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
  PropertyVisitService
} from '../property-visit';

import {
  PropertyVisit
} from '../propertyInterface';


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
    'app-visual-property-visit-display',

  standalone:
    true,

  imports: [

    CommonModule

  ],

  templateUrl:
    './visual-property-visit-display.html',

  styleUrl:
    './visual-property-visit-display.scss'

})


// =====================================================
// CLASS
// =====================================================

export class VisualPropertyVisitDisplay

  implements

    OnInit,

    OnDestroy {


  // =====================================================
  // CANVAS REFERENCES
  // =====================================================

  @ViewChild(

    'statusChart'

  )

  statusChartCanvas?:

    ElementRef<HTMLCanvasElement>;


  @ViewChild(

    'timelineChart'

  )

  timelineChartCanvas?:

    ElementRef<HTMLCanvasElement>;


  @ViewChild(

    'monthlyChart'

  )

  monthlyChartCanvas?:

    ElementRef<HTMLCanvasElement>;


  // =====================================================
  // DATA
  // =====================================================

  visits:

    PropertyVisit[] = [];


  loading:

    boolean = false;


  error:

    string = '';


  // =====================================================
  // KPI
  // =====================================================

  totalVisits:

    number = 0;


  upcomingVisits:

    number = 0;


  todayVisits:

    number = 0;


  completedVisits:

    number = 0;


  cancelledVisits:

    number = 0;


  scheduledVisits:

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

    private visitService:

      PropertyVisitService,

    private cdr:

      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit():

    void {

    this.loadVisitData();

  }


  // =====================================================
  // LOAD DATA
  // =====================================================

  loadVisitData():

    void {


    this.loading =

      true;


    this.error =

      '';


    this.destroyCharts();


    this.visitService

      .getVisits({

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

              'PROPERTY VISIT ANALYTICS RESPONSE:',

              response

            );


            // -----------------------------------------
            // API RESPONSE HANDLE
            // -----------------------------------------

            if (

              Array.isArray(

                response

              )

            ) {

              this.visits =

                response;

            }


            else if (

              Array.isArray(

                response?.data

              )

            ) {

              this.visits =

                response.data;

            }


            else if (

              Array.isArray(

                response?.visits

              )

            ) {

              this.visits =

                response.visits;

            }


            else if (

              Array.isArray(

                response?.data?.visits

              )

            ) {

              this.visits =

                response.data.visits;

            }


            else {

              this.visits =

                [];

            }


            // -----------------------------------------
            // CALCULATE KPI
            // -----------------------------------------

            this.calculateStats();


            this.loading =

              false;


            // -----------------------------------------
            // UPDATE VIEW
            // -----------------------------------------

            this.cdr.detectChanges();


            // -----------------------------------------
            // CREATE CHARTS
            // -----------------------------------------

            setTimeout(() => {

              this.createCharts();

            }, 200);

          },


        // =============================================
        // ERROR
        // =============================================

        error:

          (err: any) => {


            console.error(

              'PROPERTY VISIT ANALYTICS ERROR:',

              err

            );


            this.visits =

              [];


            this.loading =

              false;


            this.error =

              err?.error?.message ||

              err?.error?.error ||

              'Unable to load property visit analytics.';

          }

      });

  }


  // =====================================================
  // CALCULATE STATS
  // =====================================================

  calculateStats():

    void {


    this.totalVisits =

      this.visits.length;


    const today =

      new Date();


    today.setHours(

      0,

      0,

      0,

      0

    );


    const tomorrow =

      new Date(

        today

      );


    tomorrow.setDate(

      tomorrow.getDate() + 1

    );


    // =================================================
    // TODAY
    // =================================================

    this.todayVisits =

      this.visits.filter(

        visit => {


          if (

            !visit.visitDate

          ) {

            return false;

          }


          const date =

            this.getDateOnly(

              visit.visitDate

            );


          return (

            date >= today &&

            date < tomorrow

          );

        }

      ).length;


    // =================================================
    // UPCOMING
    // =================================================

    this.upcomingVisits =

      this.visits.filter(

        visit => {


          if (

            !visit.visitDate

          ) {

            return false;

          }


          const date =

            this.getDateOnly(

              visit.visitDate

            );


          const status =

            this.getStatusValue(

              visit

            ).toLowerCase();


          return (

            date >= tomorrow &&

            status !== 'completed' &&

            status !== 'cancelled'

          );

        }

      ).length;


    // =================================================
    // COMPLETED
    // =================================================

    this.completedVisits =

      this.visits.filter(

        visit =>

          this.getStatusValue(

            visit

          ).toLowerCase() ===

          'completed'

      ).length;


    // =================================================
    // CANCELLED
    // =================================================

    this.cancelledVisits =

      this.visits.filter(

        visit =>

          this.getStatusValue(

            visit

          ).toLowerCase() ===

          'cancelled'

      ).length;


    // =================================================
    // SCHEDULED
    // =================================================

    this.scheduledVisits =

      this.visits.filter(

        visit =>

          this.getStatusValue(

            visit

          ).toLowerCase() ===

          'scheduled'

      ).length;

  }


  // =====================================================
  // DATE HELPER
  // =====================================================

  private getDateOnly(

    value:

      string |

      Date

  ):

    Date {


    const date =

      new Date(

        value

      );


    date.setHours(

      0,

      0,

      0,

      0

    );


    return date;

  }


  // =====================================================
  // STATUS
  // =====================================================

  getStatusValue(

    visit:

      PropertyVisit

  ):

    string {


    return String(

      visit.status ||

      'Unknown'

    );

  }


  // =====================================================
  // CLIENT NAME
  // =====================================================

  getClientName(

    visit:

      PropertyVisit

  ):

    string {


    const client:

      any =

      (visit as any).clientId;


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


    const data:

      any =

      visit as any;


    return (

      data.clientName ||

      'Unknown Client'

    );

  }


  // =====================================================
  // PROPERTY NAME
  // =====================================================

  getPropertyName(

    visit:

      PropertyVisit

  ):

    string {


    const property:

      any =

      (visit as any).propertyId;


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


    const data:

      any =

      visit as any;


    return (

      data.propertyName ||

      'Unknown Property'

    );

  }


  // =====================================================
  // STATUS CSS CLASS
  // =====================================================

  getStatusClass(

    status?:

      string

  ):

    string {


    switch (

      String(

        status ||

        ''

      ).toLowerCase()

    ) {


      case 'scheduled':

        return 'status-scheduled';


      case 'completed':

        return 'status-completed';


      case 'cancelled':

        return 'status-cancelled';


      case 'rescheduled':

        return 'status-rescheduled';


      default:

        return 'status-default';

    }

  }


  // =====================================================
  // CREATE ALL CHARTS
  // =====================================================

  private createCharts():

    void {


    this.destroyCharts();


    this.createStatusChart();


    this.createTimelineChart();


    this.createMonthlyChart();

  }


  // =====================================================
  // STATUS CHART
  // =====================================================

  private createStatusChart():

    void {


    const canvas =

      this.statusChartCanvas

        ?.nativeElement;


    if (

      !canvas

    ) {

      console.warn(

        'Status chart canvas not available'

      );


      return;

    }


    const statusMap:

      Record<string, number> = {};


    this.visits.forEach(

      visit => {


        const status =

          this.getStatusValue(

            visit

          );


        statusMap[status] =

          (

            statusMap[status] ||

            0

          ) + 1;

      }

    );


    const chart =

      new Chart(

        canvas,

        {

          type:

            'doughnut',

          data: {

            labels:

              Object.keys(

                statusMap

              ),

            datasets: [

              {

                data:

                  Object.values(

                    statusMap

                  ),

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

                  'bottom'

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
  // TIMELINE CHART
  // =====================================================

  private createTimelineChart():

    void {


    const canvas =

      this.timelineChartCanvas

        ?.nativeElement;


    if (

      !canvas

    ) {

      console.warn(

        'Timeline chart canvas not available'

      );


      return;

    }


    const dateMap:

      Record<string, number> = {};


    this.visits.forEach(

      visit => {


        if (

          !visit.visitDate

        ) {

          return;

        }


        const date =

          this.getDateOnly(

            visit.visitDate

          );


        const key =

          date

            .toISOString()

            .split(

              'T'

            )[0];


        dateMap[key] =

          (

            dateMap[key] ||

            0

          ) + 1;

      }

    );


    const labels =

      Object.keys(

        dateMap

      ).sort();


    const chart =

      new Chart(

        canvas,

        {

          type:

            'line',

          data: {

            labels,

            datasets: [

              {

                label:

                  'Visits',

                data:

                  labels.map(

                    date =>

                      dateMap[date]

                  ),

                tension:

                  0.4,

                fill:

                  true,

                pointRadius:

                  4

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

              }

            },

            scales: {

              y: {

                beginAtZero:

                  true,

                ticks: {

                  precision:

                    0

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
  // MONTHLY CHART
  // =====================================================

  private createMonthlyChart():

    void {


    const canvas =

      this.monthlyChartCanvas

        ?.nativeElement;


    if (

      !canvas

    ) {

      console.warn(

        'Monthly chart canvas not available'

      );


      return;

    }


    const monthMap:

      Record<string, number> = {};


    this.visits.forEach(

      visit => {


        if (

          !visit.visitDate

        ) {

          return;

        }


        const date =

          new Date(

            visit.visitDate

          );


        const key =

          `${date.getFullYear()}-${String(

            date.getMonth() + 1

          ).padStart(

            2,

            '0'

          )}`;


        monthMap[key] =

          (

            monthMap[key] ||

            0

          ) + 1;

      }

    );


    const labels =

      Object.keys(

        monthMap

      ).sort();


    const formattedLabels =

      labels.map(

        key => {


          const parts =

            key.split(

              '-'

            );


          const year =

            Number(

              parts[0]

            );


          const month =

            Number(

              parts[1]

            );


          return new Date(

            year,

            month - 1

          ).toLocaleString(

            'en-IN',

            {

              month:

                'short',

              year:

                'numeric'

            }

          );

        }

      );


    const chart =

      new Chart(

        canvas,

        {

          type:

            'bar',

          data: {

            labels:

              formattedLabels,

            datasets: [

              {

                label:

                  'Monthly Visits',

                data:

                  labels.map(

                    month =>

                      monthMap[month]

                  ),

                borderRadius:

                  8

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

              }

            },

            scales: {

              y: {

                beginAtZero:

                  true,

                ticks: {

                  precision:

                    0

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