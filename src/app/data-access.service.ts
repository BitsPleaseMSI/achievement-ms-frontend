import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
// import { User } from './user';
// import { Achievement } from './achievement';

@Injectable({
  providedIn: 'root'
})

export class DataAccessService {

  constructor(private client: HttpClient) { }

  getAchievements(): Observable<any>{
    return this.client.get<any>('http://localhost:8090/achievements/all?department=Education')
    .pipe( retry(3) );
  }

  //TODO
  addAchievement(){
  return this.client.get('http://127.0.0.1:8090/')
}

  //TODO
  addUser(user: Object): Observable<any>{
    console.log("Data service console " + JSON.stringify(user));
    return this.client.post<any>('http://localhost:8090/users/add', user, {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    })
    .pipe(catchError(this.handleError))
  }

  //error hangling block
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
