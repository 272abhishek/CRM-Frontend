// src/app/property-visits/propertyInterface.ts

// =====================================================
// VISIT STATUS
// =====================================================

export type VisitStatus =
  | 'Planned'
  | 'Visited'
  | 'Interested'
  | 'Not Interested'
  | 'Shortlisted'
  | 'Closed';


// =====================================================
// CLIENT
// =====================================================

export interface VisitClient {

  _id?: string;

  name: string;

  phone?: string;

  email?: string;

  budget?: number | string;

  requirement?: string;

  preferredLocation?: string;

  timeline?: string;

}


// =====================================================
// PROPERTY
// =====================================================

export interface VisitProperty {

  _id?: string;

  title?: string;

  address?: string;

  area?: string;

  subArea?: string;

  possessionStatus?: string;

  variants?: any[];

  [key: string]: any;

}


// =====================================================
// PROPERTY VISIT
// =====================================================

export interface PropertyVisit {

  _id?: string;

  clientId: string;

  propertyId: string;

  visitDate?: string;

  status?: VisitStatus;

  notes?: string;

  dealId?: string;

  agentId?: string;

  builderId?: string;

  sellerId?: string;

  createdAt?: string;

  updatedAt?: string;

}


// =====================================================
// QUERY PARAMS
// =====================================================

export interface PropertyVisitQueryParams {

  page?: number;

  limit?: number;

  q?: string;

  status?: VisitStatus;

  clientId?: string;

  propertyId?: string;

  visitDate?: string;

  sort?: string;

  order?: 'asc' | 'desc';

}


// =====================================================
// PAGINATION RESPONSE
// =====================================================

export interface PropertyVisitResponse {

  data: PropertyVisit[];

  totalItems: number;

  currentPage: number;

  totalPages: number;

  pageSize: number;

  total?: number;

}