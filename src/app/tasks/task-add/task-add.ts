import {
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
  Router,
  RouterModule
} from '@angular/router';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  TaskService,
  TaskPayload
} from '../task';
import {
  NotificationServices
} from '../../core/notification/notification-services';

// =====================================================
// CLIENT TYPE
// =====================================================

interface TaskClient {

  _id?: string;

  name?: string;

  phone?: string;

  email?: string;

}


// =====================================================
// PROPERTY TYPE
// =====================================================

interface TaskProperty {

  _id?: string;

  title?: string;

  address?: string;

}


// =====================================================
// TASK ADD
// =====================================================

@Component({

  selector: 'app-task-add',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterModule

  ],

  templateUrl: './task-add.html',

  styleUrl: './task-add.scss'

})


export class TaskAdd implements OnInit {


  // =====================================================
  // API URLS
  // =====================================================

  private readonly propertiesApi =
    'http://localhost:3000/api/properties';


  private readonly clientsApi =
    'http://localhost:3000/api/clients';


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  saving = false;

  error = '';

  success = '';


  // =====================================================
  // DROPDOWN DATA
  // =====================================================

  properties: TaskProperty[] = [];

  clients: TaskClient[] = [];


  // =====================================================
  // FORM
  // =====================================================

  taskForm = new FormGroup({

    title: new FormControl<string>(

      '',

      {

        nonNullable: true,

        validators: [

          Validators.required,

          Validators.minLength(3)

        ]

      }

    ),


    description: new FormControl<string>(

      '',

      {

        nonNullable: true

      }

    ),


    relatedClient: new FormControl<string>(

      '',

      {

        nonNullable: true

      }

    ),


    relatedProperty: new FormControl<string>(

      '',

      {

        nonNullable: true

      }

    ),


    dueDate: new FormControl<string>(

      '',

      {

        nonNullable: true,

        validators: [

          Validators.required

        ]

      }

    ),


    priority: new FormControl<

      'High' |

      'Medium' |

      'Low'

    >(

      'Medium',

      {

        nonNullable: true,

        validators: [

          Validators.required

        ]

      }

    ),


    status: new FormControl<

      'Pending' |

      'In Progress' |

      'Completed'

    >(

      'Pending',

      {

        nonNullable: true,

        validators: [

          Validators.required

        ]

      }

    ),


    reminder: new FormControl<string>(

      '',

      {

        nonNullable: true

      }

    ),


    notes: new FormControl<string>(

      '',

      {

        nonNullable: true

      }

    )

  });


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private taskService: TaskService,

    private http: HttpClient,

    private router: Router,
    private notification:
    NotificationServices

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadProperties();

    this.loadClients();

  }


  // =====================================================
  // LOAD PROPERTIES
  // =====================================================

  loadProperties(): void {

    this.loading = true;


    const params = new HttpParams()

      .set('page', '1')

      .set('limit', '1000');


    this.http

      .get<any>(

        this.propertiesApi,

        { params }

      )

      .subscribe({

        next: (res) => {

          console.log(

            'PROPERTIES RESPONSE:',

            res

          );


          this.properties =

            Array.isArray(res)

              ? res

              : res?.data ||

                res?.properties ||

                res?.results ||

                [];


          this.loading = false;

        },


      error: (err) => {

  console.error(

    'LOAD PROPERTIES ERROR:',

    err

  );

  this.properties = [];

  this.loading = false;

  this.notification.error(

    err?.error?.message ||

    'Failed to load properties'

  );

}

      });

  }


  // =====================================================
  // LOAD CLIENTS
  // =====================================================

  loadClients(): void {

    const params = new HttpParams()

      .set('page', '1')

      .set('limit', '1000');


    this.http

      .get<any>(

        this.clientsApi,

        { params }

      )

      .subscribe({

        next: (res) => {

          console.log(

            'CLIENTS RESPONSE:',

            res

          );


          this.clients =

            Array.isArray(res)

              ? res

              : res?.data ||

                res?.clients ||

                res?.results ||

                [];


        },


        error: (err) => {

          console.error(

            'LOAD CLIENTS ERROR:',

            err

          );


          this.clients = [];

        }

      });

  }


  // =====================================================
  // CREATE TASK
  // =====================================================

  submitTask(): void {


    if (

  this.taskForm.invalid

) {

  this.taskForm.markAllAsTouched();

  this.notification.warning(
    'Please fill all required fields'
  );

  return;

}


    this.saving = true;

    this.error = '';

    this.success = '';


    const value =

      this.taskForm.getRawValue();


    const payload: TaskPayload = {


      title:

        value.title.trim(),


      description:

        value.description.trim() ||

        undefined,


      relatedClient:

        value.relatedClient ||

        undefined,


      relatedProperty:

        value.relatedProperty ||

        undefined,


      dueDate:

        value.dueDate,


      priority:

        value.priority,


      status:

        value.status,


      reminder:

        value.reminder ||

        undefined,


      notes:

        value.notes.trim() ||

        undefined

    };


    console.log(

      'CREATE TASK PAYLOAD:',

      payload

    );


    this.taskService

      .createTask(payload)

      .subscribe({

        next: (res) => {

          console.log(

            'TASK CREATED:',

            res

          );


          this.saving = false;


          this.success =

            'Task created successfully';


         this.notification.success(

  'Task created successfully'

);


          this.router.navigate([

            '/tasks'

          ]);

        },


        error: (err) => {

          console.error(

            'CREATE TASK ERROR:',

            err

          );


          this.saving = false;


         this.error =

  err?.error?.message ||

  err?.error?.error ||

  'Failed to create task';


this.notification.error(

  this.error

);

        }

      });

  }


  // =====================================================
  // CANCEL
  // =====================================================

  cancel(): void {

    this.router.navigate([

      '/tasks'

    ]);

  }


  // =====================================================
  // FORM ERROR
  // =====================================================

  hasError(

    controlName: string,

    error: string

  ): boolean {


    const control =

      this.taskForm.get(

        controlName

      );


    return !!(

      control &&

      control.touched &&

      control.hasError(error)

    );

  }

}