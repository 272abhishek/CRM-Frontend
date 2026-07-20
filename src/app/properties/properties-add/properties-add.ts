import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Property } from '../property';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertiesRoutingModule } from '../properties-routing-module';

@Component({
  selector: 'app-properties-add',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,RouterModule,       // ✅ for routerLink
      PropertiesRoutingModule],
  templateUrl: './properties-add.html',
  styleUrls: ['./properties-add.scss']
})
export class PropertiesAdd {
  propertyForm: FormGroup;

  constructor(private fb: FormBuilder, private propertyService: Property) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      area: ['', Validators.required],
      subArea: ['', Validators.required],
      possessionStatus: ['', Validators.required],
      commissionPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      builderPromises: this.fb.array([]),
      amenities: this.fb.array([]),
      variants: this.fb.array([])
    });
  }

  get builderPromises(): FormArray {
    return this.propertyForm.get('builderPromises') as FormArray;
  }

  get amenities(): FormArray {
    return this.propertyForm.get('amenities') as FormArray;
  }

  get variants(): FormArray {
    return this.propertyForm.get('variants') as FormArray;
  }

  addBuilderPromise() {
    this.builderPromises.push(this.fb.control(''));
  }

  addAmenity() {
    this.amenities.push(this.fb.control(''));
  }

  addVariant() {
    this.variants.push(this.fb.group({
      carpetSize: [0, Validators.required],
      superBuiltUpArea: [0, Validators.required],
      price: [0, Validators.required],
      floor: [0, Validators.required],
      masterBedroom: [false],
      modularKitchen: [false]
    }));
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      this.propertyService.createProperty(this.propertyForm.value).subscribe({
        next: (res) => alert('Property created successfully!'),
        error: (err) => alert(err.error?.message || 'Failed to create property')
      });
    }
  }
}
