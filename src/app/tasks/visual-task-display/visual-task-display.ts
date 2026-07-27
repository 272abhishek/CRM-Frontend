import {
  AfterViewInit,
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
  Task,
  TaskService,
  TaskUser,
  TaskClient,
  TaskProperty
} from '../task';


Chart.register(
  ...registerables
);


// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector:
    'app-visual-task-display',

  standalone:
    true,

  imports: [

    CommonModule

  ],

  templateUrl:
    './visual-task-display.html',

  styleUrl:
    './visual-task-display.scss'

})


export class VisualTaskDisplay

implements

  OnInit,

  AfterViewInit,

  OnDestroy {


  // =====================================================
  // DATA
  // =====================================================

  tasks:
    Task[] = [];


  loading =
    false;


  error =
    '';


  // =====================================================
  // KPI
  // =====================================================

  totalTasks =
    0;


  pendingTasks =
    0;


  inProgressTasks =
    0;


  completedTasks =
    0;


  overdueTasks =
    0;


  highPriorityTasks =
    0;


  // =====================================================
  // CHART INSTANCES
  // =====================================================

  private taskStatusChart?:
    Chart;


  private taskPriorityChart?:
    Chart;


  private taskMonthlyChart?:
    Chart;


  private taskDueDateChart?:
    Chart;


  private taskUserChart?:
    Chart;


  private taskClientChart?:
    Chart;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
private cdr: ChangeDetectorRef,
    private taskService:
      TaskService

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit():
    void {

    this.loadTaskData();

  }


  // =====================================================
  // VIEW INIT
  // =====================================================

  ngAfterViewInit():
    void {

    // Charts API response ke baad create honge

  }


  // =====================================================
  // LOAD TASK DATA
  // =====================================================

  loadTaskData():
    void {


    this.loading =
      true;


    this.error =
      '';


    this.taskService

      .getTasks()

      .subscribe({

        next:
          (response: any) => {


            console.log(
              'TASK ANALYTICS RESPONSE:',
              response
            );


            /*
             API response formats:

             1. { tasks: [...] }

             2. { data: [...] }

             3. [...]

            */


            if (

              Array.isArray(
                response
              )

            ) {

              this.tasks =
                response;

            }

            else if (

              Array.isArray(
                response?.tasks
              )

            ) {

              this.tasks =
                response.tasks;

            }

            else if (

              Array.isArray(
                response?.data
              )

            ) {

              this.tasks =
                response.data;

            }

            else {

              this.tasks =
                [];

            }


            this.calculateKPIs();

this.loading = false;

// Angular ko *ngIf ke baad canvas render karne do
this.cdr.detectChanges();

setTimeout(() => {

  this.createCharts();

}, 0);
          },


        error:
          (err) => {


            console.error(

              'TASK ANALYTICS ERROR:',

              err

            );


            this.tasks =
              [];


            this.loading =
              false;


            this.error =

              err?.error?.error ||

              err?.error?.message ||

              'Unable to load task analytics.';

          }

      });

  }


  // =====================================================
  // KPI CALCULATIONS
  // =====================================================

  private calculateKPIs():
    void {


    this.totalTasks =

      this.tasks.length;


    this.pendingTasks =

      this.tasks.filter(

        task =>

          task.status ===

          'Pending'

      ).length;


    this.inProgressTasks =

      this.tasks.filter(

        task =>

          task.status ===

          'In Progress'

      ).length;


    this.completedTasks =

      this.tasks.filter(

        task =>

          task.status ===

          'Completed'

      ).length;


    this.overdueTasks =

      this.tasks.filter(

        task =>

          this.isOverdue(

            task

          )

      ).length;


    this.highPriorityTasks =

      this.tasks.filter(

        task =>

          task.priority ===

          'High'

      ).length;

  }


  // =====================================================
  // USER NAME
  // =====================================================

  getUserName(

    user?:

      string |

      TaskUser

  ):
    string {


    if (!user) {

      return 'Unassigned';

    }


    if (

      typeof user ===

      'string'

    ) {

      return user;

    }


    return (

      user.name ||

      user.email ||

      'Unknown User'

    );

  }


  // =====================================================
  // CLIENT NAME
  // =====================================================

  getClientName(

    client?:

      string |

      TaskClient

  ):
    string {


    if (!client) {

      return 'No Client';

    }


    if (

      typeof client ===

      'string'

    ) {

      return client;

    }


    return (

      client.name ||

      client.phone ||

      'Unknown Client'

    );

  }


  // =====================================================
  // PROPERTY NAME
  // =====================================================

  getPropertyName(

    property?:

      string |

      TaskProperty

  ):
    string {


    if (!property) {

      return 'No Property';

    }


    if (

      typeof property ===

      'string'

    ) {

      return property;

    }


    return (

      property.title ||

      property.address ||

      'Unknown Property'

    );

  }


  // =====================================================
  // OVERDUE CHECK
  // =====================================================

  isOverdue(

    task:

      Task

  ):
    boolean {


    if (

      task.status ===

      'Completed'

    ) {

      return false;

    }


    if (

      !task.dueDate

    ) {

      return false;

    }


    return (

      new Date(

        task.dueDate

      ).getTime()

      <

      Date.now()

    );

  }


  // =====================================================
  // PRIORITY CLASS
  // =====================================================

  getPriorityClass(

    priority?:

      Task['priority']

  ):
    string {


    switch (

      priority

    ) {


      case 'High':

        return 'priority-high';


      case 'Medium':

        return 'priority-medium';


      case 'Low':

        return 'priority-low';


      default:

        return '';

    }

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(

    status?:

      Task['status']

  ):
    string {


    switch (

      status

    ) {


      case 'Pending':

        return 'status-pending';


      case 'In Progress':

        return 'status-progress';


      case 'Completed':

        return 'status-completed';


      default:

        return '';

    }

  }


  // =====================================================
  // CREATE CHARTS
  // =====================================================

  private createCharts():
    void {


    this.destroyCharts();


    this.createStatusChart();


    this.createPriorityChart();


    this.createMonthlyChart();


    this.createDueDateChart();


    this.createUserChart();


    this.createClientChart();

  }


  // =====================================================
  // STATUS CHART
  // =====================================================

  private createStatusChart():
    void {


    const canvas =

      document.getElementById(

        'taskStatusChart'

      ) as HTMLCanvasElement;


    if (!canvas) {

      return;

    }


    this.taskStatusChart =

      new Chart(

        canvas,

        {

          type:
            'doughnut',


          data: {

            labels: [

              'Pending',

              'In Progress',

              'Completed'

            ],


            datasets: [

              {

                data: [

                  this.pendingTasks,

                  this.inProgressTasks,

                  this.completedTasks

                ],


                backgroundColor: [

                  '#f59e0b',

                  '#3b82f6',

                  '#10b981'

                ],


                borderWidth:
                  0

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

                position:
                  'bottom'

              }

            }

          }

        }

      );

  }


  // =====================================================
  // PRIORITY CHART
  // =====================================================

  private createPriorityChart():
    void {


    const canvas =

      document.getElementById(

        'taskPriorityChart'

      ) as HTMLCanvasElement;


    if (!canvas) {

      return;

    }


    const high =

      this.tasks.filter(

        task =>

          task.priority ===

          'High'

      ).length;


    const medium =

      this.tasks.filter(

        task =>

          task.priority ===

          'Medium'

      ).length;


    const low =

      this.tasks.filter(

        task =>

          task.priority ===

          'Low'

      ).length;


    this.taskPriorityChart =

      new Chart(

        canvas,

        {

          type:
            'bar',


          data: {

            labels: [

              'High',

              'Medium',

              'Low'

            ],


            datasets: [

              {

                label:
                  'Tasks',


                data: [

                  high,

                  medium,

                  low

                ],


                backgroundColor: [

                  '#ef4444',

                  '#f59e0b',

                  '#10b981'

                ],


                borderRadius:
                  10

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

  }


  // =====================================================
  // MONTHLY CHART
  // =====================================================

  private createMonthlyChart():
    void {


    const canvas =

      document.getElementById(

        'taskMonthlyChart'

      ) as HTMLCanvasElement;


    if (!canvas) {

      return;

    }


    const months:
      string[] = [];


    const values:
      number[] = [];


    for (

      let i =
        5;

      i >=
        0;

      i--

    ) {


      const date =
        new Date();


      date.setMonth(

        date.getMonth()

        -

        i

      );


      months.push(

        date.toLocaleString(

          'en-IN',

          {

            month:
              'short'

          }

        )

      );


      const month =
        date.getMonth();


      const year =
        date.getFullYear();


      const count =

        this.tasks.filter(

          task => {


            if (

              !task.createdAt

            ) {

              return false;

            }


            const taskDate =

              new Date(

                task.createdAt

              );


            return (

              taskDate.getMonth()

              ===

              month

              &&

              taskDate.getFullYear()

              ===

              year

            );

          }

        ).length;


      values.push(

        count

      );

    }


    this.taskMonthlyChart =

      new Chart(

        canvas,

        {

          type:
            'line',


          data: {

            labels:
              months,


            datasets: [

              {

                label:
                  'Tasks Created',


                data:
                  values,


                borderColor:
                  '#6366f1',


                backgroundColor:
                  'rgba(99, 102, 241, .12)',


                fill:
                  true,


                tension:
                  0.4,


                borderWidth:
                  3

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

  }


  // =====================================================
  // DUE DATE CHART
  // =====================================================

  private createDueDateChart():
    void {


    const canvas =

      document.getElementById(

        'taskDueDateChart'

      ) as HTMLCanvasElement;


    if (!canvas) {

      return;

    }


    const overdue =
      this.overdueTasks;


    const upcoming =

      this.tasks.filter(

        task =>

          !this.isOverdue(

            task

          )

          &&

          task.status !==

          'Completed'

      ).length;


    const completed =
      this.completedTasks;


    this.taskDueDateChart =

      new Chart(

        canvas,

        {

          type:
            'doughnut',


          data: {

            labels: [

              'Overdue',

              'Upcoming',

              'Completed'

            ],


            datasets: [

              {

                data: [

                  overdue,

                  upcoming,

                  completed

                ],


                backgroundColor: [

                  '#ef4444',

                  '#3b82f6',

                  '#10b981'

                ],


                borderWidth:
                  0

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

                position:
                  'bottom'

              }

            }

          }

        }

      );

  }


  // =====================================================
  // USER CHART
  // =====================================================

  private createUserChart():
    void {


    const canvas =

      document.getElementById(

        'taskUserChart'

      ) as HTMLCanvasElement;


    if (!canvas) {

      return;

    }


    const users =

      new Map<string, number>();


    this.tasks.forEach(

      task => {


        /*
         IMPORTANT:

         Task interface me assignedTo nahi hai.

         Isliye createdBy use kar rahe hain.
        */


        const name =

          this.getUserName(

            task.createdBy

          );


        users.set(

          name,


          (

            users.get(

              name

            )

            ||

            0

          )

          +

          1

        );

      }

    );


    this.taskUserChart =

      new Chart(

        canvas,

        {

          type:
            'bar',


          data: {

            labels:

              Array.from(

                users.keys()

              ),


            datasets: [

              {

                label:
                  'Tasks',


                data:

                  Array.from(

                    users.values()

                  ),


                backgroundColor:
                  '#6366f1',


                borderRadius:
                  8

              }

            ]

          },


          options: {

            indexAxis:
              'y',


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
  // CLIENT CHART
  // =====================================================

  private createClientChart():
    void {


    const canvas =

      document.getElementById(

        'taskClientChart'

      ) as HTMLCanvasElement;


    if (!canvas) {

      return;

    }


    const clients =

      new Map<string, number>();


    this.tasks.forEach(

      task => {


        const name =

          this.getClientName(

            task.relatedClient

          );


        clients.set(

          name,


          (

            clients.get(

              name

            )

            ||

            0

          )

          +

          1

        );

      }

    );


    this.taskClientChart =

      new Chart(

        canvas,

        {

          type:
            'bar',


          data: {

            labels:

              Array.from(

                clients.keys()

              ),


            datasets: [

              {

                label:
                  'Tasks',


                data:

                  Array.from(

                    clients.values()

                  ),


                backgroundColor:
                  '#8b5cf6',


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

  }


  // =====================================================
  // DESTROY CHARTS
  // =====================================================

  private destroyCharts():
    void {


    this.taskStatusChart?.destroy();


    this.taskPriorityChart?.destroy();


    this.taskMonthlyChart?.destroy();


    this.taskDueDateChart?.destroy();


    this.taskUserChart?.destroy();


    this.taskClientChart?.destroy();


    this.taskStatusChart =
      undefined;


    this.taskPriorityChart =
      undefined;


    this.taskMonthlyChart =
      undefined;


    this.taskDueDateChart =
      undefined;


    this.taskUserChart =
      undefined;


    this.taskClientChart =
      undefined;

  }


  // =====================================================
  // DESTROY COMPONENT
  // =====================================================

  ngOnDestroy():
    void {


    this.destroyCharts();

  }

}
