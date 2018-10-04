import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataAccessService {

  constructor(private http: HttpClient) { }

  getAchievements(): Observable<any>{
    return this.http.get<any>('http://localhost:8090/achievements/all?department=Education')
    .pipe( retry(3) );
  }

  addAchievement(achievement: Object): Observable<any>{
    let body = new URLSearchParams();

    for(let key in achievement)
      body.append(key, achievement[key]);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    };

    console.log("This one " + body.toString())

    if(!safe(body.toString()))
      return new Observable((data) => {})

    return this.http.post('http://localhost:8090/achievements/add', body.toString(), options);
  }

}
