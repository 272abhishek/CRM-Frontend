// src/app/property-visits/property-visit.ts

import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  PropertyVisit,
  PropertyVisitResponse,
  PropertyVisitQueryParams,
  VisitClient,
  VisitProperty
} from './propertyInterface';


// =====================================================
// SERVICE
// =====================================================

@Injectable({

  providedIn: 'root'

})


export class PropertyVisitService {


  // =====================================================
  // API URLS
  // =====================================================

  private visitUrl =
    'http://localhost:3000/api/property-visits';

  private clientUrl =
    'http://localhost:3000/api/clients';

  private propertyUrl =
    'http://localhost:3000/api/properties';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private http: HttpClient

  ) {}


  // =====================================================
  // AUTH HEADERS
  // =====================================================

  private getHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('jwt');

    return new HttpHeaders({

      'Content-Type':
        'application/json',

      Authorization:
        `Bearer ${token}`

    });

  }


  // =====================================================
  // BUILD QUERY PARAMS
  // =====================================================

  private buildParams(
    data: any = {}
  ): HttpParams {

    let params =
      new HttpParams();

    Object.keys(data).forEach(key => {

      const value =
        data[key];

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

    return params;

  }


  // =====================================================
  // SEARCH CLIENTS
  // =====================================================

  searchClients(
    query: string
  ): Observable<{
    data: VisitClient[];
  }> {

    const params =
      this.buildParams({

        q: query

      });

    return this.http.get<{
      data: VisitClient[];
    }>(

      this.clientUrl,

      {

        headers:
          this.getHeaders(),

        params

      }

    );

  }


  // =====================================================
  // FILTER PROPERTIES
  // =====================================================

  filterProperties(
    filters: any = {}
  ): Observable<{
    data: VisitProperty[];
  }> {

    const params =
      this.buildParams(filters);

    return this.http.get<{
      data: VisitProperty[];
    }>(

      this.propertyUrl,

      {

        headers:
          this.getHeaders(),

        params

      }

    );

  }


  // =====================================================
  // GET ALL VISITS
  // =====================================================

  getVisits(
    queryParams: PropertyVisitQueryParams = {}
  ): Observable<PropertyVisitResponse> {

    const params =
      this.buildParams(queryParams);

    return this.http.get<PropertyVisitResponse>(

      this.visitUrl,

      {

        headers:
          this.getHeaders(),

        params

      }

    );

  }


  // =====================================================
  // GET SINGLE VISIT
  // =====================================================

  getVisitById(
    id: string
  ): Observable<any> {

    return this.http.get(

      `${this.visitUrl}/${id}`,

      {

        headers:
          this.getHeaders()

      }

    );

  }


  // =====================================================
  // GET CLIENT VISITS
  // =====================================================

  getClientVisits(
    clientId: string
  ): Observable<any> {

    return this.http.get(

      `${this.visitUrl}/client/${clientId}`,

      {

        headers:
          this.getHeaders()

      }

    );

  }


  // =====================================================
  // GET PROPERTY VISITS
  // =====================================================

  getPropertyVisits(
    propertyId: string
  ): Observable<any> {

    return this.http.get(

      `${this.visitUrl}/property/${propertyId}`,

      {

        headers:
          this.getHeaders()

      }

    );

  }


  // =====================================================
  // CREATE VISIT
  // =====================================================

  createVisit(
    data: Partial<PropertyVisit>
  ): Observable<any> {

    return this.http.post(

      this.visitUrl,

      data,

      {

        headers:
          this.getHeaders()

      }

    );

  }


  // =====================================================
  // UPDATE VISIT
  // =====================================================

  updateVisit(

    id: string,

    data: Partial<PropertyVisit>

  ): Observable<any> {

    return this.http.put(

      `${this.visitUrl}/${id}`,

      data,

      {

        headers:
          this.getHeaders()

      }

    );

  }


  // =====================================================
  // DELETE VISIT
  // =====================================================

  deleteVisit(
    id: string
  ): Observable<any> {

    return this.http.delete(

      `${this.visitUrl}/${id}`,

      {

        headers:
          this.getHeaders()

      }

    );

  }

}