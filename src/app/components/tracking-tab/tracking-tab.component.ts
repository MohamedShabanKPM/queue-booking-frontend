import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { QueueStatusDto } from '../../models/queue-status.model';
import { VoiceService } from '../../services/voice.service';
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
  private lastAnnouncedNumber: number = 0;
  private lastAnnouncedWindow: number | null = null;

  constructor(
    private queueService: QueueService,
    private voiceService: VoiceService
  ) { }

  ngOnInit() {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    
    this.subscription = this.queueService.getStatusPolling(2000).subscribe({
      next: (data) => {
        // Check if number changed and announce
        if (data.currentServing > 0 && 
            (data.currentServing !== this.lastAnnouncedNumber || 
             data.windowNumber !== this.lastAnnouncedWindow)) {
          this.voiceService.announceReservation(
            data.currentServing, 
            data.windowNumber || undefined,
            data.windowName
          );
          this.lastAnnouncedNumber = data.currentServing;
          this.lastAnnouncedWindow = data.windowNumber || null;
        }
        
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

