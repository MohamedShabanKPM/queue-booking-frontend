import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { QueueStatusDto } from '../../models/queue-status.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tracking-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-tab.component.html',
  styleUrls: ['./tracking-tab.component.css']
})
export class TrackingTabComponent implements OnInit, OnDestroy {
  status: QueueStatusDto | null = null;
  loading = false;
  currentTime: string = '';
  private subscription?: Subscription;
  private timeInterval?: any;

  constructor(
    private queueService: QueueService
  ) { }

  ngOnInit() {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    
    this.subscription = this.queueService.getStatusPolling(2000).subscribe({
      next: (data) => {
        this.status = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading queue status:', err);
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }
}

