import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.openaiApiKey;

  constructor(private http: HttpClient) { }

  translate(text: string, targetLanguage: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const messages = [
      {
        role: "system",
        content: `Translate the following sentence into ${targetLanguage}: "${text}". If the sentence is unclear, random, or not comprehensible, translate it as it is into the provided language.`
      },
      {
        role: "user",
        content: text
      }
    ];

    const body = {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => response.choices[0].message.content.trim()),
      catchError(error => {
        console.error('Error during translation', error);
        return throwError('Translation failed; please try again later.');
      })
    );
  }
}