import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import {
  Property,
  RealEstate,
  PropertyQueryParams
} from '../property';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import { PropertiesRoutingModule }
from '../properties-routing-module';


@Component({

  selector:
    'app-property-list',

  standalone:
    true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterModule,

    PropertiesRoutingModule

  ],

  templateUrl:
    './property-list.html',

  styleUrls:
    ['./property-list.scss']

})


export class PropertyList
implements OnInit {

showFilters = false;
  properties:
    RealEstate[] = [];


  userRole:
    string | null = null;


  currentPage:
    number = 1;


  pageSize:
    number = 10;


  totalItems:
    number = 0;


  totalPages:
    number = 1;


  filterForm =
    new FormGroup({

      q:
        new FormControl(''),

      title:
        new FormControl(''),

      address:
        new FormControl(''),

      area:
        new FormControl(''),

      subArea:
        new FormControl(''),

      possessionStatus:
        new FormControl(''),

      minCommission:
        new FormControl(''),

      maxCommission:
        new FormControl(''),

      minPrice:
        new FormControl(''),

      maxPrice:
        new FormControl(''),

      minCarpetSize:
        new FormControl(''),

      maxCarpetSize:
        new FormControl(''),

      minSuperBuiltUpArea:
        new FormControl(''),

      maxSuperBuiltUpArea:
        new FormControl(''),

      floor:
        new FormControl(''),

      masterBedroom:
        new FormControl(''),

      modularKitchen:
        new FormControl(''),

      amenities:
        new FormControl(''),

      builderPromises:
        new FormControl(''),

      communityRestrictions:
        new FormControl(''),

      connectivityNotes:
        new FormControl(''),

      minAirportDistance:
        new FormControl(''),

      maxAirportDistance:
        new FormControl(''),

      minRailwayDistance:
        new FormControl(''),

      maxRailwayDistance:
        new FormControl(''),

      minMetroDistance:
        new FormControl(''),

      maxMetroDistance:
        new FormControl(''),

      minBusStopDistance:
        new FormControl(''),

      maxBusStopDistance:
        new FormControl(''),

      minParkDistance:
        new FormControl(''),

      maxParkDistance:
        new FormControl(''),

      minStadiumDistance:
        new FormControl(''),

      maxStadiumDistance:
        new FormControl('')

    });


  constructor(

    private router:
      Router,

    private propertyService:
      Property,

    private cdr:
      ChangeDetectorRef

  ) {}


  ngOnInit() {


    const rawUser =
      localStorage.getItem('user');


    if (rawUser) {

      const user =
        JSON.parse(rawUser);

      this.userRole =
        user.role;

    }


    this.loadProperties();


    /*
    Auto filter while typing/changing
    */

    this.filterForm.valueChanges
      .subscribe(() => {

        this.currentPage =
          1;

        this.loadProperties();

      });

  }


  loadProperties() {


    const f =
      this.filterForm.value;


    const params:
      PropertyQueryParams = {


      page:
        this.currentPage,


      limit:
        this.pageSize,


      q:
        f.q || undefined,


      title:
        f.title || undefined,


      address:
        f.address || undefined,


      area:
        f.area || undefined,


      subArea:
        f.subArea || undefined,


      possessionStatus:
        f.possessionStatus || undefined,


      amenities:
        f.amenities || undefined,


      builderPromises:
        f.builderPromises || undefined,


      communityRestrictions:
        f.communityRestrictions || undefined,


      connectivityNotes:
        f.connectivityNotes || undefined

    };


    this.addRangeFilter(

      params,

      'commissionPercentage',

      f.minCommission,

      f.maxCommission

    );


    this.addRangeFilter(

      params,

      'variants.price',

      f.minPrice,

      f.maxPrice

    );


    this.addRangeFilter(

      params,

      'variants.carpetSize',

      f.minCarpetSize,

      f.maxCarpetSize

    );


    this.addRangeFilter(

      params,

      'variants.superBuiltUpArea',

      f.minSuperBuiltUpArea,

      f.maxSuperBuiltUpArea

    );


    this.addRangeFilter(

      params,

      'airportDistanceKm',

      f.minAirportDistance,

      f.maxAirportDistance

    );


    this.addRangeFilter(

      params,

      'railwayStationDistanceKm',

      f.minRailwayDistance,

      f.maxRailwayDistance

    );


    this.addRangeFilter(

      params,

      'metroDistanceKm',

      f.minMetroDistance,

      f.maxMetroDistance

    );


    this.addRangeFilter(

      params,

      'busStopDistanceKm',

      f.minBusStopDistance,

      f.maxBusStopDistance

    );


    this.addRangeFilter(

      params,

      'parkDistanceKm',

      f.minParkDistance,

      f.maxParkDistance

    );


    this.addRangeFilter(

      params,

      'stadiumDistanceKm',

      f.minStadiumDistance,

      f.maxStadiumDistance

    );


    if (f.floor) {

      params['variants.floor'] =
        f.floor;

    }


    if (
      f.masterBedroom !== ''
    ) {

      params['variants.masterBedroom'] =
        f.masterBedroom;

    }


    if (
      f.modularKitchen !== ''
    ) {

      params['variants.modularKitchen'] =
        f.modularKitchen;

    }


    this.propertyService
      .getProperties(params)
      .subscribe({

        next: (res) => {


          this.properties =
            res.data;


          this.totalItems =
            res.total;


          this.totalPages =
            Math.ceil(

              res.total /
              this.pageSize

            ) || 1;


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(err);

          alert(

            err.error?.message ||

            'Failed to load properties'

          );

        }

      });

  }


  private addRangeFilter(

    params:
      PropertyQueryParams,

    field:
      string,

    min:
      any,

    max:
      any

  ) {


    if (

      min !== null &&

      min !== undefined &&

      min !== ''

    ) {

      params[`${field}[min]`] =
        min;

    }


    if (

      max !== null &&

      max !== undefined &&

      max !== ''

    ) {

      params[`${field}[max]`] =
        max;

    }

  }


  clearFilters() {


    this.filterForm.reset({

      q: '',

      title: '',

      address: '',

      area: '',

      subArea: '',

      possessionStatus: '',

      minCommission: '',

      maxCommission: '',

      minPrice: '',

      maxPrice: '',

      minCarpetSize: '',

      maxCarpetSize: '',

      minSuperBuiltUpArea: '',

      maxSuperBuiltUpArea: '',

      floor: '',

      masterBedroom: '',

      modularKitchen: '',

      amenities: '',

      builderPromises: '',

      communityRestrictions: '',

      connectivityNotes: '',

      minAirportDistance: '',

      maxAirportDistance: '',

      minRailwayDistance: '',

      maxRailwayDistance: '',

      minMetroDistance: '',

      maxMetroDistance: '',

      minBusStopDistance: '',

      maxBusStopDistance: '',

      minParkDistance: '',

      maxParkDistance: '',

      minStadiumDistance: '',

      maxStadiumDistance: ''

    });


    this.currentPage =
      1;

  }


  goToPage(
    page: number
  ) {


    if (

      page < 1 ||

      page > this.totalPages

    ) {

      return;

    }


    this.currentPage =
      page;


    this.loadProperties();

  }


  editProperty(
    id: string
  ) {

    this.router.navigate([

      '/edit-property',

      id

    ]);

  }


  deleteProperty(
    id: string
  ) {


    if (

      !confirm(

        'Are you sure you want to delete this property?'

      )

    ) {

      return;

    }


    this.propertyService
      .deleteProperty(id)
      .subscribe({

        next: () => {


          this.properties =
            this.properties.filter(

              p => p._id !== id

            );


          this.totalItems--;

        },


        error: (err) => {

          console.error(err);

          alert(

            err.error?.message ||

            'Delete failed'

          );

        }

      });

  }

}