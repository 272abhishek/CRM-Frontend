import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RealEstate, Property } from '../property';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationServices } from '../../core/notification/notification-services';
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
    private propertyService: Property,
    private cdr:ChangeDetectorRef,
      private notification: NotificationServices
  ) {}

  ngOnInit(): void {

  const id = this.route.snapshot.paramMap.get('id');

  if (!id) {

    this.notification.error(
      'Property ID not found.'
    );

    return;

  }

  this.propertyService
    .getPropertyById(id)
    .subscribe({

      next: (res: RealEstate) => {

        this.property = res;

        console.log(
          'Property Details:',
          res
        );

        this.cdr.detectChanges();

      },

      error: (err: any) => {

        console.error(
          'PROPERTY DETAIL ERROR:',
          err
        );

        this.notification.error(

          err?.error?.message ||

          err?.error?.error ||

          'Failed to load property.'

        );

      }

    });

}
}
