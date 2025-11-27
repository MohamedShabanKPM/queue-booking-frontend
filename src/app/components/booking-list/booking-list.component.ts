import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { BookingResponseDto } from '../../models/booking.model';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  loading = false;
  selectedStatus: string = '';

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getBookings(undefined, this.selectedStatus || undefined).subscribe({
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

  onStatusChange() {
    this.loadBookings();
  }

  getStatusClass(status: string): string {
    return `status-badge status-${status.replace('_', '-')}`;
  }
}

