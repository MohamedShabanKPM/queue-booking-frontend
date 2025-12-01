import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { BookingResponseDto } from '../../models/booking.model';
import { QueueListComponent, QueueListColumn, QueueListButton } from '../queue-list/queue-list.component';
import { QueuePopupComponent } from '../queue-popup/queue-popup.component';
import { QueueFormField, QueueFormButton, QueueStatusBar } from '../queue-form/queue-form.component';
import { QueueService } from '../../services/queue.service';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface Window {
  id: number;
  name: string;
  number: number;
  isActive: boolean;
}

@Component({
  selector: 'app-bookings-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, QueueListComponent, QueuePopupComponent, TranslatePipe],
  templateUrl: './bookings-tab.component.html',
  styleUrls: ['./bookings-tab.component.css']
})
export class BookingsTabComponent implements OnInit {
  bookings: BookingResponseDto[] = [];
  loading = false;
  selectedStatus: string = '';
  selectedDate: string = this.getTodayDateString();
  
  // Date input components
  selectedDay: number | null = null;
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  days: number[] = [];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];
  
  // Popup state
  showPopup: boolean = false;
  selectedBooking: BookingResponseDto | null = null;

  // Queue List columns - will be initialized in ngOnInit
  listColumns: QueueListColumn[] = [];

  // Header buttons - will be initialized in ngOnInit
  headerButtons: QueueListButton[] = [];

  // Row buttons - will be initialized in ngOnInit
  rowButtons: QueueListButton[] = [];

  // Popup form fields
  popupFields: QueueFormField[] = [];
  popupButtons: QueueFormButton[] = [];
  popupStatusBar: QueueStatusBar | undefined;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    public i18n: I18nService,
    private queueService: QueueService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Initialize translations
    this.initializeTranslations();
    
    // Initialize date components
    this.initializeDateInputs();
    
    // Set today's date by default
    this.setToday();
    this.loadBookings();
    
    // Check if date changed (new day) every minute
    setInterval(() => {
      const today = this.getTodayDateString();
      if (today !== this.selectedDate && !this.selectedDate) {
        this.setToday();
        this.loadBookings();
      }
    }, 60000); // Check every minute
    
    // Update translations when language changes
    this.i18n.currentLanguage$.subscribe(() => {
      this.initializeTranslations();
    });
  }

  initializeTranslations() {
    this.listColumns = [
      { name: 'queue_number', label: this.i18n.translate('booking.queueNumber'), type: 'number' },
      { name: 'name', label: this.i18n.translate('booking.name'), type: 'text' },
      { name: 'phone', label: this.i18n.translate('booking.phone'), type: 'text' },
      { name: 'windowName', label: this.i18n.translate('booking.window'), type: 'text' },
      { name: 'status', label: this.i18n.translate('booking.status'), type: 'status' },
      { name: 'actualStartTime', label: this.i18n.translate('booking.startTime'), type: 'date' },
      { name: 'actualEndTime', label: this.i18n.translate('booking.endTime'), type: 'date' },
      { name: 'timeTaken', label: this.i18n.translate('booking.timeTaken'), type: 'text' },
      { name: 'startedByName', label: this.i18n.translate('booking.startedBy'), type: 'text' }
    ];

    this.headerButtons = [
      {
        label: this.i18n.translate('booking.getNextWaiting'),
        icon: 'fas fa-forward',
        class: 'btn-primary',
        action: () => this.getNextWaiting()
      }
    ];

    this.rowButtons = [
      {
        label: this.i18n.translate('booking.startProcessing'),
        icon: 'fas fa-play',
        class: 'btn-link',
        action: (row) => this.openTracking(row),
        visible: (row) => row.status === 'waiting'
      }
    ];
  }

  initializeDateInputs() {
    // Generate days (1-31)
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    // Generate years (current year - 2 to current year + 2)
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }

  onDateChange() {
    if (this.selectedDay && this.selectedMonth && this.selectedYear) {
      const month = String(this.selectedMonth).padStart(2, '0');
      const day = String(this.selectedDay).padStart(2, '0');
      this.selectedDate = `${this.selectedYear}-${month}-${day}`;
      this.onFilterChange();
    } else {
      this.selectedDate = '';
      this.onFilterChange();
    }
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
    const today = new Date();
    this.selectedDay = today.getDate();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = today.getFullYear();
    this.selectedDate = this.getTodayDateString();
    this.onFilterChange();
  }

  getStatusClass(status: string): string {
    return `status-badge status-${status.replace('_', '-')}`;
  }

  getRowDecoration(row: any): string {
    const status = row.status;
    if (status === 'waiting') return 'decoration-info-text';
    if (status === 'completed') return 'decoration-success-text';
    if (status === 'in_progress') return 'decoration-warning-text';
    if (status === 'cancelled') return 'decoration-danger-text';
    return '';
  }

  onRowClick(row: any) {
    // Use original booking data for popup
    this.openPopup(row._original || row);
  }

  openTracking(row: any) {
    // Get the original booking data
    const booking = row._original || row;
    // Open the popup for the current row (like clicking the row)
    this.openPopup(booking);
    
    // Get the current user's window and update booking window
    const user = this.authService.getCurrentUser();
    if (user) {
      this.http.get<Window>(`http://localhost:5000/api/windows/user/${user.id}`).subscribe({
        next: (userWindow) => {
          // Update booking window with user's window
          this.bookingService.updateBookingWindow(booking.id, userWindow.id).subscribe({
            next: () => {
              // Update current serving in tracking (this will trigger voice announcement in tracking screen)
              this.queueService.updateServing(booking.queueNumber, userWindow.id).subscribe({
                next: () => {
                  // Successfully updated - the tracking screen will automatically detect the change
                  // and trigger the voice announcement
                },
                error: (err) => {
                  console.error('Error updating current serving:', err);
                }
              });
            },
            error: (err) => {
              console.error('Error updating booking window:', err);
            }
          });
        },
        error: () => {
          // If user has no window, just update current serving without updating booking window
          this.queueService.updateServing(booking.queueNumber, booking.windowNumber).subscribe({
            next: () => {
              console.log('Updated current serving without window assignment');
            },
            error: (err) => {
              console.error('Error updating current serving:', err);
            }
          });
        }
      });
    } else {
      // No user, just update current serving
      this.queueService.updateServing(booking.queueNumber, booking.windowNumber).subscribe({
        next: () => {
          console.log('Updated current serving without user');
        },
        error: (err) => {
          console.error('Error updating current serving:', err);
        }
      });
    }
  }

  openPopup(booking: BookingResponseDto) {
    this.selectedBooking = booking;
    
    // Setup popup fields - not used in custom popup template, but kept for compatibility
    this.popupFields = [];

    // Setup popup buttons based on status
    this.popupButtons = [];
    if (booking.status === 'waiting') {
      this.popupButtons.push({
        label: this.i18n.translate('booking.startProcessing'),
        class: 'btn-success',
        icon: 'fas fa-play',
        action: () => this.startProcessing(booking),
        visible: true
      });
      this.popupButtons.push({
        label: this.i18n.translate('booking.recall'),
        class: 'btn-info',
        icon: 'fas fa-bullhorn',
        action: () => this.recallReservation(booking),
        visible: true
      });
      this.popupButtons.push({
        label: this.i18n.translate('booking.cancel'),
        class: 'btn-danger',
        icon: 'fas fa-times',
        action: () => this.cancelBooking(booking),
        visible: true
      });
      // Add Next Reservation button for waiting status
      this.popupButtons.push({
        label: this.i18n.translate('booking.nextReservation'),
        class: 'btn-primary',
        icon: 'fas fa-arrow-right',
        action: () => this.getNextWaiting(),
        visible: true
      });
    } else if (booking.status === 'in_progress') {
      this.popupButtons.push({
        label: this.i18n.translate('booking.complete'),
        class: 'btn-success',
        icon: 'fas fa-check',
        action: () => this.completeBooking(booking),
        visible: true
      });
      this.popupButtons.push({
        label: this.i18n.translate('booking.cancel'),
        class: 'btn-danger',
        icon: 'fas fa-times',
        action: () => this.cancelBooking(booking),
        visible: true
      });
    } else if (booking.status === 'completed') {
      // Add Next Reservation button for completed status
      this.popupButtons.push({
        label: this.i18n.translate('booking.nextReservation'),
        class: 'btn-primary',
        icon: 'fas fa-arrow-right',
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
          // Update current serving in tracking (this will trigger voice announcement in tracking screen)
          this.queueService.updateServing(booking.queueNumber, booking.windowNumber).subscribe({
            next: () => {
              // Successfully updated - the tracking screen will automatically detect the change
              // and trigger the voice announcement
            },
            error: (err) => {
              console.error('Error updating current serving:', err);
            }
          });
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

    // Get user's window first
    this.http.get<Window>(`http://localhost:5000/api/windows/user/${user.id}`).subscribe({
      next: (userWindow) => {
        // Start processing (this will update windowId in backend)
        this.bookingService.startProcessing(booking.id, user.id).subscribe({
          next: () => {
            // Also explicitly update window to ensure it's set
            this.bookingService.updateBookingWindow(booking.id, userWindow.id).subscribe({
              next: () => {
                this.loadBookings();
                if (this.showPopup) {
                  this.loadBookings();
                  // Refresh popup data
                  this.bookingService.getBooking(booking.id).subscribe({
                    next: (updated) => {
                      this.openPopup(updated);
                      // Update current serving in tracking (this will trigger voice announcement in tracking screen)
                      this.queueService.updateServing(updated.queueNumber, userWindow.id).subscribe({
                        next: () => {
                          // Successfully updated - the tracking screen will automatically detect the change
                          // and trigger the voice announcement
                        },
                        error: (err) => {
                          console.error('Error updating current serving:', err);
                        }
                      });
                    }
                  });
                }
              },
              error: (err) => {
                console.error('Error updating booking window:', err);
                // Continue anyway
                this.loadBookings();
                if (this.showPopup) {
                  this.loadBookings();
                  this.bookingService.getBooking(booking.id).subscribe({
                    next: (updated) => {
                      this.openPopup(updated);
                      this.queueService.updateServing(updated.queueNumber, userWindow.id).subscribe();
                    }
                  });
                }
              }
            });
          },
          error: (err) => {
            alert(err.error?.error || 'Failed to start processing');
          }
        });
      },
      error: () => {
        // If user has no window, just start processing without window update
        this.bookingService.startProcessing(booking.id, user.id).subscribe({
          next: () => {
            this.loadBookings();
            if (this.showPopup) {
              this.loadBookings();
              this.bookingService.getBooking(booking.id).subscribe({
                next: (updated) => {
                  this.openPopup(updated);
                  this.queueService.updateServing(updated.queueNumber, updated.windowNumber).subscribe();
                }
              });
            }
          },
          error: (err) => {
            alert(err.error?.error || 'Failed to start processing');
          }
        });
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
    // Get the current user's window for the recall
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Get user's current window assignment
    this.http.get<Window>(`http://localhost:5000/api/windows/user/${user.id}`).subscribe({
      next: (userWindow) => {
        // Update booking window with user's window
        this.bookingService.updateBookingWindow(booking.id, userWindow.id).subscribe({
          next: () => {
            // Use the user's window for the recall
            this.queueService.updateServing(booking.queueNumber, userWindow.id, true).subscribe({
              next: () => {
                // Successfully updated - the tracking screen will automatically detect the change
                // and trigger the voice announcement with forceRecall using the user's window
                console.log('Recall: Updated booking window and current serving to', booking.queueNumber, 'with user window:', userWindow.name);
              },
              error: (err) => {
                console.error('Error recalling reservation:', err);
              }
            });
          },
          error: (err) => {
            console.error('Error updating booking window:', err);
            // Still try to update current serving even if window update failed
            this.queueService.updateServing(booking.queueNumber, userWindow.id, true).subscribe();
          }
        });
      },
      error: (err) => {
        // If user has no window assigned, use booking's window as fallback
        console.warn('User has no window assigned, using booking window');
        this.queueService.updateServing(booking.queueNumber, booking.windowNumber, true).subscribe({
          next: () => {
            console.log('Recall: Updated current serving to', booking.queueNumber, 'with booking window');
          },
          error: (err2) => {
            console.error('Error recalling reservation:', err2);
          }
        });
      }
    });
  }

  // Transform data for Queue list
  getListData(): any[] {
    return this.bookings.map(b => ({
      queue_number: b.queueNumber,
      name: b.name,
      phone: b.phone,
      windowName: b.windowName || (b.windowNumber ? `Window ${b.windowNumber}` : '-'),
      status: b.status,
      actualStartTime: (b.actualStartTime && b.actualStartTime !== 'Invalid Date') ? b.actualStartTime : null,
      actualEndTime: (b.actualEndTime && b.actualEndTime !== 'Invalid Date') ? b.actualEndTime : null,
      timeTaken: b.timeTaken || '-',
      startedByName: b.startedByName || '-',
      bookingDate: b.bookingDate,
      // Keep original for popup
      _original: b
    }));
  }
}

