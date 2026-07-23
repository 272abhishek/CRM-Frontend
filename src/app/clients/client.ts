import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FollowUpNote {
  note: string;
  createdAt?: string;
}
export interface ClientInterface {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  budget?: number;
  requirement?: string;
  interestedProject?: string;
  preferredLocation?: string;
  timeline?: string;
  followUpNotes?: FollowUpNote[];
  leadSource?: string;
  priority?: 'High' | 'Medium' | 'Low';
  communicationPreference?: 'Call' | 'WhatsApp' | 'Email';
  assignedAgent?: string;
  builderId?: string;
  sellerId?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ClientResponse {
  total: number;
  page: number;
  limit: number;
  sort: string;
  order: string;
  filters: any;
  data: ClientInterface[];
}

export interface ClientQueryParams {
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
export class Client {
  private baseUrl = 'http://localhost:3000/api/clients';

  constructor(private http: HttpClient) {}

  private getRole(): string | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw).role;
    } catch {
      return null;
    }
  }

  // ✅ Role-based base path — 'client' role has NO create/update/delete route
  // (only /me for viewing own profile), so it falls back to plain baseUrl,
  // which will 404 for those ops. That's expected — clients shouldn't be
  // creating/editing client records themselves.
  private getRoleBasePath(): string {
    const role = this.getRole();
    switch (role) {
      case 'admin':   return `${this.baseUrl}/admin`;
      case 'agent':   return `${this.baseUrl}/agent`;
      case 'builder': return `${this.baseUrl}/builder`;
      case 'seller':  return `${this.baseUrl}/seller`;
      default:        return this.baseUrl;
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getClients(queryParams: ClientQueryParams = {}): Observable<ClientResponse> {
    let params = new HttpParams();
    Object.keys(queryParams).forEach(key => {
      const value = queryParams[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    const role = this.getRole();
    const endpoint = role === 'client' ? `${this.baseUrl}/me` : this.getRoleBasePath();

    return this.http.get<ClientResponse>(endpoint, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  getClientById(id: string): Observable<ClientInterface> {
    return this.http.get<ClientInterface>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Now POSTs to /admin, /agent, /builder, or /seller — matches router
  createClient(data: ClientInterface): Observable<ClientInterface> {
    return this.http.post<ClientInterface>(this.getRoleBasePath(), data, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Now PUTs to /admin/:id, /agent/:id, /builder/:id, or /seller/:id — matches router
  updateClient(id: string, data: Partial<ClientInterface>): Observable<ClientInterface> {
    return this.http.put<ClientInterface>(`${this.getRoleBasePath()}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ⚠️ Router only defines DELETE /admin/:id — delete is admin-only.
  // Calling this as agent/builder/seller will 404. That matches backend
  // intent (only admin can delete), so UI should hide the delete button
  // for non-admin roles.
  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}