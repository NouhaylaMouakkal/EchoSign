import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  // private apiUrl = 'http://127.0.0.1:2002/generate-video'; // should change this with env variable 
  private apiUrl = environment.text2signPublicURLroute; // should change this with env variable 

  constructor(private http: HttpClient) { }

  generateVideo(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, data, { headers });
  }
}
