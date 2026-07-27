import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';


// =====================================================
// USER
// =====================================================

export interface TaskUser {

  _id?: string;

  name?: string;

  email?: string;

  phone?: string;

  role?: string;

}


// =====================================================
// CLIENT
// =====================================================

export interface TaskClient {

  _id?: string;

  name?: string;

  phone?: string;

  email?: string;

}


// =====================================================
// PROPERTY
// =====================================================

export interface TaskProperty {

  _id?: string;

  title?: string;

  address?: string;

}


// =====================================================
// TASK
// =====================================================

export interface Task {

  _id?: string;

  title: string;

  description?: string;

  relatedClient?: string | TaskClient;

  relatedProperty?: string | TaskProperty;

  dueDate: string;

  priority:
    | 'High'
    | 'Medium'
    | 'Low';

  status:
    | 'Pending'
    | 'In Progress'
    | 'Completed';

  reminder?: string;

  notes?: string;

  reminderCount?: number;

  lastReminderSentTime?: string;

  createdBy?: string | TaskUser;

  createdAt?: string;

  updatedAt?: string;

}


// =====================================================
// TASK RESPONSE
// =====================================================

export interface TaskResponse {

  success?: boolean;

  count?: number;

  tasks: Task[];

  message?: string;

}


// =====================================================
// TASK QUERY PARAMS
// =====================================================

export interface TaskQueryParams {

  page?: number;

  limit?: number;

  sort?: string;

  order?: string;

  q?: string;

  [key: string]: any;

}


// =====================================================
// TASK PAYLOAD
// =====================================================

export interface TaskPayload {

  title?: string;

  description?: string;

  relatedClient?: string;

  relatedProperty?: string;

  dueDate?: string;

  priority?:
    | 'High'
    | 'Medium'
    | 'Low';

  status?:
    | 'Pending'
    | 'In Progress'
    | 'Completed';

  reminder?: string;

  notes?: string;

}


// =====================================================
// TASK SERVICE
// =====================================================

@Injectable({

  providedIn: 'root'

})


export class TaskService {


  // =====================================================
  // BASE URL
  // =====================================================

  private baseUrl =
    'http://localhost:3000/api/tasks';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private http: HttpClient

  ) {}


  // =====================================================
  // GET CURRENT USER
  // =====================================================

  private getCurrentUser(): any {

    const raw =
      localStorage.getItem('user');


    if (!raw) {

      return null;

    }


    try {

      return JSON.parse(raw);

    }

    catch {

      return null;

    }

  }


  // =====================================================
  // GET ROLE
  // =====================================================

  private getRole(): string | null {

    const user =
      this.getCurrentUser();


    return user?.role || null;

  }


  // =====================================================
  // GET AUTH HEADERS
  // =====================================================

  private getAuthHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('jwt');


    return new HttpHeaders({

      'Content-Type':
        'application/json',

      'Authorization':
        `Bearer ${token}`

    });

  }


  // =====================================================
  // GET CREATE ENDPOINT
  // =====================================================

  private getCreateEndpoint(): string {

    const role =
      this.getRole();


    switch (role) {

      case 'admin':

        return `${this.baseUrl}/admin`;


      case 'agent':

        return `${this.baseUrl}/agent`;


      case 'builder':

        return `${this.baseUrl}/builder`;


      case 'seller':

        return `${this.baseUrl}/seller`;


      default:

        return this.baseUrl;

    }

  }


  // =====================================================
  // GET TASKS
  // =====================================================

  getTasks(

    queryParams:
      TaskQueryParams = {}

  ): Observable<TaskResponse> {


    const role =
      this.getRole();


    let endpoint: string;


    switch (role) {


      case 'admin':

        endpoint =
          `${this.baseUrl}/admin/all`;

        break;


      case 'agent':

        endpoint =
          `${this.baseUrl}/agent`;

        break;


      case 'builder':

        endpoint =
          `${this.baseUrl}/builder`;

        break;


      case 'seller':

        endpoint =
          `${this.baseUrl}/seller`;

        break;


      default:

        endpoint =
          `${this.baseUrl}/buyer-tasks`;

        break;

    }


    let params =
      new HttpParams();


    Object.keys(queryParams)

      .forEach(key => {


        const value =
          queryParams[key];


        if (

          value !== null &&

          value !== undefined &&

          value !== ''

        ) {


          params =

            params.set(

              key,

              value.toString()

            );

        }

      });


    return this.http.get<TaskResponse>(

      endpoint,

      {

        headers:
          this.getAuthHeaders(),

        params

      }

    );

  }


  // =====================================================
  // GET ADMIN OWN TASKS
  // =====================================================

  getMyAdminTasks():

    Observable<TaskResponse> {


    return this.http.get<TaskResponse>(

      `${this.baseUrl}/admin/my`,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // GET TASK BY ID
  // =====================================================

  getTaskById(

    id: string

  ): Observable<TaskResponse> {


    return this.http.get<TaskResponse>(

      `${this.baseUrl}/${id}`,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // CREATE TASK
  // =====================================================

  createTask(

    data: TaskPayload

  ): Observable<TaskResponse> {


    return this.http.post<TaskResponse>(

      this.getCreateEndpoint(),

      data,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // UPDATE TASK
  // =====================================================

  updateTask(

    id: string,

    data: TaskPayload

  ): Observable<TaskResponse> {


    const role =
      this.getRole();


    if (!role) {

      throw new Error(
        'User role not found'
      );

    }


    return this.http.put<TaskResponse>(

      `${this.baseUrl}/${id}/${role}`,

      data,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // DELETE TASK
  // =====================================================

  deleteTask(

    id: string

  ): Observable<any> {


    const role =
      this.getRole();


    if (!role) {

      throw new Error(
        'User role not found'
      );

    }


    return this.http.delete(

      `${this.baseUrl}/${id}/${role}`,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // GET OVERDUE TASKS
  // =====================================================

  getOverdueTasks():

    Observable<TaskResponse> {


    return this.http.get<TaskResponse>(

      `${this.baseUrl}/overdue`,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // GET BUYER TASKS
  // =====================================================

  getBuyerTasks():

    Observable<TaskResponse> {


    return this.http.get<TaskResponse>(

      `${this.baseUrl}/buyer-tasks`,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }

}