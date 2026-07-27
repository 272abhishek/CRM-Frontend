// src/app/property-visits/propertyInterface.ts


// =====================================================
// VISIT STATUS
// =====================================================

export type VisitStatus =

  | 'Scheduled'

  | 'Planned'

  | 'Visited'

  | 'Not Interested'

  | 'Selected'

  | 'Rejected'

  | 'Negotiation'

  | 'Closed'

  | 'Cancelled';


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
// USER
// =====================================================

export interface VisitUser {

  _id?: string;

  name?: string;

  email?: string;

  phone?: string;

}


// =====================================================
// DEAL
// =====================================================

export interface VisitDeal {

  _id?: string;

  amount?: number;

  status?: string;

}


// =====================================================
// PROPERTY VISIT
// =====================================================

export interface PropertyVisit {

  _id?: string;


  // Can be ID OR populated client object

  clientId:

    string |

    VisitClient;


  // Can be ID OR populated property object

  propertyId:

    string |

    VisitProperty;


  visitDate?: string;


  status?: VisitStatus;


  notes?: string;


  // Can be ID OR populated deal object

  dealId?:

    string |

    VisitDeal;


  agentId?:

    string |

    VisitUser;


  builderId?:

    string |

    VisitUser;


  sellerId?:

    string |

    VisitUser;


  createdBy?:

    string |

    VisitUser;


  dealCreatedBy?:

    string |

    VisitUser;


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