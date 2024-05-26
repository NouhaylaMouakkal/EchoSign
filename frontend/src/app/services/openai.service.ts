import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiUrl = 'https://api.openai.com/v1/audio/speech';
  private apiKey = environment.openaiApiKey;

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
