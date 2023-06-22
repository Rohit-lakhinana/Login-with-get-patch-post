import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiEndpoint = 'https://dev.platformcommons.org/gateway/assessment-service/api/v1/questions';
  private authEndpoint = 'https://dev.platformcommons.org/gateway/auth-service/api/auth/v1/login';

  constructor(private http: HttpClient) { }

  fetchQuestions(token: string, size: number): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiEndpoint}?page=10&size=${size}`, { headers });
  }

  updateQuestion(token: string, question: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(this.apiEndpoint, question, { headers });
  }

  deleteQuestion(token: string, id: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.apiEndpoint}/${id}`, { headers });
  }

  submitQuestion(token: string, questionData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiEndpoint, questionData, { headers });
  }

  login(obj: any): Observable<any> {
    return this.http.post(this.authEndpoint, obj);
  }
}