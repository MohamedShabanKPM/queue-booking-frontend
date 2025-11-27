import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingDto } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  booking: BookingDto = {
    name: '',
    phone: '',
    email: '',
    bookingDateSelection: 'today'
  };

  loading = false;
  error: string | null = null;
  success = false;
  bookingResponse: any = null;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    this.bookingService.createBooking(this.booking).subscribe({
      next: (response) => {
        this.bookingResponse = response;
        this.success = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'An error occurred. Please try again.';
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.booking.name || this.booking.name.length < 2) {
      this.error = 'Name must be at least 2 characters';
      return false;
    }

    if (!this.booking.phone || this.booking.phone.length < 10) {
      this.error = 'Phone must be at least 10 digits';
      return false;
    }

    return true;
  }

  resetForm() {
    this.booking = {
      name: '',
      phone: '',
      email: '',
      bookingDateSelection: 'today'
    };
    this.error = null;
    this.success = false;
    this.bookingResponse = null;
  }
}

