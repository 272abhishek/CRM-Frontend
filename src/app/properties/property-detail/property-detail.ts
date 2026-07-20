import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RealEstate, Property } from '../property';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.scss']
})
export class PropertyDetail implements OnInit {
  property?: RealEstate;

  constructor(
    private route: ActivatedRoute,
    private propertyService: Property
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyService.getPropertyById(id).subscribe({
        next: (res) => this.property = res,
        error: (err) => alert(err.error?.message || 'Failed to load property')
      });
    }
  }
}
