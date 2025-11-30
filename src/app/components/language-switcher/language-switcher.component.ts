import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService, Language } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="language-switcher">
      <button 
        class="lang-btn" 
        [class.active]="i18n.getCurrentLanguage() === 'ar'"
        (click)="setLanguage('ar')">
        <i class="fas fa-language"></i> {{ 'language.arabic' | translate }}
      </button>
      <button 
        class="lang-btn" 
        [class.active]="i18n.getCurrentLanguage() === 'en'"
        (click)="setLanguage('en')">
        <i class="fas fa-language"></i> {{ 'language.english' | translate }}
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .lang-btn {
      padding: 6px 12px;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      background: white;
      color: #495057;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .lang-btn:hover {
      border-color: #D4AF37;
      color: #D4AF37;
    }

    .lang-btn.active {
      background: linear-gradient(135deg, #D4AF37, #FFD700);
      border-color: #D4AF37;
      color: #1a1a1a;
      font-weight: 600;
    }

    .lang-btn i {
      font-size: 14px;
    }
  `]
})
export class LanguageSwitcherComponent {
  constructor(public i18n: I18nService) {}

  setLanguage(lang: Language) {
    this.i18n.setLanguage(lang);
  }
}

