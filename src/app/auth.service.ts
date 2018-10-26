import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";
import { safe } from './sanitise';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

let api = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  redirect(route: string, message: string){
    window.alert(message)
    this.router.navigate([route]);
  }

  currentUser(): Observable<any>{
    console.log('[currentUser]')
    let token = ''

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token');
    }else{
      token = sessionStorage.getItem('token');
    }

    // console.log(api + '/users/isvalid?token=' + token)
    return this.http.get(api + '/users/isvalid?token=' + token)
  }

  login(email, password): Observable<any>{
    console.log('[login]')
    let body = new URLSearchParams();
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    body.set('email', email);
    body.set('password', password);

    if(!safe(body.toString())){
      console.log('[UNSAFE DATA!]');
      return new Observable((data) => {})
    }

    return this.http.post(api + '/users/auth', body.toString(), options);
  }


  register(user: Object): Observable<any>{
    console.log('[register]')

    let body = new URLSearchParams();

    for(let key in user)
      body.append(key, user[key]);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    };

    if(!safe(body.toString())){
      console.log('[UNSAFE DATA!]');
      return new Observable((data) => {})
    }

    return this.http.post(api + '/users/add', body.toString(), options);

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

    if(!safe(body.toString())){
      console.log('[UNSAFE DATA!]');
      return new Observable((data) => {})
    }

    return this.http.post(api + '/users/resetpass', body.toString(), options)
    }

  approveAchievement(id: string){
    console.log('[approveAchievement]')
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let token = '';

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token');
    }else{
      token = sessionStorage.getItem('token');
    }

    let url = api + '/achievements/approve'
    url += ('?id=' + id)
    url += ('&token=' + token)

    return this.http.post(url, '', options)
  }

  unapproveAchievement(id: string){
    console.log('[unapproveAchievement]')
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let token = '';

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token');
    }else{
      token = sessionStorage.getItem('token');
    }

    let url = api + '/achievements/unapprove'
    url += ('?id=' + id)
    url += ('&token=' + token)

    return this.http.post(url, '', options)
  }

  updateUser(params: Object){
    console.log('[updateUser]')
    const data: FormData = new FormData();

    for(let key in params)
      data.append(key, params[key]);

    const req = new HttpRequest('PUT', api + '/users/reset', data, {
      reportProgress: false,
      responseType: 'text'
    });

    return this.http.request(req);

  }

}
