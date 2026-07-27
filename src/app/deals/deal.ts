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

  area?: string;

}


// =====================================================
// NOTE TYPE
// =====================================================

export interface DealNote {

  note: string;

  createdAt?: string;

  addedBy?: string;

}


// =====================================================
// DEAL TYPE
// =====================================================

export interface Deal {

  _id?: string;


  // ===================================================
  // RELATION IDS
  // ===================================================

  propertyId:
    | string
    | DealProperty;


  clientId:
    | string
    | DealClient;


  agentId:
    | string
    | any;


  builderId?:
    | string
    | any;


  sellerId?:
    | string
    | any;


  // ===================================================
  // DEAL AMOUNTS
  // ===================================================

  amount:
    number;


  tokenAmount?:
    number;


  // ===================================================
  // COMMISSION
  // ===================================================

  commissionEarned?:
    number;


  commissionPercentage?:
    number;


  commissionAmount?:
    number;


  commissionStatus?:
    | 'Pending'
    | 'Approved'
    | 'Paid'
    | 'Rejected';


  // ===================================================
  // PAYMENT
  // ===================================================

  paymentStatus?:
    | 'Pending'
    | 'Partial'
    | 'Paid'
    | 'Completed';


  // ===================================================
  // DEAL STATUS
  // ===================================================

  status?:
    | 'Open'
    | 'Negotiation'
    | 'Closed'
    | 'Cancelled';


  // ===================================================
  // DATE
  // ===================================================

  dealDate?:
    string;


  createdAt?:
    string;


  updatedAt?:
    string;


  // ===================================================
  // NOTES
  // ===================================================

  notes?:
    DealNote[];

}


// =====================================================
// API RESPONSE
// =====================================================

export interface DealResponse {

  total:
    number;


  page?:
    number;


  limit?:
    number;


  totalItems?:
    number;


  totalPages?:
    number;


  currentPage?:
    number;


  pageSize?:
    number;


  sort?:
    string;


  order?:
    string;


  filters?:
    any;


  data:
    Deal[];

}


// =====================================================
// QUERY PARAMS
// =====================================================

export interface DealQueryParams {

  page?:
    number;


  limit?:
    number;


  sort?:
    string;


  order?:
    string;


  q?:
    string;


  name?:
    string;


  status?:
    string;


  paymentStatus?:
    | 'Pending'
    | 'Partial'
    | 'Paid'
    | 'Completed';


  commissionStatus?:
    | 'Pending'
    | 'Approved'
    | 'Paid'
    | 'Rejected';


  propertyId?:
    string;


  clientId?:
    string;


  dealDate?:
    string;


  [key: string]:
    any;

}


// =====================================================
// SERVICE
// =====================================================

@Injectable({

  providedIn:
    'root'

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

      localStorage.getItem(

        'user'

      );


    if (!raw) {

      return null;

    }


    try {

      const user =

        JSON.parse(

          raw

        );


      return user?.role || null;

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

      localStorage.getItem(

        'jwt'

      );


    return new HttpHeaders({

      'Content-Type':
        'application/json',

      'Authorization':
        `Bearer ${token}`

    });

  }



  // =====================================================
  // GET ALL DEALS
  // =====================================================

  getDeals(

    queryParams:
      DealQueryParams = {}

  ):

    Observable<DealResponse> {


    let params =

      new HttpParams();


    Object.keys(

      queryParams

    ).forEach(key => {


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

            String(value)

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

    id:
      string

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
  // CREATE DEAL
  // =====================================================

  createDeal(

    data:
      Partial<Deal>

  ):

    Observable<any> {


    return this.http.post<any>(

      this.getEndpointForRole(),

      data,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }



  // =====================================================
  // UPDATE DEAL
  // =====================================================

  updateDeal(

    id:
      string,

    data:
      Partial<Deal>

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


    return this.http.put<any>(

      url,

      data,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }



  // =====================================================
  // DELETE DEAL
  // =====================================================

  deleteDeal(

    id:
      string

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


    Object.keys(

      queryParams

    ).forEach(key => {


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

            String(value)

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