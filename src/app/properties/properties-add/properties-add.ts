import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Property } from '../property';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PropertiesRoutingModule } from '../properties-routing-module';

@Component({
  selector: 'app-properties-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PropertiesRoutingModule],
  templateUrl: './properties-add.html',
  styleUrls: ['./properties-add.scss']
})
export class PropertiesAdd {
  propertyForm: FormGroup;

  constructor(private fb: FormBuilder, private propertyService: Property,private router: Router) {
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

  onSubmit() {
    if (this.propertyForm.invalid || this.variants.length === 0) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const user = this.getUser();
    if (!user) {
      alert('Session expired, please login again.');
      return;
    }

    const payload = {
      ...this.propertyForm.value,
      
    };

    this.propertyService.createProperty(payload).subscribe({
      next: (res) => {alert('Property created successfully!')
        this.router.navigate(['/property-list']);
      },
      error: (err) => alert(err.error?.message || 'Failed to create property')
    });
  }
}