import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from '../property';

@Component({
  selector: 'app-property-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './property-edit.html',
  styleUrls: ['./property-edit.scss']
})
export class PropertyEdit implements OnInit {

  id!: string;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private propertyService: Property,
    private router: Router
  ) {

    this.form = this.fb.group({

      title: ['', Validators.required],

      address: ['', Validators.required],

      area: ['', Validators.required],

      subArea: ['', Validators.required],

      possessionStatus: ['', Validators.required],

      commissionPercentage: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ],

      builderPromises: this.fb.array([]),

      amenities: this.fb.array([]),

      variants: this.fb.array([])

    });

  }


  // =========================
  // FormArray Getters
  // =========================

  get builderPromises(): FormArray {

    return this.form.get('builderPromises') as FormArray;

  }

  get amenities(): FormArray {

    return this.form.get('amenities') as FormArray;

  }

  get variants(): FormArray {

    return this.form.get('variants') as FormArray;

  }


  // =========================
  // Load Property
  // =========================

  ngOnInit() {

    this.id =
      this.route.snapshot.paramMap.get('id')!;

    this.propertyService
      .getPropertyById(this.id)
      .subscribe({

        next: (property: any) => {

          console.log('Property:', property);


          // Basic fields
          this.form.patchValue({

            title: property.title,

            address: property.address,

            area: property.area,

            subArea: property.subArea,

            possessionStatus:
              property.possessionStatus,

            commissionPercentage:
              property.commissionPercentage

          });


          // Builder Promises
          property.builderPromises?.forEach(
            (promise: string) => {

              this.builderPromises.push(
                this.fb.control(promise)
              );

            }
          );


          // Amenities
          property.amenities?.forEach(
            (amenity: string) => {

              this.amenities.push(
                this.fb.control(amenity)
              );

            }
          );


          // Variants
          property.variants?.forEach(
            (variant: any) => {

              this.variants.push(

                this.fb.group({

                  carpetSize: [
                    variant.carpetSize,
                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ],

                  superBuiltUpArea: [
                    variant.superBuiltUpArea,
                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ],

                  price: [
                    variant.price,
                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ],

                  floor: [
                    variant.floor,
                    [
                      Validators.required,
                      Validators.min(0)
                    ]
                  ],

                  masterBedroom: [
                    variant.masterBedroom || false
                  ],

                  modularKitchen: [
                    variant.modularKitchen || false
                  ]

                })

              );

            }

          );

        },

        error: (err) => {

          console.error(err);

          alert(
            err.error?.message ||
            'Failed to load property'
          );

        }

      });

  }


  // =========================
  // Add Builder Promise
  // =========================

  addBuilderPromise() {

    this.builderPromises.push(
      this.fb.control('')
    );

  }


  // =========================
  // Add Amenity
  // =========================

  addAmenity() {

    this.amenities.push(
      this.fb.control('')
    );

  }


  // =========================
  // Add Variant
  // =========================

  addVariant() {

    this.variants.push(

      this.fb.group({

        carpetSize: [
          0,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        superBuiltUpArea: [
          0,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        price: [
          0,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        floor: [
          0,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        masterBedroom: [false],

        modularKitchen: [false]

      })

    );

  }


  // =========================
  // Update Property
  // =========================

  updateProperty() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    const data = this.form.value;

    console.log('UPDATE DATA:', data);

    this.propertyService
      .updateProperty(this.id, data)
      .subscribe({

        next: () => {

          alert(
            'Property Updated Successfully'
          );

          this.router.navigate([
            '/property-list'
          ]);

        },

        error: (err) => {

          console.error(
            'UPDATE ERROR:',
            err
          );

          alert(
            err.error?.message ||
            err.error?.error ||
            'Failed to update property'
          );

        }

      });

  }

}