// src/app/property-visits/property-visit-add/property-visit-add.ts

import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

import {
  PropertyVisitService
} from '../property-visit';

import {
  PropertyVisit,
  VisitClient,
  VisitProperty,
  VisitStatus
} from '../propertyInterface';


// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector:
    'app-property-visit-add',

  standalone:
    true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterModule

  ],

  templateUrl:
    './property-visit-add.html',

  styleUrls: [

    './property-visit-add.scss'

  ]

})


// =====================================================
// CLASS
// =====================================================

export class PropertyVisitAdd
implements OnInit {


  // =====================================================
  // CLIENT SEARCH
  // =====================================================

  clientSearch =
    new FormControl<string>('');

  clients:
    VisitClient[] = [];

  selectedClient:
    VisitClient | null =
    null;

  searchingClient =
    false;


  // =====================================================
  // PROPERTIES
  // =====================================================

  properties:
    VisitProperty[] = [];

  selectedProperty:
    VisitProperty | null =
    null;


  // =====================================================
  // PROPERTY FILTER FORM
  // =====================================================

  filterForm =
    new FormGroup({

      q:
        new FormControl<string>(''),

      title:
        new FormControl<string>(''),

      address:
        new FormControl<string>(''),

      area:
        new FormControl<string>(''),

      subArea:
        new FormControl<string>(''),

      possessionStatus:
        new FormControl<string>(''),

      minPrice:
        new FormControl<string>(''),

      maxPrice:
        new FormControl<string>(''),

      minCarpetSize:
        new FormControl<string>(''),

      maxCarpetSize:
        new FormControl<string>(''),

      minSuperBuiltUpArea:
        new FormControl<string>(''),

      maxSuperBuiltUpArea:
        new FormControl<string>(''),

      floor:
        new FormControl<string>(''),

      masterBedroom:
        new FormControl<string>(''),

      modularKitchen:
        new FormControl<string>('')

    });


  // =====================================================
  // VISIT FORM
  // =====================================================

  visitForm =
    new FormGroup({

      visitDate:
        new FormControl<string>(

          '',

          {

            nonNullable:
              true,

            validators: [

              Validators.required

            ]

          }

        ),

      status:
        new FormControl<VisitStatus>(

          'Planned',

          {

            nonNullable:
              true,

            validators: [

              Validators.required

            ]

          }

        ),

      notes:
        new FormControl<string>('', {

          nonNullable:
            true

        })

    });


  // =====================================================
  // LOADING
  // =====================================================

  loading =
    false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private visitService:
      PropertyVisitService,

    private router:
      Router

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {


    // ===================================================
    // CLIENT SEARCH
    // ===================================================

    this.clientSearch.valueChanges

      .pipe(

        debounceTime(400),

        distinctUntilChanged()

      )

      .subscribe(

        value => {

          const query =
            (value || '').trim();


          if (

            query.length >= 2

          ) {

            this.searchClients(query);

          }

          else {

            this.clients =
              [];

          }

        }

      );


    // ===================================================
    // PROPERTY FILTER
    // ===================================================

    this.filterForm.valueChanges

      .pipe(

        debounceTime(500)

      )

      .subscribe(

        () => {

          if (

            this.selectedClient

          ) {

            this.loadProperties();

          }

        }

      );

  }


  // =====================================================
  // SEARCH CLIENTS
  // =====================================================

  searchClients(

    query:
      string

  ): void {


    this.searchingClient =
      true;


    this.visitService

      .searchClients(query)

      .subscribe({

        next:
          response => {

            this.clients =
              response.data || [];

            this.searchingClient =
              false;

          },


        error:
          error => {

            console.error(

              'Client search error:',

              error

            );


            this.clients =
              [];

            this.searchingClient =
              false;

          }

      });

  }


  // =====================================================
  // SELECT CLIENT
  // =====================================================

  selectClient(

    client:
      VisitClient

  ): void {


    this.selectedClient =
      client;


    this.clientSearch.setValue(

      client.name || '',

      {

        emitEvent:
          false

      }

    );


    this.clients =
      [];


    this.applyClientDemand();

  }


  // =====================================================
  // REMOVE CLIENT
  // =====================================================

  removeClient(): void {


    this.selectedClient =
      null;


    this.clientSearch.setValue(

      '',

      {

        emitEvent:
          false

      }

    );


    this.properties =
      [];


    this.selectedProperty =
      null;


    this.filterForm.reset();

  }


  // =====================================================
  // APPLY CLIENT DEMAND
  // =====================================================

  applyClientDemand(): void {


    if (

      !this.selectedClient

    ) {

      return;

    }


    const client =
      this.selectedClient;


    this.filterForm.patchValue({

      q:
        client.requirement || '',

      area:
        client.preferredLocation || ''

    });


    this.loadProperties();

  }


  // =====================================================
  // LOAD PROPERTIES
  // =====================================================

  loadProperties(): void {


    if (

      !this.selectedClient

    ) {

      return;

    }


    const filters =
      this.filterForm.getRawValue();


    this.visitService

      .filterProperties(filters)

      .subscribe({

        next:
          response => {

            this.properties =
              response.data || [];


            this.selectedProperty =
              null;

          },


        error:
          error => {

            console.error(

              'Property filter error:',

              error

            );


            this.properties =
              [];


            this.selectedProperty =
              null;

          }

      });

  }


  // =====================================================
  // SELECT PROPERTY
  // =====================================================

  selectProperty(

    property:
      VisitProperty

  ): void {


    this.selectedProperty =
      property;

  }


  // =====================================================
  // CREATE VISIT
  // =====================================================

  submit(): void {


    // ===================================================
    // CLIENT VALIDATION
    // ===================================================

    if (

      !this.selectedClient

    ) {

      alert(

        'Please select a client'

      );

      return;

    }


    // ===================================================
    // PROPERTY VALIDATION
    // ===================================================

    if (

      !this.selectedProperty

    ) {

      alert(

        'Please select a property'

      );

      return;

    }


    // ===================================================
    // FORM VALIDATION
    // ===================================================

    if (

      this.visitForm.invalid

    ) {


      this.visitForm.markAllAsTouched();


      alert(

        'Please select visit date'

      );


      return;

    }


    // ===================================================
    // IDS
    // ===================================================

    const clientId =
      this.selectedClient._id;


    const propertyId =
      this.selectedProperty._id;


    if (

      !clientId ||

      !propertyId

    ) {

      alert(

        'Client or property ID missing'

      );


      return;

    }


    // ===================================================
    // FORM VALUE
    // ===================================================

    const formValue =
      this.visitForm.getRawValue();


    // ===================================================
    // PAYLOAD
    // ===================================================

    const payload: Partial<PropertyVisit> = {


      clientId:


        clientId,


      propertyId:


        propertyId,


      visitDate:


        formValue.visitDate,


      status:


        formValue.status,


      notes:


        formValue.notes || ''

    };


    console.log(

      'CREATE VISIT PAYLOAD:',

      payload

    );


    // ===================================================
    // LOADING
    // ===================================================

    this.loading =
      true;


    // ===================================================
    // API CALL
    // ===================================================

    this.visitService

      .createVisit(payload)

      .subscribe({

        next:
          response => {


            console.log(

              'Property Visit Created:',

              response

            );


            alert(

              'Property visit created successfully'

            );


            this.loading =
              false;


            this.router.navigate([

              '/property-visits'

            ]);

          },


        error:
          error => {


            console.error(

              'Create Visit Error:',

              error

            );


            this.loading =
              false;


            alert(

              error.error?.message ||

              'Failed to create property visit'

            );

          }

      });

  }

}