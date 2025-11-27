import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { QueueStatusDto } from '../models/queue-status.model';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private apiUrl = 'http://localhost:5000/api/queue';

  constructor(private http: HttpClient) { }

  getStatus(): Observable<QueueStatusDto> {
    return this.http.get<QueueStatusDto>(`${this.apiUrl}/status`);
  }

  getStatusPolling(intervalMs: number = 2000): Observable<QueueStatusDto> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.getStatus())
    );
  }

  updateServing(queueNumber: number, windowId?: number, forceRecall: boolean = false): Observable<any> {
    let url = `${this.apiUrl}/update-serving?queueNumber=${queueNumber}&forceRecall=${forceRecall}`;
    if (windowId) {
      url += `&windowId=${windowId}`;
    }
    return this.http.post(url, {});
  }
}

