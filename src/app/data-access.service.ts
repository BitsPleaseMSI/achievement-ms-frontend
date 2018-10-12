import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { safe } from './sanitise';
import {Achievement} from './achievement';

@Injectable({
  providedIn: 'root'
})

export class DataAccessService {

  constructor(private http: HttpClient) { }

  getAchievement(id: string): Observable<any>{
    console.log('[getAchievement]')
    return this.http.get<any>('http://localhost:8090/achievements/get/' + id)
  }

  getApprovedAchievements(params?: Object): Observable<any>{
    console.log('[getApprovedAchievements]')

    let filters = new URLSearchParams();

/*
  department
  semester
  dateFrom
  dateTo
  shift
  section
  sessionFrom
  sessionto
  category
*/

    for(let key in params)
      filters.append(key, params[key]);

    console.log('filters.toString()')
    console.log(filters.toString())

    return this.http.get<any>('http://localhost:8090/achievements/all\?' + filters.toString())
  }

  getUnapprovedAchievements(): Observable<any>{
    console.log('[getUnapprovedAchievements]')
    let token = '';

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token');
    }else{
      token = sessionStorage.getItem('token');
    }

    return this.http.get<any>('http://localhost:8090/achievements/unapproved?token=' + token)
    .pipe( retry(3) );
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

}
