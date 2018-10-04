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

  getApprovedAchievements(): Observable<any>{
    console.log('[getApprovedAchievements]')
    return this.http.get<any>('http://localhost:8090/achievements/all')
    .pipe( retry(3) );
  }

  getUnapprovedAchievements(): Observable<any>{
    console.log('[getUnapprovedAchievements]')
    return this.http.get<any>('http://localhost:8090/achievements/unapproved?token=' + localStorage.getItem('token'))
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


/*
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'multipart/form-data'),
    };

    let data = new FormData();

    for(let key in achievement){
      if(key == 'image'){
        console.log(key);
        console.log(achievement[key]);
        data.append(key, achievement[key], achievement[key]);
        continue;
      }
      console.log(key)
      console.log(achievement[key])
      data.append(key, achievement[key]);
    }

    console.log(data)
    return this.http.post('http://localhost:8090/achievements/add', data);



    const formData = new FormData();

    for(let key in achievement){
      console.log(key)
      console.log(achievement[key])
      formData.append(key, achievement['key']);
    }


    if(!safe(formData.toString()))
      return new Observable((data) => {})

    console.log('formData')
    console.log(formData)

    return this.http.post('http://localhost:8090/achievements/add', formData, options);
*/
  }



/*
  uploadFile(file: File): Observable<any> {



    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.post(apiUrl, formData, { headers: headers });

  }
*/






}
