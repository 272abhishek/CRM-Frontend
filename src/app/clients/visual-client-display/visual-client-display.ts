import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Chart,
  registerables
} from 'chart.js';

import {
  Client,
  ClientInterface
} from '../client';


// =====================================================
// REGISTER CHART.JS
// =====================================================

Chart.register(
  ...registerables
);


// =====================================================
// STAT ITEM
// =====================================================

interface StatItem {

  name: string;

  count: number;

  percentage?: number;

}


// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector:
    'app-visual-client-display',

  standalone:
    true,

  imports: [

    CommonModule

  ],

  templateUrl:
    './visual-client-display.html',

  styleUrl:
    './visual-client-display.scss'

})


// =====================================================
// CLASS
// =====================================================

export class VisualClientDisplay

  implements

    OnInit,

    OnDestroy {


  // =====================================================
  // CLIENT DATA
  // =====================================================

  clients:
    ClientInterface[] = [];


  loading =
    false;


  error =
    '';


  // =====================================================
  // KPI
  // =====================================================

  totalClients =
    0;


  highPriorityClients =
    0;


  mediumPriorityClients =
    0;


  lowPriorityClients =
    0;


  // =====================================================
  // OTHER ANALYTICS
  // =====================================================

  locationStats:
    StatItem[] = [];


  requirementStats:
    StatItem[] = [];


  // =====================================================
  // CHART INSTANCES
  // =====================================================

  private priorityChart?:
    Chart;


  private leadSourceChart?:
    Chart;


  private communicationChart?:
    Chart;


  private timelineChart?:
    Chart;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private cdr:
      ChangeDetectorRef,

    private clientService:
      Client

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit():
    void {

    this.loadClients();

  }


  // =====================================================
  // LOAD CLIENTS
  // =====================================================

  loadClients():
    void {


    this.loading =
      true;


    this.error =
      '';


    this.clientService

      .getClients({

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

              'CLIENT ANALYTICS RESPONSE:',

              response

            );


            // =========================================
            // API RESPONSE HANDLING
            // =========================================

            if (

              Array.isArray(

                response

              )

            ) {


              this.clients =

                response;


            }


            else if (

              Array.isArray(

                response?.data

              )

            ) {


              this.clients =

                response.data;


            }


            else if (

              Array.isArray(

                response?.clients

              )

            ) {


              this.clients =

                response.clients;


            }


            else {


              this.clients =

                [];


            }


            // =========================================
            // BUILD ANALYTICS
            // =========================================

            this.buildAnalytics();


            // =========================================
            // STOP LOADING
            // =========================================

            this.loading =
              false;


            // =========================================
            // FORCE ANGULAR CHANGE DETECTION
            // =========================================

            this.cdr.detectChanges();


            // =========================================
            // WAIT FOR CANVAS RENDER
            // =========================================

            setTimeout(() => {


              this.createCharts();


            }, 0);


          },


        // =============================================
        // ERROR
        // =============================================

        error:
          (err) => {


            console.error(

              'CLIENT ANALYTICS ERROR:',

              err

            );


            this.clients =
              [];


            this.loading =
              false;


            this.error =

              err?.error?.message ||

              err?.error?.error ||

              'Unable to load client analytics.';


          }

      });

  }


  // =====================================================
  // BUILD ANALYTICS
  // =====================================================

  private buildAnalytics():
    void {


    // =================================================
    // TOTAL CLIENTS
    // =================================================

    this.totalClients =

      this.clients.length;


    // =================================================
    // PRIORITY
    // =================================================

    this.highPriorityClients =

      this.countBy(

        'priority',

        'High'

      );


    this.mediumPriorityClients =

      this.countBy(

        'priority',

        'Medium'

      );


    this.lowPriorityClients =

      this.countBy(

        'priority',

        'Low'

      );


    // =================================================
    // LOCATIONS
    // =================================================

    const locations =

      this.groupBy(

        this.clients,

        client =>

          client.preferredLocation ||

          'Unknown'

      );


    const maxLocationCount =

      Math.max(

        ...Object.values(

          locations

        ),

        1

      );


    this.locationStats =

      Object.entries(

        locations

      )

        .sort(

          (a, b) =>

            b[1] - a[1]

        )

        .slice(

          0,

          6

        )

        .map(

          ([name, count]) => ({

            name,

            count,

            percentage:

              (

                count /

                maxLocationCount

              )

              *

              100

          })

        );


    // =================================================
    // REQUIREMENTS
    // =================================================

    const requirements =

      this.groupBy(

        this.clients,

        client =>

          client.requirement ||

          'Not Specified'

      );


    this.requirementStats =

      Object.entries(

        requirements

      )

        .sort(

          (a, b) =>

            b[1] - a[1]

        )

        .slice(

          0,

          6

        )

        .map(

          ([name, count]) => ({

            name,

            count

          })

        );

  }


  // =====================================================
  // COUNT BY
  // =====================================================

  private countBy(

    field:
      keyof ClientInterface,

    value:
      string

  ):
    number {


    return this.clients.filter(

      client =>

        client[field] ===

        value

    ).length;

  }


  // =====================================================
  // GROUP BY
  // =====================================================

  private groupBy<T>(

    array:
      T[],

    keyGetter:
      (item: T) => string

  ):
    Record<string, number> {


    return array.reduce(

      (

        result,

        item

      ) => {


        const key =

          keyGetter(

            item

          );


        result[key] =

          (

            result[key] ||

            0

          )

          +

          1;


        return result;


      },

      {} as Record<string, number>

    );

  }


  // =====================================================
  // CREATE ALL CHARTS
  // =====================================================

  private createCharts():
    void {


    this.destroyCharts();


    this.createPriorityChart();


    this.createLeadSourceChart();


    this.createCommunicationChart();


    this.createTimelineChart();

  }


  // =====================================================
  // PRIORITY CHART
  // =====================================================

  private createPriorityChart():
    void {


    const canvas =

      document.getElementById(

        'priorityChart'

      ) as HTMLCanvasElement;


    if (

      !canvas

    ) {

      console.warn(

        'priorityChart canvas not found'

      );


      return;

    }


    this.priorityChart =

      new Chart(

        canvas,

        {


          // =========================================
          // TYPE
          // =========================================

          type:
            'doughnut',


          // =========================================
          // DATA
          // =========================================

          data: {


            labels: [

              'High',

              'Medium',

              'Low'

            ],


            datasets: [

              {

                data: [

                  this.highPriorityClients,

                  this.mediumPriorityClients,

                  this.lowPriorityClients

                ],


                backgroundColor: [

                  '#ef4444',

                  '#f59e0b',

                  '#10b981'

                ],


                borderWidth:
                  0,


                hoverOffset:
                  10

              }

            ]

          },


          // =========================================
          // OPTIONS
          // =========================================

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

  }


  // =====================================================
  // LEAD SOURCE CHART
  // =====================================================

  private createLeadSourceChart():
    void {


    const canvas =

      document.getElementById(

        'leadSourceChart'

      ) as HTMLCanvasElement;


    if (

      !canvas

    ) {

      console.warn(

        'leadSourceChart canvas not found'

      );


      return;

    }


    const leadSources =

      this.groupBy(

        this.clients,

        client =>

          client.leadSource ||

          'Unknown'

      );


    this.leadSourceChart =

      new Chart(

        canvas,

        {


          type:
            'bar',


          data: {


            labels:

              Object.keys(

                leadSources

              ),


            datasets: [

              {

                label:
                  'Clients',


                data:

                  Object.values(

                    leadSources

                  ),


                backgroundColor:
                  '#6366f1',


                borderRadius:
                  8,


                maxBarThickness:
                  42

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


              x: {


                grid: {


                  display:
                    false

                }

              },


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

  }


  // =====================================================
  // COMMUNICATION CHART
  // =====================================================

  private createCommunicationChart():
    void {


    const canvas =

      document.getElementById(

        'communicationChart'

      ) as HTMLCanvasElement;


    if (

      !canvas

    ) {

      console.warn(

        'communicationChart canvas not found'

      );


      return;

    }


    const communication =

      this.groupBy(

        this.clients,

        client =>

          client.communicationPreference ||

          'Unknown'

      );


    this.communicationChart =

      new Chart(

        canvas,

        {


          type:
            'doughnut',


          data: {


            labels:

              Object.keys(

                communication

              ),


            datasets: [

              {

                data:

                  Object.values(

                    communication

                  ),


                backgroundColor: [

                  '#3b82f6',

                  '#10b981',

                  '#f59e0b',

                  '#8b5cf6',

                  '#ef4444'

                ],


                borderWidth:
                  0,


                hoverOffset:
                  10

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

  }


  // =====================================================
  // TIMELINE CHART
  // =====================================================

  private createTimelineChart():
    void {


    const canvas =

      document.getElementById(

        'timelineChart'

      ) as HTMLCanvasElement;


    if (

      !canvas

    ) {

      console.warn(

        'timelineChart canvas not found'

      );


      return;

    }


    const timeline =

      this.groupBy(

        this.clients,

        client =>

          client.timeline ||

          'Not Specified'

      );


    this.timelineChart =

      new Chart(

        canvas,

        {


          type:
            'bar',


          data: {


            labels:

              Object.keys(

                timeline

              ),


            datasets: [

              {

                label:
                  'Clients',


                data:

                  Object.values(

                    timeline

                  ),


                backgroundColor:
                  '#14b8a6',


                borderRadius:
                  8,


                maxBarThickness:
                  42

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


              x: {


                grid: {


                  display:
                    false

                }

              },


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

  }


  // =====================================================
  // DESTROY CHARTS
  // =====================================================

  private destroyCharts():
    void {


    this.priorityChart?.destroy();


    this.leadSourceChart?.destroy();


    this.communicationChart?.destroy();


    this.timelineChart?.destroy();


    this.priorityChart =
      undefined;


    this.leadSourceChart =
      undefined;


    this.communicationChart =
      undefined;


    this.timelineChart =
      undefined;

  }


  // =====================================================
  // COMPONENT DESTROY
  // =====================================================

  ngOnDestroy():
    void {


    this.destroyCharts();

  }


}