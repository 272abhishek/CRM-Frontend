import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';


// =====================================================
// TASK INTERFACE
// =====================================================

export interface Task {

  _id?: string;

  title: string;

  description?: string;

  relatedClient?: any;

  relatedProperty?: any;

  dueDate: string | Date;

  priority?:
    | 'High'
    | 'Medium'
    | 'Low';

  status?:
    | 'Pending'
    | 'In Progress'
    | 'Completed';

  reminder?: string | Date;

  notes?: string;

  createdBy?: any;

  reminderCount?: number;

  lastReminderSentTime?: string | Date;

  createdAt?: string | Date;

  updatedAt?: string | Date;

}


// =====================================================
// API RESPONSE
// =====================================================

interface TaskResponse {

  success?: boolean;

  count?: number;

  tasks?: Task[];

  message?: string;

}


// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector:
    'app-task-calendar',

  standalone:
    true,

  imports: [

    CommonModule

  ],

  templateUrl:
    './task-calendar.html',

  styleUrl:
    './task-calendar.scss'

})


export class TaskCalendar

implements OnInit {


  // =====================================================
  // API
  // =====================================================

  private apiUrl =
    'http://localhost:3000/api/tasks';


  // =====================================================
  // STATE
  // =====================================================

  loading =
    false;


  tasks:
    Task[] =
    [];


  selectedDate:
    Date =
    new Date();


  currentMonth:
    Date =
    new Date();


  // =====================================================
  // CALENDAR
  // =====================================================

  weekDays:
    string[] = [

      'Sun',

      'Mon',

      'Tue',

      'Wed',

      'Thu',

      'Fri',

      'Sat'

    ];


  calendarDays:
    Date[] =
    [];


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private http:
      HttpClient,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit():

    void {

    this.generateCalendar();

    this.loadTasks();

  }


  // =====================================================
  // MONTH NAME
  // =====================================================

  get monthName():

    string {

    return this.currentMonth.toLocaleDateString(

      'en-IN',

      {

        month:
          'long',

        year:
          'numeric'

      }

    );

  }


  // =====================================================
  // GET USER ROLE
  // =====================================================

  private getUserRole():

    string {

    const userRaw =
      localStorage.getItem(

        'user'

      );


    if (!userRaw) {

      return '';

    }


    try {

      return JSON.parse(

        userRaw

      )?.role || '';

    }

    catch {

      return '';

    }

  }


  // =====================================================
  // GET API ENDPOINT
  // =====================================================

  private getTasksEndpoint():

    string {

    const role =
      this.getUserRole();


    switch (role) {


      case 'admin':

        return `${this.apiUrl}/admin/all`;


      case 'agent':

        return `${this.apiUrl}/agent`;


      case 'builder':

        return `${this.apiUrl}/builder`;


      case 'seller':

        return `${this.apiUrl}/seller`;


      default:

        return `${this.apiUrl}/buyer-tasks`;

    }

  }


  // =====================================================
  // LOAD TASKS
  // =====================================================

  loadTasks():

    void {


    this.loading =
      true;


    this.tasks =
      [];


    this.cdr.detectChanges();


    const token =
      localStorage.getItem(

        'jwt'

      );


    const headers =
      new HttpHeaders({

        'Content-Type':
          'application/json',

        Authorization:
          `Bearer ${token}`

      });


    const endpoint =
      this.getTasksEndpoint();


    this.http

      .get<TaskResponse>(

        endpoint,

        {

          headers

        }

      )

      .subscribe({

        next:
          (res) => {


            // =====================================
            // BACKEND:
            // {
            //   success: true,
            //   count: 10,
            //   tasks: [...]
            // }
            // =====================================

            this.tasks =
              Array.isArray(

                res?.tasks

              )

                ? res.tasks

                : [];


            this.loading =
              false;


            this.generateCalendar();


            this.cdr.detectChanges();


          },


        error:
          (err) => {


            console.error(

              'LOAD TASKS ERROR:',

              err

            );


            this.tasks =
              [];


            this.loading =
              false;


            this.cdr.detectChanges();

          }

      });

  }


  // =====================================================
  // TODAY
  // =====================================================

  goToToday():

    void {


    const today =
      new Date();


    this.currentMonth =
      new Date(

        today.getFullYear(),

        today.getMonth(),

        1

      );


    this.selectedDate =
      today;


    this.generateCalendar();


    this.cdr.detectChanges();

  }


  // =====================================================
  // PREVIOUS MONTH
  // =====================================================

  previousMonth():

    void {


    this.currentMonth =
      new Date(

        this.currentMonth.getFullYear(),

        this.currentMonth.getMonth() - 1,

        1

      );


    this.generateCalendar();


    this.cdr.detectChanges();

  }


  // =====================================================
  // NEXT MONTH
  // =====================================================

  nextMonth():

    void {


    this.currentMonth =
      new Date(

        this.currentMonth.getFullYear(),

        this.currentMonth.getMonth() + 1,

        1

      );


    this.generateCalendar();


    this.cdr.detectChanges();

  }


  // =====================================================
  // GENERATE CALENDAR
  // =====================================================

  generateCalendar():

    void {


    const year =
      this.currentMonth.getFullYear();


    const month =
      this.currentMonth.getMonth();


    const firstDay =
      new Date(

        year,

        month,

        1

      );


    const lastDay =
      new Date(

        year,

        month + 1,

        0

      );


    const startDay =
      firstDay.getDay();


    const totalDays =
      lastDay.getDate();


    const days:
      Date[] =
      [];


    // =====================================
    // PREVIOUS MONTH DAYS
    // =====================================

    for (

      let i =
        startDay - 1;

      i >= 0;

      i--

    ) {


      days.push(

        new Date(

          year,

          month,

          -i

        )

      );

    }


    // =====================================
    // CURRENT MONTH DAYS
    // =====================================

    for (

      let day =
        1;

      day <= totalDays;

      day++

    ) {


      days.push(

        new Date(

          year,

          month,

          day

        )

      );

    }


    // =====================================
    // NEXT MONTH DAYS
    // =====================================

    let nextDay =
      1;


    while (

      days.length < 42

    ) {


      days.push(

        new Date(

          year,

          month + 1,

          nextDay

        )

      );


      nextDay++;

    }


    this.calendarDays =
      days;


    this.cdr.detectChanges();

  }


  // =====================================================
  // CURRENT MONTH CHECK
  // =====================================================

  isCurrentMonth(

    date:
      Date

  ):

    boolean {


    return (

      date.getMonth() ===

      this.currentMonth.getMonth()

      &&

      date.getFullYear() ===

      this.currentMonth.getFullYear()

    );

  }


  // =====================================================
  // TODAY CHECK
  // =====================================================

  isToday(

    date:
      Date

  ):

    boolean {


    const today =
      new Date();


    return (

      date.getDate() ===

      today.getDate()

      &&

      date.getMonth() ===

      today.getMonth()

      &&

      date.getFullYear() ===

      today.getFullYear()

    );

  }


  // =====================================================
  // SELECTED DATE CHECK
  // =====================================================

  isSelected(

    date:
      Date

  ):

    boolean {


    return (

      date.getDate() ===

      this.selectedDate.getDate()

      &&

      date.getMonth() ===

      this.selectedDate.getMonth()

      &&

      date.getFullYear() ===

      this.selectedDate.getFullYear()

    );

  }


  // =====================================================
  // SELECT DATE
  // =====================================================

  selectDate(

    date:
      Date

  ):

    void {


    this.selectedDate =
      date;


    this.cdr.detectChanges();

  }


  // =====================================================
  // GET TASKS FOR DATE
  // =====================================================

  getTasksForDate(

    date:
      Date

  ):

    Task[] {


    return this.tasks.filter(

      task => {


        if (

          !task.dueDate

        ) {

          return false;

        }


        const taskDate =
          new Date(

            task.dueDate

          );


        return (

          taskDate.getDate() ===

          date.getDate()

          &&

          taskDate.getMonth() ===

          date.getMonth()

          &&

          taskDate.getFullYear() ===

          date.getFullYear()

        );

      }

    );

  }


  // =====================================================
  // SELECTED DATE TASKS
  // =====================================================

  get selectedDateTasks():

    Task[] {


    return this.getTasksForDate(

      this.selectedDate

    );

  }


  // =====================================================
  // CLIENT NAME
  // =====================================================

  getClientName(

    task:
      Task

  ):

    string {


    const client =
      task.relatedClient;


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

      '—'

    );

  }


  // =====================================================
  // PROPERTY TITLE
  // =====================================================

  getPropertyTitle(

    task:
      Task

  ):

    string {


    const property =
      task.relatedProperty;


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
  // FILTER TASKS
  // =====================================================

  filterTasks(

    status:
      'Pending' |

      'In Progress' |

      'Completed'

  ):

    Task[] {


    return this.tasks.filter(

      task =>

        task.status ===

        status

    );

  }


  // =====================================================
  // STATUS COUNT
  // =====================================================

  getTaskCount(

    status:
      'Pending' |

      'In Progress' |

      'Completed'

  ):

    number {


    return this.tasks.filter(

      task =>

        task.status ===

        status

    ).length;

  }


  // =====================================================
  // STATUS COUNT FOR TEMPLATE
  // =====================================================

  getTaskCountByStatus(

    status:

      'Pending' |

      'In Progress' |

      'Completed'

  ):

    number {


    return this.tasks.filter(

      task =>

        task.status ===

        status

    ).length;

  }


  // =====================================================
  // TASK DETAILS
  // =====================================================

  openTask(

    task:
      Task

  ):

    void {


    if (

      task._id

    ) {


      console.log(

        'Selected Task:',

        task

      );

    }

  }

}