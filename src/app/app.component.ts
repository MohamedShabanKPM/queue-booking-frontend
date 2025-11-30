import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Queue Booking System';

  constructor(private i18n: I18nService) {}

  ngOnInit() {
    // Initialize language (Arabic by default)
    this.i18n.setLanguage('ar');
  }
}

