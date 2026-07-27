import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Chart,
  ChartConfiguration,
  registerables
} from 'chart.js';

import {
  Property,
  RealEstate,
  PropertyResponse
} from '../property';

import {
  Subscription
} from 'rxjs';


// Register Chart.js components
Chart.register(...registerables);


@Component({

  selector:
    'app-visual-property-display',

  standalone:
    true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './visual-property-display.html',

  styleUrl:
    './visual-property-display.scss'

})


export class VisualPropertyDisplay
  implements AfterViewInit, OnDestroy {


  // =====================================================
  // DATA
  // =====================================================

  properties:
    RealEstate[] = [];


  loading:
    boolean = false;


  error:
    string = '';


  // =====================================================
  // KPI DATA
  // =====================================================

  totalVariants:
    number = 0;


  averagePrice:
    number = 0;


  averageCommission:
    number = 0;


  // =====================================================
  // CHART INSTANCES
  // =====================================================

  areaChart?: Chart;

  possessionChart?: Chart;

  priceChart?: Chart;

  variantChart?: Chart;

  commissionChart?: Chart;

  amenitiesChart?: Chart;

  connectivityChart?: Chart;


  private subscription?:
    Subscription;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private propertyService:
      Property

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngAfterViewInit():

    void {

    this.loadPropertyData();

  }


  // =====================================================
  // LOAD PROPERTY DATA
  // =====================================================

  loadPropertyData():

    void {


    this.loading =
      true;


    this.error =
      '';


    this.subscription =
      this.propertyService

        .getProperties({

          page:
            1,

          limit:
            1000

        })

        .subscribe({

          next:
            (response:
              PropertyResponse) => {


              this.properties =
                response.data || [];


              this.calculateAnalytics();


              this.loading =
                false;


              setTimeout(() => {

                this.createCharts();

              }, 100);

            },


          error:
            (err) => {


              console.error(

                'Property analytics error:',

                err

              );


              this.error =
                'Unable to load property analytics data.';


              this.loading =
                false;

            }

        });

  }


  // =====================================================
  // CALCULATE ANALYTICS
  // =====================================================

  private calculateAnalytics():

    void {


    // TOTAL VARIANTS

    this.totalVariants =
      this.properties.reduce(

        (total, property) =>

          total +

          (property.variants?.length || 0),

        0

      );


    // ALL PRICES

    const prices:
      number[] = [];


    this.properties.forEach(

      property => {


        property.variants?.forEach(

          variant => {


            if (

              variant.price !== null &&

              variant.price !== undefined

            ) {

              prices.push(

                Number(

                  variant.price

                )

              );

            }

          }

        );

      }

    );


    // AVERAGE PRICE

    this.averagePrice =

      prices.length > 0

        ? prices.reduce(

            (sum, price) =>

              sum + price,

            0

          ) / prices.length

        : 0;


    // AVERAGE COMMISSION

    const commissions =
      this.properties

        .map(

          property =>

            Number(

              property.commissionPercentage

            ) || 0

        )

        .filter(

          commission =>

            commission > 0

        );


    this.averageCommission =

      commissions.length > 0

        ? commissions.reduce(

            (sum, commission) =>

              sum + commission,

            0

          ) / commissions.length

        : 0;

  }


  // =====================================================
  // CREATE ALL CHARTS
  // =====================================================

  private createCharts():

    void {


    this.destroyCharts();


    this.createAreaChart();


    this.createPossessionChart();


    this.createPriceChart();


    this.createVariantChart();


    this.createCommissionChart();


    this.createAmenitiesChart();


    this.createConnectivityChart();

  }


  // =====================================================
  // AREA CHART
  // =====================================================

  private createAreaChart():

    void {


    const canvas =
      document.getElementById(

        'areaChart'

      ) as HTMLCanvasElement;


    if (!canvas) return;


    const areaMap:
      Record<string, number> = {};


    this.properties.forEach(

      property => {


        const area =
          property.area ||

          'Unknown';


        areaMap[area] =
          (areaMap[area] || 0) + 1;

      }

    );


    this.areaChart =

      new Chart(

        canvas,

        {

          type:
            'bar',

          data: {

            labels:
              Object.keys(areaMap),

            datasets: [

              {

                label:
                  'Properties',

                data:
                  Object.values(areaMap),

                borderRadius:
                  8,

                borderWidth:
                  0

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              }

            },

            scales: {

              y: {

                beginAtZero:
                  true,

                ticks: {

                  precision:
                    0

                }

              }

            }

          }

        }

      );

  }


  // =====================================================
  // POSSESSION CHART
  // =====================================================

  private createPossessionChart():

    void {


    const canvas =
      document.getElementById(

        'possessionChart'

      ) as HTMLCanvasElement;


    if (!canvas) return;


    const possessionMap:
      Record<string, number> = {};


    this.properties.forEach(

      property => {


        const status =
          property.possessionStatus ||

          'Unknown';


        possessionMap[status] =

          (possessionMap[status] || 0) +

          1;

      }

    );


    this.possessionChart =

      new Chart(

        canvas,

        {

          type:
            'doughnut',

          data: {

            labels:
              Object.keys(possessionMap),

            datasets: [

              {

                data:
                  Object.values(possessionMap),

                borderWidth:
                  3

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            cutout:
              '65%',

            plugins: {

              legend: {

                position:
                  'bottom'

              }

            }

          }

        }

      );

  }


  // =====================================================
  // PRICE CHART
  // =====================================================

  private createPriceChart():

    void {


    const canvas =
      document.getElementById(

        'priceChart'

      ) as HTMLCanvasElement;


    if (!canvas) return;


    const labels:
      string[] = [];


    const prices:
      number[] = [];


    this.properties.forEach(

      property => {


        property.variants?.forEach(

          variant => {


            labels.push(

              property.title

            );


            prices.push(

              Number(

                variant.price

              ) || 0

            );

          }

        );

      }

    );


    this.priceChart =

      new Chart(

        canvas,

        {

          type:
            'line',

          data: {

            labels,

            datasets: [

              {

                label:
                  'Price',

                data:
                  prices,

                tension:
                  0.4,

                fill:
                  true,

                pointRadius:
                  4

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              tooltip: {

                callbacks: {

                  label:
                    (context) =>

                      `₹${Number(

                        context.raw

                      ).toLocaleString(

                        'en-IN'

                      )}`

                }

              }

            },

            scales: {

              y: {

                ticks: {

                  callback:
                    (value) =>

                      `₹${Number(

                        value

                      ).toLocaleString(

                        'en-IN'

                      )}`

                }

              }

            }

          }

        }

      );

  }


  // =====================================================
  // VARIANT CHART
  // =====================================================

  private createVariantChart():

    void {


    const canvas =
      document.getElementById(

        'variantChart'

      ) as HTMLCanvasElement;


    if (!canvas) return;


    const labels =
      this.properties.map(

        property =>

          property.title

      );


    const data =
      this.properties.map(

        property =>

          property.variants?.length || 0

      );


    this.variantChart =

      new Chart(

        canvas,

        {

          type:
            'bar',

          data: {

            labels,

            datasets: [

              {

                label:
                  'Variants',

                data,

                borderRadius:
                  8

              }

            ]

          },

          options: {

            indexAxis:
              'y',

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              }

            }

          }

        }

      );

  }


  // =====================================================
  // COMMISSION CHART
  // =====================================================

  private createCommissionChart():

    void {


    const canvas =
      document.getElementById(

        'commissionChart'

      ) as HTMLCanvasElement;


    if (!canvas) return;


    const labels =
      this.properties.map(

        property =>

          property.title

      );


    const data =
      this.properties.map(

        property =>

          property.commissionPercentage || 0

      );


    this.commissionChart =

      new Chart(

        canvas,

        {

          type:
            'bar',

          data: {

            labels,

            datasets: [

              {

                label:
                  'Commission %',

                data,

                borderRadius:
                  8

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              }

            },

            scales: {

              y: {

                beginAtZero:
                  true,

                ticks: {

                  callback:
                    value =>

                      `${value}%`

                }

              }

            }

          }

        }

      );

  }


  // =====================================================
  // AMENITIES CHART
  // =====================================================

  private createAmenitiesChart():

    void {


    const canvas =
      document.getElementById(

        'amenitiesChart'

      ) as HTMLCanvasElement;


    if (!canvas) return;


    const amenitiesMap:
      Record<string, number> = {};


    this.properties.forEach(

      property => {


        property.amenities?.forEach(

          amenity => {


            amenitiesMap[amenity] =

              (amenitiesMap[amenity] || 0) +

              1;

          }

        );

      }

    );


    const sortedAmenities =

      Object.entries(

        amenitiesMap

      )

        .sort(

          (a, b) =>

            b[1] - a[1]

        )

        .slice(

          0,

          10

        );


    this.amenitiesChart =

      new Chart(

        canvas,

        {

          type:
            'bar',

          data: {

            labels:
              sortedAmenities.map(

                item =>

                  item[0]

              ),

            datasets: [

              {

                label:
                  'Properties',

                data:
                  sortedAmenities.map(

                    item =>

                      item[1]

                  ),

                borderRadius:
                  8

              }

            ]

          },

          options: {

            indexAxis:
              'y',

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              }

            }

          }

        }

      );

  }


  // =====================================================
  // CONNECTIVITY CHART
  // =====================================================

  private createConnectivityChart():

    void {


    const canvas =
      document.getElementById(

        'connectivityChart'

      ) as HTMLCanvasElement;


    if (!canvas) return;


    const values = {

      Airport:
        this.getAverage(

          'airportDistanceKm'

        ),

      Railway:
        this.getAverage(

          'railwayStationDistanceKm'

        ),

      Metro:
        this.getAverage(

          'metroDistanceKm'

        ),

      Bus:
        this.getAverage(

          'busStopDistanceKm'

        ),

      Park:
        this.getAverage(

          'parkDistanceKm'

        ),

      Stadium:
        this.getAverage(

          'stadiumDistanceKm'

        )

    };


    this.connectivityChart =

      new Chart(

        canvas,

        {

          type:
            'radar',

          data: {

            labels:
              Object.keys(values),

            datasets: [

              {

                label:
                  'Average Distance (km)',

                data:
                  Object.values(values),

                fill:
                  true

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            scales: {

              r: {

                beginAtZero:
                  true

              }

            }

          }

        }

      );

  }


  // =====================================================
  // AVERAGE HELPER
  // =====================================================

  private getAverage(

    field:
      keyof RealEstate

  ):


    number {


    const values =

      this.properties

        .map(

          property =>

            Number(

              property[field]

            ) || 0

        )

        .filter(

          value =>

            value > 0

        );


    return values.length

      ? values.reduce(

          (sum, value) =>

            sum + value,

          0

        ) / values.length

      : 0;

  }


  // =====================================================
  // POSSESSION CSS CLASS
  // =====================================================

  getPossessionClass(

    status:
      string

  ):


    string {


    if (!status) {

      return 'unknown';

    }


    const value =
      status.toLowerCase();


    if (

      value.includes(

        'ready'

      )

    ) {

      return 'ready';

    }


    if (

      value.includes(

        'under'

      ) ||

      value.includes(

        'construction'

      )

    ) {

      return 'construction';

    }


    if (

      value.includes(

        'future'

      ) ||

      value.includes(

        'upcoming'

      )

    ) {

      return 'upcoming';

    }


    return 'unknown';

  }


  // =====================================================
  // DESTROY CHARTS
  // =====================================================

  private destroyCharts():

    void {


    this.areaChart?.destroy();

    this.possessionChart?.destroy();

    this.priceChart?.destroy();

    this.variantChart?.destroy();

    this.commissionChart?.destroy();

    this.amenitiesChart?.destroy();

    this.connectivityChart?.destroy();

  }


  // =====================================================
  // DESTROY COMPONENT
  // =====================================================

  ngOnDestroy():

    void {


    this.destroyCharts();


    this.subscription?.unsubscribe();

  }

}