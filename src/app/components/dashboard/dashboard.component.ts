import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { DashboardStatsDto } from '../../models/booking.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStatsDto | null = null;
  loading = false;
  selectedDate: string = new Date().toISOString().split('T')[0];

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    const date = this.selectedDate ? new Date(this.selectedDate) : undefined;
    
    this.bookingService.getDashboardStats(date).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }

  onDateChange() {
    this.loadStats();
  }
}

