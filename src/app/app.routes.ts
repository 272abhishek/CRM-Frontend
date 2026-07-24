import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Profile } from './profiles/profile/profile';

import { Property } from './layout/property/property';
import { Client } from './layout/client/client';
import { Home } from './layout/home/home';

import { PropertyDetail } from './properties/property-detail/property-detail';
import { PropertyList } from './properties/property-list/property-list';
import { PropertiesAdd } from './properties/properties-add/properties-add';
import { PropertyEdit } from './properties/property-edit/property-edit';

import { ClientList } from './clients/client-list/client-list';
import { ClientAdd } from './clients/client-add/client-add';
import { ClientEdit } from './clients/client-edit/client-edit';
import { ClientDetail } from './clients/client-detail/client-detail';
import { PropertyVisitList } from './property-visits/property-visit-list/property-visit-list';
import { PropertyVisitAdd } from './property-visits/property-visit-add/property-visit-add';
import { PropertyVisitEdit } from './property-visits/property-visit-edit/property-visit-edit';
import { PropertyVisitDetail } from './property-visits/property-visit-detail/property-visit-detail';


export const routes: Routes = [

  // =========================
  // Auth
  // =========================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Signup
  },


  // =========================
  // Profile
  // =========================

  {
    path: 'profile',
    component: Profile
  },

       {
    path: 'property-visits',
    component: PropertyVisitList
  },

  {
    path: 'property-visits/add',
    component: PropertyVisitAdd
  },

  {
    path: 'property-visits/edit/:id',
    component: PropertyVisitEdit
  },

  {
    path: 'property-visits/:id',
    component: PropertyVisitDetail
  },
  // =========================
  // Client Layout
  // =========================

  {
    path: 'clients',
    component: Client,
    children: [

      {
        path: '',
        component: ClientList
      },

      {
        path: 'add',
        component: ClientAdd
      },

      {
        path: 'edit/:id',
        component: ClientEdit
      },

      {
        path: ':id',
        component: ClientDetail
      }

    ]
  },


  // =========================
  // Property Layout
  // =========================

  {
    path: 'properties',
    component: Property,

    children: [

      {
        path: '',
        component: PropertyList
      },

      {
        path: 'add',
        component: PropertiesAdd
      },

      {
        path: 'edit/:id',
        component: PropertyEdit
      },

      {
        path: 'details/:id',
        component: PropertyDetail
      }

    ]
  }


];