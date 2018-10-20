import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { safe } from './sanitise';
import { Achievement } from './achievement';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class DataAccessService {

  constructor(private http: HttpClient, private router: Router) { }

  getAchievement(id: string): Observable<any>{
    console.log('[getAchievement]')
    return this.http.get<any>('http://localhost:8090/achievements/get/' + id)
  }

  getApprovedAchievements(params?: string): Observable<any>{
    console.log('[getApprovedAchievements]')
    return this.http.get<any>('http://localhost:8090/achievements/all' + params)
  }

  getUnapprovedAchievements(params?: string): Observable<any>{
    console.log('[getUnapprovedAchievements]')
    if(!params)
      params = '?'

    if(localStorage.getItem('token')){
      params += '&token=' + localStorage.getItem('token');
    }else{
      params += '&token=' + sessionStorage.getItem('token');
    }

    return this.http.get<any>('http://localhost:8090/achievements/unapproved' + params)
  }

  addAchievement(achievement: Achievement): Observable<any>{
    console.log('[addAchievement]')

    const data: FormData = new FormData();

    for(let key in achievement)
      data.append(key, achievement[key]);

    const req = new HttpRequest('POST', 'http://localhost:8090/achievements/add', data, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  deleteAchievement(id: string): Observable<any>{
    console.log('[deleteAchievement]')
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let token = '';

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token');
    }else{
      token = sessionStorage.getItem('token');
    }

    let url = 'http://localhost:8090/achievements/delete'
    url += ('?id=' + id)
    url += ('&token=' + token)

    return this.http.post(url, '', options)
  }

  addAcademic(achievement: Object): Observable<any>{
    console.log('[addAchievement]')
    let token = '';

    const data: FormData = new FormData();

    for(let key in achievement){
      console.log('data {}')
      console.log(key)
      console.log(achievement[key])
      data.append(key, achievement[key]);
    }

    if(localStorage.getItem('token')){
      data.append('token', localStorage.getItem('token'));
    }else{
      data.append('token', sessionStorage.getItem('token'));
    }

    const req = new HttpRequest('POST', 'http://localhost:8090/academic/add', data, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

}
