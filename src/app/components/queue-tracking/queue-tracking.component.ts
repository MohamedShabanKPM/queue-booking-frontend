import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { QueueStatusDto } from '../../models/queue-status.model';
import { VoiceService } from '../../services/voice.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-queue-tracking',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './queue-tracking.component.html',
  styleUrls: ['./queue-tracking.component.css']
})
export class QueueTrackingComponent implements OnInit, OnDestroy {
  status: QueueStatusDto | null = null;
  loading = false;
  currentTime: string = '';
  currentDate: string = '';
  private subscription?: Subscription;
  private timeInterval?: any;
  private lastAnnouncedNumber: number = 0;
  private lastAnnouncedWindow: number | null = null;

  constructor(
    private queueService: QueueService,
    public i18n: I18nService,
    private voiceService: VoiceService
  ) { }

  ngOnInit() {
    // Enable voice service
    this.voiceService.enableVoice();
    
    this.updateTime();
    this.updateDate();
    this.timeInterval = setInterval(() => {
      this.updateTime();
      this.updateDate();
    }, 1000);
    
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
          isFirstStatus = false;
          this.status = data;
          this.loading = false;
          return; // Skip announcement on first load
        }
        
        // Check if number changed and announce
        const windowChanged = (data.windowNumber || null) !== this.lastAnnouncedWindow;
        const numberChanged = data.currentServing !== this.lastAnnouncedNumber;
        
        if (data.currentServing > 0 && (numberChanged || windowChanged)) {
          console.log('Tracking: Announcing reservation:', data.currentServing, 'Window:', data.windowNumber || data.windowName);
          // Use forceRecall to bypass VoiceService internal check since we're tracking state here
          this.voiceService.announceReservation(
            data.currentServing, 
            data.windowNumber || undefined,
            data.windowName,
            true // Force recall since we've already checked for changes
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

  updateDate() {
    const now = new Date();
    const lang = this.i18n.getCurrentLanguage();
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
    this.currentDate = now.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

