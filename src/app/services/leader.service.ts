import { Injectable, Inject } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root',
})
export class LeaderService {
  urlSubfolder: string = 'leadership';
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService,
    @Inject('BaseURL') private baseURL
  ) {}

  getLeaders(): Observable<Leader[]> {
    return this.http
      .get<Leader[]>(baseURL + this.urlSubfolder)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id: string): Observable<Leader> {
    return this.http
      .get<Leader>(baseURL + this.urlSubfolder + '/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http
      .get<Leader>(baseURL + this.urlSubfolder + '?featured=true')
      .pipe(map((dishes) => dishes[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
