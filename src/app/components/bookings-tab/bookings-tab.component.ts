import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { BookingResponseDto } from '../../models/booking.model';

@Component({
  selector: 'app-bookings-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings-tab.component.html',
  styleUrls: ['./bookings-tab.component.css']
})
export class BookingsTabComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  loading = false;
  selectedStatus: string = '';
  selectedDate: string = '';

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    const date = this.selectedDate ? new Date(this.selectedDate) : undefined;
    
    this.bookingService.getBookings(date, this.selectedStatus || undefined).subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.loadBookings();
  }

  getStatusClass(status: string): string {
    return `status-badge status-${status.replace('_', '-')}`;
  }

  startProcessing(booking: BookingResponseDto) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('User not authenticated');
      return;
    }

    this.bookingService.startProcessing(booking.id, user.id).subscribe({
      next: () => {
        this.loadBookings();
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to start processing');
      }
    });
  }

  completeBooking(booking: BookingResponseDto) {
    this.bookingService.completeBooking(booking.id).subscribe({
      next: () => {
        this.loadBookings();
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to complete booking');
      }
    });
  }

  cancelBooking(booking: BookingResponseDto) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('User not authenticated');
      return;
    }

    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(booking.id, user.id).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (err) => {
          alert(err.error?.error || 'Failed to cancel booking');
        }
      });
    }
  }
}

