import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private speechSynthesis: SpeechSynthesis;
  private voiceEnabled: boolean = true;
  private lastAnnouncedNumber: number = 0;
  private lastAnnouncedWindow: number | null = null;

  constructor() {
    this.speechSynthesis = window.speechSynthesis || (window as any).webkitSpeechSynthesis;
  }

  enableVoice(): void {
    this.voiceEnabled = true;
  }

  disableVoice(): void {
    this.voiceEnabled = false;
    this.speechSynthesis.cancel();
  }

  isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  announceReservation(queueNumber: number, windowNumber?: number, windowName?: string, forceRecall: boolean = false): void {
    if (!this.voiceEnabled) {
      return;
    }

    // Don't re-announce the same number unless forced
    if (!forceRecall && queueNumber === this.lastAnnouncedNumber && windowNumber === this.lastAnnouncedWindow) {
      return;
    }

    // Stop any current speech
    this.speechSynthesis.cancel();

    // Build announcement text
    const arabicText = this.getArabicNumber(queueNumber);
    let arabicAnnouncement = '';
    let englishAnnouncement = '';

    if (windowName) {
      // Use window name if available
      arabicAnnouncement = `عميل رقم ${arabicText} ${windowName}`;
      englishAnnouncement = `Client number ${queueNumber}, ${windowName}`;
    } else if (windowNumber) {
      // Fallback to window number
      const windowArabic = this.getArabicNumber(windowNumber);
      arabicAnnouncement = `عميل رقم ${arabicText} شباك رقم ${windowArabic}`;
      englishAnnouncement = `Client number ${queueNumber}, Window number ${windowNumber}`;
    } else {
      arabicAnnouncement = `عميل رقم ${arabicText}`;
      englishAnnouncement = `Client number ${queueNumber}`;
    }

    // Play sound effect first (if available)
    this.playAnnouncementSound(() => {
      // Announce in Arabic
      this.speak(arabicAnnouncement, 'ar-SA', () => {
        // Then announce in English
        this.speak(englishAnnouncement, 'en-US', () => {
          this.lastAnnouncedNumber = queueNumber;
          this.lastAnnouncedWindow = windowNumber || null;
        });
      });
    });
  }

  private speak(text: string, lang: string, onEnd?: () => void): void {
    if (!this.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find appropriate voice
    const voices = this.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => 
        v.lang.startsWith(lang.split('-')[0]) && 
        (lang.includes('ar') ? v.name.toLowerCase().includes('arabic') : true)
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      if (onEnd) onEnd();
    };

    this.speechSynthesis.speak(utterance);
  }

  private getArabicNumber(num: number): string {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
  }

  private playAnnouncementSound(onEnd?: () => void): void {
    try {
      const audio = new Audio('/assets/announcement-sound-effect.mp3');
      audio.volume = 0.8;
      audio.play().then(() => {
        if (onEnd) {
          audio.onended = onEnd;
          // Fallback timeout in case audio doesn't fire onended
          setTimeout(() => {
            if (onEnd) onEnd();
          }, 2000);
        }
      }).catch(() => {
        // If audio fails, proceed with announcement
        if (onEnd) onEnd();
      });
    } catch (error) {
      // If audio fails, proceed with announcement
      if (onEnd) onEnd();
    }
  }

  recallReservation(queueNumber: number, windowNumber?: number, windowName?: string): void {
    this.announceReservation(queueNumber, windowNumber, windowName, true);
  }
}

