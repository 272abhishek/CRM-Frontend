import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup} from './auth/signup/signup';
import { Profile } from './profiles/profile/profile';
import { PropertyDetail } from './properties/property-detail/property-detail';
import { PropertyList } from './properties/property-list/property-list';
import { PropertiesAdd } from './properties/properties-add/properties-add';
import { PropertyEdit } from './properties/property-edit/property-edit';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Signup},
  { path: 'profile', component: Profile},
  { path: 'property-list', component: PropertyList },
  { path: 'propertydetails/:id', component: PropertyDetail },
  { path: 'add', component: PropertiesAdd },
   // 👇 New Route
  { path: 'edit-property/:id', component: PropertyEdit }
];
