import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';


// =====================================================
// CLIENT TYPE
// =====================================================

export interface DealClient {

  _id?: string;

  name: string;

  phone?: string;

  email?: string;

}


// =====================================================
// PROPERTY TYPE
// =====================================================

export interface DealProperty {

  _id?: string;

  title: string;

  address?: string;

}


// =====================================================
// NOTE TYPE
// =====================================================

export interface Deal {

  _id?: string;

  propertyId: string;

  clientId: string;

  agentId: string;

  builderId?: string;

  sellerId?: string;

  amount: number;

  commissionEarned?: number;

  status?:
    | 'Open'
    | 'Negotiation'
    | 'Closed'
    | 'Cancelled';

  notes?: DealNote[];

  createdAt?: string;

  updatedAt?: string;

}


export interface DealNote {

  note: string;

  createdAt?: string;

  addedBy?: string;

}

// =====================================================
// DEAL INTERFACE
// =====================================================



// =====================================================
// API RESPONSE
// =====================================================

export interface DealResponse {

  total: number;

  page: number;

  limit: number;

  sort: string;

  order: string;

  filters: any;

  data: Deal[];

}


// =====================================================
// QUERY PARAMS
// =====================================================

export interface DealQueryParams {

  page?: number;

  limit?: number;

  sort?: string;

  order?: string;

  q?: string;

  [key: string]: any;

}


// =====================================================
// SERVICE
// =====================================================

@Injectable({

  providedIn: 'root'

})

export class DealService {


  private baseUrl =
    'http://localhost:3000/api/deals';


  constructor(

    private http:
      HttpClient

  ) {}


  // =====================================================
  // GET ROLE
  // =====================================================

  private getRole():
    string | null {


    const raw =
      localStorage.getItem('user');


    if (!raw) {

      return null;

    }


    try {

      return JSON.parse(raw).role;

    }

    catch {

      return null;

    }

  }


  // =====================================================
  // ROLE BASED ENDPOINT
  // =====================================================

  private getEndpointForRole():
    string {


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


      case 'client':

        return `${this.baseUrl}/client`;


      default:

        return this.baseUrl;

    }

  }


  // =====================================================
  // AUTH HEADERS
  // =====================================================

  private getAuthHeaders():
    HttpHeaders {


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
  // GET DEALS
  // =====================================================

  getDeals(

    queryParams:
      DealQueryParams = {}

  ):
    Observable<DealResponse> {


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


    return this.http.get<DealResponse>(

      this.getEndpointForRole(),

      {

        headers:
          this.getAuthHeaders(),

        params

      }

    );

  }


  // =====================================================
  // GET DEAL BY ID
  // =====================================================

  getDealById(

    id: string

  ):
    Observable<Deal> {


    return this.http.get<Deal>(

      `${this.baseUrl}/${id}`,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // CREATE
  // =====================================================

  createDeal(

    data:
      Partial<Deal>

  ):
    Observable<Deal> {


    return this.http.post<Deal>(

      this.getEndpointForRole(),

      data,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // UPDATE
  // =====================================================

  updateDeal(

    id: string,

    data:
      Partial<Deal>

  ):
    Observable<Deal> {


    const role =
      this.getRole();


    let url =
      `${this.baseUrl}/${id}`;


    if (

      role === 'builder'

    ) {

      url =
        `${this.baseUrl}/${id}/builder`;

    }


    if (

      role === 'seller'

    ) {

      url =
        `${this.baseUrl}/${id}/seller`;

    }


    return this.http.put<Deal>(

      url,

      data,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // DELETE
  // =====================================================

  deleteDeal(

    id: string

  ):
    Observable<any> {


    const role =
      this.getRole();


    let url =
      `${this.baseUrl}/${id}`;


    if (

      role === 'builder'

    ) {

      url =
        `${this.baseUrl}/${id}/builder`;

    }


    if (

      role === 'seller'

    ) {

      url =
        `${this.baseUrl}/${id}/seller`;

    }


    return this.http.delete(

      url,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  // =====================================================
  // SALES REPORT
  // =====================================================

  getSalesReport(

    queryParams:
      any = {}

  ):
    Observable<any> {


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


    return this.http.get(

      `${this.baseUrl}/report/sales`,

      {

        headers:
          this.getAuthHeaders(),

        params

      }

    );

  }

}