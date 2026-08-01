import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [

  // =====================================================
  // DEFAULT
  // =====================================================

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

{
  path: 'home',

  loadComponent: () =>
    import('./layout/home/home')
      .then(m => m.Home)

},
  // =====================================================
  // AUTH
  // =====================================================

  {
    path: 'login',

    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.Login)

  },

  {
    path: 'register',

    loadComponent: () =>
      import('./auth/signup/signup')
        .then(m => m.Signup)

  },


  // =====================================================
  // PROFILE
  // =====================================================

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profiles/profile/profile')
        .then(m => m.Profile)

  },


  // =====================================================
  // PROPERTY VISITS
  // =====================================================

  {
    path: 'property-visits',
canActivate: [authGuard],
loadComponent: () =>
      import('./layout/deals/deals')
        .then(m => m.Deals),
    children: [

      {
        path: '',

        loadComponent: () =>
          import(
            './property-visits/property-visit-list/property-visit-list'
          )
            .then(m => m.PropertyVisitList)

      },

      {
        path: 'add',

        loadComponent: () =>
          import(
            './property-visits/property-visit-add/property-visit-add'
          )
            .then(m => m.PropertyVisitAdd)

      },

      {
        path: 'edit/:id',

        loadComponent: () =>
          import(
            './property-visits/property-visit-edit/property-visit-edit'
          )
            .then(m => m.PropertyVisitEdit)

      },

      {
        path: 'analytics',

        loadComponent: () =>
          import(
            './property-visits/visual-property-visit-display/visual-property-visit-display'
          )
            .then(m => m.VisualPropertyVisitDisplay)

      },

      {
        path: ':id',

        loadComponent: () =>
          import(
            './property-visits/property-visit-detail/property-visit-detail'
          )
            .then(m => m.PropertyVisitDetail)

      }

    ]

  },


  // =====================================================
  // CLIENTS
  // =====================================================

  {
    path: 'clients',
canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/client/client')
        .then(m => m.Client),

    children: [

      {
        path: '',

        loadComponent: () =>
          import('./clients/client-list/client-list')
            .then(m => m.ClientList)

      },

      {
        path: 'add',

        loadComponent: () =>
          import('./clients/client-add/client-add')
            .then(m => m.ClientAdd)

      },

      {
        path: 'edit/:id',

        loadComponent: () =>
          import('./clients/client-edit/client-edit')
            .then(m => m.ClientEdit)

      },

      {
        path: 'analytics',

        loadComponent: () =>
          import(
            './clients/visual-client-display/visual-client-display'
          )
            .then(m => m.VisualClientDisplay)

      },

      {
        path: ':id',

        loadComponent: () =>
          import('./clients/client-detail/client-detail')
            .then(m => m.ClientDetail)

      }

    ]

  },


  // =====================================================
  // PROPERTIES
  // =====================================================

  {
    path: 'properties',
canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/property/property')
        .then(m => m.Property),

    children: [

      {
        path: '',

        loadComponent: () =>
          import('./properties/property-list/property-list')
            .then(m => m.PropertyList)

      },

      {
        path: 'add',

        loadComponent: () =>
          import('./properties/properties-add/properties-add')
            .then(m => m.PropertiesAdd)

      },

      {
        path: 'edit/:id',

        loadComponent: () =>
          import('./properties/property-edit/property-edit')
            .then(m => m.PropertyEdit)

      },

      {
        path: 'analytics',

        loadComponent: () =>
          import(
            './properties/visual-property-display/visual-property-display'
          )
            .then(m => m.VisualPropertyDisplay)

      },

      {
        path: 'details/:id',

        loadComponent: () =>
          import('./properties/property-detail/property-detail')
            .then(m => m.PropertyDetail)

      }

    ]

  },


  // =====================================================
  // DEALS
  // =====================================================

  {
    path: 'deals',
canActivate: [authGuard],
loadComponent: () =>
          import('./layout/deals/deals')
            .then(m => m.Deals),
    children: [

      {
        path: '',

        loadComponent: () =>
          import('./deals/deal-list/deal-list')
            .then(m => m.DealList)

      },

      {
        path: 'edit/:id',

        loadComponent: () =>
          import('./deals/deal-edit/deal-edit')
            .then(m => m.DealEdit)

      },

      {
        path: 'analytics',

        loadComponent: () =>
          import(
            './deals/visual-deal-display/visual-deal-display'
          )
            .then(m => m.VisualDealDisplay)

      },

      {
        path: ':id',

        loadComponent: () =>
          import('./deals/deal-detail/deal-detail')
            .then(m => m.DealDetail)

      }

    ]

  },


  // =====================================================
  // TASKS
  // =====================================================

  {
    path: 'tasks',
canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/task/task')
        .then(m => m.Task),

    children: [

      {
        path: '',

        loadComponent: () =>
          import('./tasks/task-list/task-list')
            .then(m => m.TaskList)

      },

      {
        path: 'calendar',

        loadComponent: () =>
          import('./tasks/task-calendar/task-calendar')
            .then(m => m.TaskCalendar)

      },

      {
        path: 'add',

        loadComponent: () =>
          import('./tasks/task-add/task-add')
            .then(m => m.TaskAdd)

      },

      {
        path: 'analytics',

        loadComponent: () =>
          import(
            './tasks/visual-task-display/visual-task-display'
          )
            .then(m => m.VisualTaskDisplay)

      }

    ]

  },


  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: '**',

    redirectTo: 'login'

  }

];