import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';


export interface Variant {

  carpetSize: number;

  superBuiltUpArea: number;

  price: number;

  floor: number;

  masterBedroom: boolean;

  modularKitchen: boolean;

}


export interface RealEstate {

  _id: string;

  title: string;

  address: string;

  area: string;

  subArea: string;

  possessionStatus: string;

  variants: Variant[];

  commissionPercentage: number;

  builderPromises: string[];

  amenities: string[];

  communityRestrictions?: string;

  airportDistanceKm?: number;

  railwayStationDistanceKm?: number;

  metroDistanceKm?: number;

  busStopDistanceKm?: number;

  parkDistanceKm?: number;

  stadiumDistanceKm?: number;

  connectivityNotes?: string;

  images: string[];

  documents: string[];

  role: string;

  createdBy: any;

  builderId?: string;

  sellerId?: string;

  agentId?: string;

  createdAt?: string;

  updatedAt?: string;

}


export interface PropertyResponse {

  total: number;

  page: number;

  limit: number;

  sort: string;

  order: string;

  filters: any;

  data: RealEstate[];

}


export interface PropertyQueryParams {

  page?: number;

  limit?: number;

  sort?: string;

  order?: string;

  q?: string;

  [key: string]: any;

}


@Injectable({
  providedIn: 'root'
})
export class Property {

  private baseUrl =
    'http://localhost:3000/api/properties';


  constructor(
    private http: HttpClient
  ) {}


  private getRole(): string | null {

    const raw =
      localStorage.getItem('user');

    if (!raw) {
      return null;
    }

    try {

      return JSON.parse(raw).role;

    } catch {

      return null;

    }

  }


  private getEndpointForRole(): string {

    const role =
      this.getRole();

    return role
      ? `${this.baseUrl}/${role}`
      : this.baseUrl;

  }


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


  getProperties(
    queryParams: PropertyQueryParams = {}
  ): Observable<PropertyResponse> {


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


    return this.http.get<PropertyResponse>(

      this.getEndpointForRole(),

      {

        headers:
          this.getAuthHeaders(),

        params

      }

    );

  }


  getPropertyById(
    id: string
  ): Observable<RealEstate> {

    return this.http.get<RealEstate>(

      `${this.baseUrl}/${id}`,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  createProperty(
    data: any
  ): Observable<RealEstate> {

    return this.http.post<RealEstate>(

      this.getEndpointForRole(),

      data,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  updateProperty(
    id: string,
    data: any
  ): Observable<RealEstate> {

    return this.http.put<RealEstate>(

      `${this.getEndpointForRole()}/${id}`,

      data,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }


  deleteProperty(
    id: string
  ): Observable<any> {

    return this.http.delete(

      `${this.getEndpointForRole()}/${id}`,

      {

        headers:
          this.getAuthHeaders()

      }

    );

  }

}