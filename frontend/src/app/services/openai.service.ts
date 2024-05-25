import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiUrl = 'https://api.openai.com/v1/audio/speech';
  private apiKey = 'sk-proj-MH1e6cIsfJg77nFLRMbIT3BlbkFJYTYX3K7zdQ1LGcW6TXGo'; 

  constructor(private http: HttpClient) { }

  generateSpeech(text: string, voice: string = 'alloy', model: string = 'tts-1', responseFormat: string = 'mp3'): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: model,
      voice: voice,
      input: text,
      response_format: responseFormat
    };

    return this.http.post(this.apiUrl, body, { headers: headers, responseType: 'blob' });
  }
}
