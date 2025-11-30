import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { BookingResponseDto } from '../../models/booking.model';
import { QueueListComponent, QueueListColumn, QueueListButton } from '../queue-list/queue-list.component';
import { QueuePopupComponent } from '../queue-popup/queue-popup.component';
import { QueueFormField, QueueFormButton, QueueStatusBar } from '../queue-form/queue-form.component';
import { VoiceService } from '../../services/voice.service';

@Component({
  selector: 'app-bookings-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, QueueListComponent, QueuePopupComponent],
  templateUrl: './bookings-tab.component.html',
  styleUrls: ['./bookings-tab.component.css']
})
export class BookingsTabComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  loading = false;
  selectedStatus: string = '';
  selectedDate: string = this.getTodayDateString();
  
  // Popup state
  showPopup: boolean = false;
  selectedBooking: BookingResponseDto | null = null;

  // Queue List columns
  listColumns: QueueListColumn[] = [
    { name: 'queue_number', label: 'Queue #', type: 'number' },
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'windowName', label: 'Window', type: 'text' },
    { name: 'status', label: 'Status', type: 'status' },
    { name: 'actualStartTime', label: 'Start Time', type: 'date' },
    { name: 'actualEndTime', label: 'End Time', type: 'date' },
    { name: 'timeTaken', label: 'Time Taken', type: 'text' },
    { name: 'startedByName', label: 'Started By', type: 'text' }
  ];

  // Header buttons
  headerButtons: QueueListButton[] = [
    {
      label: 'Get Next Waiting',
      icon: 'fa fa-forward',
      class: 'btn-primary',
      action: () => this.getNextWaiting()
    }
  ];

  // Row buttons
  rowButtons: QueueListButton[] = [
    {
      label: 'Start',
      icon: 'fa fa-play',
      class: 'btn-link',
      action: (row) => this.startProcessing(row),
      visible: (row) => row.status === 'waiting'
    }
  ];

  // Popup form fields
  popupFields: QueueFormField[] = [];
  popupButtons: QueueFormButton[] = [];
  popupStatusBar: QueueStatusBar | undefined;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private voiceService: VoiceService
  ) { }

  ngOnInit() {
    // Set today's date by default
    this.selectedDate = this.getTodayDateString();
    this.loadBookings();
    
    // Check if date changed (new day) every minute
    setInterval(() => {
      const today = this.getTodayDateString();
      if (today !== this.selectedDate && !this.selectedDate) {
        this.selectedDate = today;
        this.loadBookings();
      }
    }, 60000); // Check every minute
  }

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadBookings() {
    this.loading = true;
    // Always use today's date if no date selected
    const date = this.selectedDate ? new Date(this.selectedDate) : new Date();
    
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

  setToday() {
    this.selectedDate = this.getTodayDateString();
    this.loadBookings();
  }

  getStatusClass(status: string): string {
    return `status-badge status-${status.replace('_', '-')}`;
  }

  getRowDecoration(row: any): string {
    const status = row.status;
    if (status === 'waiting') return 'decoration-info';
    if (status === 'completed') return 'decoration-success';
    if (status === 'in_progress') return 'decoration-warning';
    if (status === 'cancelled') return 'decoration-muted';
    return '';
  }

  onRowClick(row: any) {
    // Use original booking data for popup
    this.openPopup(row._original || row);
  }

  openPopup(booking: BookingResponseDto) {
    this.selectedBooking = booking;
    
    // Setup popup fields - not used in custom popup template, but kept for compatibility
    this.popupFields = [];

    // Setup popup buttons based on status
    this.popupButtons = [];
    if (booking.status === 'waiting') {
      this.popupButtons.push({
        label: 'Start Processing',
        class: 'btn-primary',
        action: () => this.startProcessing(booking),
        visible: true
      });
      this.popupButtons.push({
        label: 'Cancel',
        class: 'btn-warning',
        action: () => this.cancelBooking(booking),
        visible: true
      });
    } else if (booking.status === 'in_progress') {
      this.popupButtons.push({
        label: 'Complete',
        class: 'btn-success',
        action: () => this.completeBooking(booking),
        visible: true
      });
      this.popupButtons.push({
        label: 'Recall',
        class: 'btn-info',
        icon: 'fa fa-bullhorn',
        action: () => this.recallReservation(booking),
        visible: true
      });
      this.popupButtons.push({
        label: 'Cancel',
        class: 'btn-warning',
        action: () => this.cancelBooking(booking),
        visible: true
      });
    } else if (booking.status === 'completed') {
      this.popupButtons.push({
        label: 'Next Reservation',
        class: 'btn-primary',
        action: () => this.getNextWaiting(),
        visible: true
      });
    }

    // Setup status bar
    this.popupStatusBar = {
      statusField: 'status',
      states: ['waiting', 'in_progress', 'completed'],
      currentState: booking.status
    };

    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedBooking = null;
  }

  getNextWaiting() {
    const user = this.authService.getCurrentUser();
    const userId = user?.id;
    
    this.bookingService.getNextWaiting(userId).subscribe({
      next: (booking) => {
        if (booking) {
          this.openPopup(booking);
          // Announce the reservation with window name
          this.voiceService.announceReservation(booking.queueNumber, booking.windowNumber, booking.windowName);
        }
      },
      error: (err) => {
        alert(err.error?.error || 'No waiting reservations');
      }
    });
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
        if (this.showPopup) {
          this.loadBookings();
          // Refresh popup data
          this.bookingService.getBooking(booking.id).subscribe({
            next: (updated) => {
              this.openPopup(updated);
              // Announce the reservation with window name
              this.voiceService.announceReservation(updated.queueNumber, updated.windowNumber, updated.windowName);
            }
          });
        }
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to start processing');
      }
    });
  }

  completeBooking(booking: BookingResponseDto) {
    this.bookingService.completeBooking(booking.id).subscribe({
      next: () => {
        // Refresh popup data
        this.bookingService.getBooking(booking.id).subscribe({
          next: (updated) => {
            this.openPopup(updated);
            this.loadBookings();
          }
        });
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
          this.closePopup();
        },
        error: (err) => {
          alert(err.error?.error || 'Failed to cancel booking');
        }
      });
    }
  }

  recallReservation(booking: BookingResponseDto) {
    // Recall/Re-announce the reservation with window name
    this.voiceService.recallReservation(booking.queueNumber, booking.windowNumber, booking.windowName);
  }

  // Transform data for Queue list
  getListData(): any[] {
    return this.bookings.map(b => ({
      queue_number: b.queueNumber,
      name: b.name,
      phone: b.phone,
      windowName: b.windowName || (b.windowNumber ? `Window ${b.windowNumber}` : '-'),
      status: b.status,
      actualStartTime: b.actualStartTime || '-',
      actualEndTime: b.actualEndTime || '-',
      timeTaken: b.timeTaken || '-',
      startedByName: b.startedByName || '-',
      bookingDate: b.bookingDate,
      // Keep original for popup
      _original: b
    }));
  }
}

