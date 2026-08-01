import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, ClientInterface } from '../client';
import { NotificationServices } from '../../core/notification/notification-services';
@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-edit.html',
  styleUrls: ['./client-edit.scss']
})
export class ClientEdit implements OnInit {
  id!: string;
  form: FormGroup;
  existingNotes: { note: string; createdAt?: string }[] = []; // display ke liye

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clientService: Client,
    private router: Router,
      private notification: NotificationServices
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      budget: [null],
      requirement: [''],
      interestedProject: [''],
      preferredLocation: [''],
      timeline: [''],
      followUpNotes: [''],   // sirf naya note likhne ke liye — khaali rehna chahiye
      leadSource: [''],
      priority: ['Medium', Validators.required],
      communicationPreference: ['Call', Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.clientService.getClientById(this.id).subscribe({
      next: (client: ClientInterface) => {
        this.existingNotes = client.followUpNotes || []; // purane notes sirf display ke liye
        this.form.patchValue({
          name: client.name,
          phone: client.phone,
          email: client.email,
          budget: client.budget,
          requirement: client.requirement,
          interestedProject: client.interestedProject,
          preferredLocation: client.preferredLocation,
          timeline: client.timeline,
          // followUpNotes yahan patch NAHI karna — control blank rehna chahiye
          leadSource: client.leadSource,
          priority: client.priority,
          communicationPreference: client.communicationPreference
        });
      },
      error: (err) => {
        console.error(err);
       console.error(err);

  this.notification.error(

    err?.error?.error ||

    err?.error?.message ||

    err?.message ||

    'Failed to load client'

  );
     }
    });
  }

  updateClient() {
   if (this.form.invalid) {

  this.notification.warning(
    'Please fill all required fields'
  );

  this.form.markAllAsTouched();

  return;

}

    const data = this.form.value;
    // agar naya note khali chhoda hai to key hi mat bhejo — backend ka
    // `if (updateData.followUpNotes)` check waise bhi empty string skip kar dega,
    // lekin explicit rehna behtar hai
    if (!data.followUpNotes) {
      delete data.followUpNotes;
    }

    this.clientService.updateClient(this.id, data).subscribe({
      next: (res: any) => {

  this.notification.success(

    res?.message ||

    'Client Updated Successfully'

  );

  this.router.navigate(['/clients']);

},
      error: (err) => {

  console.error('UPDATE ERROR:', err);

  this.notification.error(

    err?.error?.error ||

    err?.error?.message ||

    err?.message ||

    'Failed to update client'

  );

}
    });
  }
}