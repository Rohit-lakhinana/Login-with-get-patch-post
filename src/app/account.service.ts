import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) { }

  login(obj: any): Observable<any> {
    return this.http.post('https://dev.platformcommons.org/gateway/auth-service/api/auth/v1/login', obj);
  }
}
