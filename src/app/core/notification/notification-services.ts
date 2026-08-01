import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationServices {

  // ==========================================================
  // TOAST CONFIGURATION
  // ==========================================================

  private toast = Swal.mixin({

    toast: true,

    position: 'top-end',

    showConfirmButton: false,

    timer: 3000,

    timerProgressBar: true,

    didOpen: (toast) => {

      toast.onmouseenter = Swal.stopTimer;

      toast.onmouseleave = Swal.resumeTimer;

    }

  });

  // ==========================================================
  // SUCCESS
  // ==========================================================

  success(message: string): void {

    this.toast.fire({

      icon: 'success',

      title: message

    });

  }

  // ==========================================================
  // ERROR
  // ==========================================================

  error(message: string): void {

    this.toast.fire({

      icon: 'error',

      title: message

    });

  }

  // ==========================================================
  // WARNING
  // ==========================================================

  warning(message: string): void {

    this.toast.fire({

      icon: 'warning',

      title: message

    });

  }

  // ==========================================================
  // INFO
  // ==========================================================

  info(message: string): void {

    this.toast.fire({

      icon: 'info',

      title: message

    });

  }

  // ==========================================================
  // DELETE CONFIRMATION
  // ==========================================================

  async confirmDelete(

    title: string = 'Delete?',

    text: string = 'This action cannot be undone.'

  ): Promise<boolean> {

    const result = await Swal.fire({

      title,

      text,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#d33',

      cancelButtonColor: '#3085d6',

      confirmButtonText: 'Yes, Delete',

      cancelButtonText: 'Cancel',

      reverseButtons: true,

      focusCancel: true

    });

    return result.isConfirmed;

  }

  // ==========================================================
  // CUSTOM CONFIRMATION
  // ==========================================================

  async confirm(

    title: string,

    text: string,

    confirmText: string = 'Yes',

    cancelText: string = 'Cancel'

  ): Promise<boolean> {

    const result = await Swal.fire({

      title,

      text,

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: confirmText,

      cancelButtonText: cancelText,

      reverseButtons: true

    });

    return result.isConfirmed;

  }

}