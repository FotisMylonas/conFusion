import { Injectable, Inject } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseURL';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  urlSubfolder: string = 'feedback';

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService,
    @Inject('BaseURL') private baseURL
  ) {}

  getFeedbacks(): Observable<Feedback[]> {
    return this.http
      .get<Feedback[]>(baseURL + this.urlSubfolder)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post<Feedback>(this.baseURL + this.urlSubfolder, feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
