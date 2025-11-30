import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { QueueStatusDto } from '../../models/queue-status.model';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-queue-tracking',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
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

  constructor(
    private queueService: QueueService,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    this.updateTime();
    this.updateDate();
    this.timeInterval = setInterval(() => {
      this.updateTime();
      this.updateDate();
    }, 1000);
    
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

