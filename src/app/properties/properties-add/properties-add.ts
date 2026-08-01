import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Property } from '../property';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PropertiesRoutingModule } from '../properties-routing-module';
import { NotificationServices } from '../../core/notification/notification-services';
@Component({
  selector: 'app-properties-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PropertiesRoutingModule],
  templateUrl: './properties-add.html',
  styleUrls: ['./properties-add.scss']
})
export class PropertiesAdd {
  propertyForm: FormGroup;

  constructor(private fb: FormBuilder, private propertyService: Property,private router: Router,  private notification: NotificationServices) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      area: ['', Validators.required],
      subArea: ['', Validators.required],
      possessionStatus: ['', Validators.required],
      commissionPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      builderPromises: this.fb.array([]),
      amenities: this.fb.array([]),
      variants: this.fb.array([], Validators.required)
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
      carpetSize: [0, [Validators.required, Validators.min(0)]],
      superBuiltUpArea: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      floor: [0, [Validators.required, Validators.min(0)]],
      masterBedroom: [false],
      modularKitchen: [false]
    }));
  }

  /** ✅ Cookie se koi bhi value read karne ka helper */
  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  /** ✅ cookie mein pade user data se { id, role } nikaalta hai */
  private getUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);

    return {
      id: user._id || user.id,
      role: user.role
    };

  } catch {
    return null;
  }
}
onSubmit(): void {

  if (this.propertyForm.invalid || this.variants.length === 0) {

    this.propertyForm.markAllAsTouched();

    this.notification.warning(
      'Please fill all required fields.'
    );

    return;

  }

  const user = this.getUser();

  if (!user) {

    this.notification.error(
      'Session expired. Please login again.'
    );

    this.router.navigate(['/login']);

    return;

  }

  const payload = {
    ...this.propertyForm.value
  };

  this.propertyService
    .createProperty(payload)
    .subscribe({

      next: (res: any) => {

        this.notification.success(

          res?.message ||

          'Property created successfully.'

        );

        this.propertyForm.reset();

        this.builderPromises.clear();

        this.amenities.clear();

        this.variants.clear();

        this.router.navigate(['/property-list']);

      },

      error: (err: any) => {

        console.error(
          'CREATE PROPERTY ERROR:',
          err
        );

        this.notification.error(

          err?.error?.message ||

          err?.error?.error ||

          'Failed to create property.'

        );

      }

    });

}
}