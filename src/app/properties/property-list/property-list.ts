import { Component, OnInit } from '@angular/core';
import { Property, RealEstate } from '../property';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropertiesRoutingModule } from '../properties-routing-module';

@Component({
  selector: 'app-property-list',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,RouterModule,       // ✅ for routerLink
    PropertiesRoutingModule],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.scss']
})
export class PropertyList implements OnInit {
  properties: RealEstate[] = [];

  constructor(private propertyService: Property) {}

  ngOnInit() {
    this.propertyService.getProperties().subscribe({
      next: (res) => this.properties = res,
      error: (err) => alert(err.error?.message || 'Failed to load properties')
    });
  }
}
