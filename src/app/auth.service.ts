import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Headers, Response, Http, RequestOptions  } from '@angular/http';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';
// import { User } from './user'
import { safe } from './sanitise';

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

    if(!safe(body.toString())){
      return new Observable((data) => {})
    }

    return this.http.post('http://localhost:8090/users/auth', body.toString(), options);
  }

  isValid(token: string){

    if(!safe(token)){
      return new Observable((data) => {});
    }

    return this.http.get('http://localhost:8090/users/isvalid?token=' + token)
      .pipe(
        retry(3) // retry a failed request up to 3 times
      );
  }

  register(user: Object): Observable<any>{
    let body = new URLSearchParams();

    for(let key in user)
      body.append(key, user[key]);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    };

    console.log("This one " + body.toString())

    if(!safe(body.toString()))
      return new Observable((data) => {})

    return this.http.post('http://localhost:8090/users/add', body.toString(), options);

  }

  reset(email, currentpass, newpass): Observable<any>{
    let body = new URLSearchParams();
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    body.set('email', email);
    body.set('currentpass', currentpass);
    body.set('newpass', newpass);

    if(!safe(body.toString()))
      return new Observable((data) => {})

    return this.http.post('http://localhost:8090/users/resetpass', body.toString(), options)
    }

}
