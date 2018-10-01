import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Headers, Response, Http, RequestOptions  } from '@angular/http';
//import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  login(email, password) {
    let body = new URLSearchParams();
    body.set('email', email);
    body.set('password', password);

    console.log("We sent:")
    console.log(body.toString())

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.http
      .post('http://localhost:8090/users/auth', body.toString(), options)
      .subscribe(response => {
      console.log('server response: ' + JSON.stringify(response));
    });
  }

}
