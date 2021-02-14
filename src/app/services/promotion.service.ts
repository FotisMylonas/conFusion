import { Injectable, Inject } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  urlSubfolder: string = 'promotions';
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService,
    @Inject('BaseURL') private baseURL
  ) {}

  getPromotions(): Observable<Promotion[]> {
    return this.http
      .get<Promotion[]>(baseURL + this.urlSubfolder)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http
      .get<Promotion>(baseURL + this.urlSubfolder + '/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http
      .get<Promotion>(baseURL + this.urlSubfolder + '?featured=true')
      .pipe(map((dishes) => dishes[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
