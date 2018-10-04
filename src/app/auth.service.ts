import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Headers, Response, Http, RequestOptions  } from '@angular/http';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { catchError, retry } from 'rxjs/operators';
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
    console.log('[login]')
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
    console.log('[isValid]')
    if(!safe(token)){
      return new Observable((data) => {});
    }

    return this.http.get('http://localhost:8090/users/isvalid?token=' + token)
      .pipe(
        retry(3) // retry a failed request up to 3 times
      );
  }

  register(user: Object): Observable<any>{
    console.log('[register]')

    let body = new URLSearchParams();

    for(let key in user)
      body.append(key, user[key]);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    };

    if(!safe(body.toString()))
      return new Observable((data) => {})

    return this.http.post('http://localhost:8090/users/add', body.toString(), options);

  }

  reset(email, currentpass, newpass): Observable<any>{
    console.log('[reset]')

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

  approveAchievement(id: string, token: string){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let url = 'http://localhost:8090/achievements/approve'
    url += ('?id=' + id)
    url += ('&token=' + token)

    return this.http.post(url, '', options)
  }

  unapproveAchievement(id: string, token: string){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let url = 'http://localhost:8090/achievements/unapprove'
    url += ('?id=' + id)
    url += ('&token=' + token)

    return this.http.post(url, '', options)
  }

}
