import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { safe } from './sanitise';

@Injectable({
  providedIn: 'root'
})

export class DataAccessService {

  constructor(private http: HttpClient) { }

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

  addAchievement(achievement: Object): Observable<any>{
    console.log('[addAchievement]')

    const data: FormData = new FormData();

    for(let key in achievement){
      if(key == 'image'){
        console.log(key);
        console.log(achievement[key]);
        data.append(key, achievement[key], achievement[key]);
        continue;
      }
      console.log('ki ' + key)
      console.log('valu ' + achievement[key].toString())
      data.append(key, achievement[key]);
    }

    const req = new HttpRequest('POST', 'http://localhost:8090/achievements/add', data, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);

  }

}
