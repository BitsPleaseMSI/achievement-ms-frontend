import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Headers, Response, Http, RequestOptions  } from '@angular/http';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';

export interface resp{
  bool: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  login(email, password): Observable<any>{
    let body = new URLSearchParams();
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    body.set('email', email);
    body.set('password', password);

    return this.http.post('http://localhost:8090/users/auth', body.toString(), options)
      .pipe(
        retry(3) // retry a failed request up to 3 times
      );
  }

  isValid(token: string){
    return this.http.get('http://localhost:8090/users/isvalid?token=' + token)
      .pipe(
        retry(3) // retry a failed request up to 3 times
      );
  }

}
