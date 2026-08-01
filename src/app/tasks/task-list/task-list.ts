import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule,
  Router
} from '@angular/router';

import {
  TaskService,
  Task,
  TaskResponse
} from '../task';

import { NotificationServices } from '../../core/notification/notification-services';
// =====================================================
// TASK LIST COMPONENT
// =====================================================

@Component({

  selector:
    'app-task-list',

  standalone:
    true,

  imports: [

    CommonModule,

    RouterModule

  ],

  templateUrl:
    './task-list.html',

  styleUrl:
    './task-list.scss'

})


export class TaskList

implements OnInit {


  // =====================================================
  // STATE
  // =====================================================

  tasks:
    Task[] = [];


  loading =
    false;


  error =
    '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private taskService:
      TaskService,

    private router:
      Router,

    private cdr:
      ChangeDetectorRef,
       private notification: NotificationServices

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit():

    void {

    this.loadTasks();

  }


  // =====================================================
  // LOAD TASKS
  // =====================================================

  loadTasks():

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

            'TASK RESPONSE:',

            response

          );


          /*
          Backend response:

          {
            success: true,
            count: 2,
            tasks: [...]
          }

          */


          if (

            Array.isArray(response)

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


          this.loading =
            false;


          this.cdr.detectChanges();

        },


        error:
          (err) => {


          console.error(

            'LOAD TASKS ERROR:',

            err

          );


          this.loading =
            false;


          this.tasks =
            [];


       this.error =

  err?.error?.message ||

  err?.error?.error ||

  'Failed to load tasks';

this.cdr.detectChanges();

this.notification.error(this.error);

          

        }

      });

  }


  // =====================================================
  // TOTAL TASKS
  // =====================================================

  get totalTasks():

    number {

    return this.tasks.length;

  }


  // =====================================================
  // PENDING TASKS
  // =====================================================

  get pendingTasks():

    number {

    return this.tasks.filter(

      task =>

        task.status ===

        'Pending'

    ).length;

  }


  // =====================================================
  // IN PROGRESS TASKS
  // =====================================================

  get inProgressTasks():

    number {

    return this.tasks.filter(

      task =>

        task.status ===

        'In Progress'

    ).length;

  }


  // =====================================================
  // COMPLETED TASKS
  // =====================================================

  get completedTasks():

    number {

    return this.tasks.filter(

      task =>

        task.status ===

        'Completed'

    ).length;

  }


  // =====================================================
  // DELETE TASK
  // =====================================================

  deleteTask(

    task:
      Task

  ):

    void {


    if (

      !task._id

    ) {

      return;

    }

this.notification.confirm(
  'Delete Task',
  `Delete task "${task.title}"?`
).then((confirmed) => {

  if (!confirmed) {
    return;
  }

  this.taskService.deleteTask(task._id!).subscribe({

    next: () => {

      this.notification.success(
        'Task deleted successfully'
      );

      this.loadTasks();

    },

    error: (err) => {

      this.notification.error(
        err?.error?.message ||
        err?.error?.error ||
        'Failed to delete task'
       );

      }

    });

  });

}


  // =====================================================
  // EDIT TASK
  // =====================================================

  editTask(

    task:
      Task

  ):

    void {


    if (

      !task._id

    ) {

      return;

    }


    this.router.navigate([

      '/tasks/edit',

      task._id

    ]);

  }


  // =====================================================
  // VIEW TASK
  // =====================================================

  viewTask(

    task:
      Task

  ):

    void {


    if (

      !task._id

    ) {

      return;

    }


    this.router.navigate([

      '/tasks',

      task._id

    ]);

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(

    status:
      Task['status']

  ):

    string {


    return (

      status ||

      ''

    )

      .toLowerCase()

      .replace(

        /\s+/g,

        '-'

      );

  }


  // =====================================================
  // PRIORITY CLASS
  // =====================================================

  getPriorityClass(

    priority:
      Task['priority']

  ):

    string {


    return (

      priority ||

      ''

    )

      .toLowerCase();

  }


  // =====================================================
  // CLIENT NAME
  // =====================================================

  getClientName(

    client:
      any

  ):

    string {


    if (

      !client

    ) {

      return '—';

    }


    if (

      typeof client ===

      'string'

    ) {

      return client;

    }


    return (

      client.name ||

      client.fullName ||

      client.email ||

      '—'

    );

  }


  // =====================================================
  // PROPERTY NAME
  // =====================================================

  getPropertyName(

    property:
      any

  ):

    string {


    if (

      !property

    ) {

      return '—';

    }


    if (

      typeof property ===

      'string'

    ) {

      return property;

    }


    return (

      property.title ||

      property.name ||

      '—'

    );

  }


  // =====================================================
  // TASK DATE
  // =====================================================

  getTaskDate(

    date:
      string |

      Date |

      undefined

  ):

    Date |

    null {


    if (

      !date

    ) {

      return null;

    }


    const parsedDate =

      new Date(

        date

      );


    return isNaN(

      parsedDate.getTime()

    )

      ? null

      : parsedDate;

  }


  // =====================================================
  // TRACK BY
  // =====================================================

  trackByTask(

    index:
      number,

    task:
      Task

  ):

    string {


    return (

      task._id ||

      index.toString()

    );

  }

}