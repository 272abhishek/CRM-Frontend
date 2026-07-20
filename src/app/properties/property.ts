import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RealEstate {
  _id: string;
  title: string;
  address: string;
  area: string;
  subArea: string;
  possessionStatus: string;
  variants: any[];
  commissionPercentage: number;
  builderPromises: string[];
  amenities: string[];
  images: string[];
  role: string;
  createdBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class Property {
  private baseUrl = 'http://localhost:3000/api/properties';

  constructor(private http: HttpClient) {}

  /** ✅ Helper to attach JWT token */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getProperties(): Observable<RealEstate[]> {
    return this.http.get<RealEstate[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getPropertyById(id: string): Observable<RealEstate> {
    return this.http.get<RealEstate>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createProperty(data: any): Observable<RealEstate> {
    return this.http.post<RealEstate>(this.baseUrl, data, { headers: this.getAuthHeaders() });
  }

  updateProperty(id: string, data: any): Observable<RealEstate> {
    return this.http.put<RealEstate>(`${this.baseUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteProperty(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
