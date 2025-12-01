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
  private lastRecallTime: string | null = null;

  constructor(
    private queueService: QueueService,
    private voiceService: VoiceService
  ) { }

  ngOnInit() {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    
    // Initialize last announced values from first status
    let isFirstStatus = true;
    
    this.subscription = this.queueService.getStatusPolling(2000).subscribe({
      next: (data) => {
        // On first load, initialize last announced values but don't announce
        if (isFirstStatus) {
          if (data.currentServing > 0) {
            this.lastAnnouncedNumber = data.currentServing;
            this.lastAnnouncedWindow = data.windowNumber || null;
          }
          this.lastRecallTime = data.lastRecallTime || null;
          isFirstStatus = false;
          this.status = data;
          this.loading = false;
          return; // Skip announcement on first load
        }
        
        // Check if recall time changed (force recall)
        const recallTimeChanged = data.lastRecallTime && data.lastRecallTime !== this.lastRecallTime;
        
        // Check if number changed and announce
        const windowChanged = (data.windowNumber || null) !== this.lastAnnouncedWindow;
        const numberChanged = data.currentServing !== this.lastAnnouncedNumber;
        
        // Announce if number/window changed OR if recall time changed (force recall)
        if (data.currentServing > 0 && (numberChanged || windowChanged || recallTimeChanged)) {
          console.log('Tracking Tab: Announcing reservation:', data.currentServing, 'Window:', data.windowNumber || data.windowName, recallTimeChanged ? '(FORCE RECALL)' : '');
          this.voiceService.announceReservation(
            data.currentServing, 
            data.windowNumber || undefined,
            data.windowName,
            recallTimeChanged || true // Force recall if recall time changed or if number/window changed
          );
          this.lastAnnouncedNumber = data.currentServing;
          this.lastAnnouncedWindow = data.windowNumber || null;
          this.lastRecallTime = data.lastRecallTime || null;
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

