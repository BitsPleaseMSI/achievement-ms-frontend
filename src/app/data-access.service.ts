import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from './achievement';
import { environment } from '../environments/environment';

let api = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})

export class DataAccessService {

  constructor(private http: HttpClient) { }

  objArrToCSV(data: any, replace?: Object, concat?: Object, headers?: string[]): string{
    const array = typeof data != 'object' ? JSON.parse(data) : data;
    const index = Object.keys(array[0]);

    let find = [''];
    let str = '';

    if(!replace) replace = {'':''};
    if(!concat) concat = {'':''};

    if(headers){
      str = headers.join(',');
      str += '\r\n';
    }else{
      str = '';
    }

    for(let i in array){
      let line = '';
      for(let col in index){

        // blacklisting columns
        if(index[col] == '_id') continue;
        if(index[col] == 'approvedBy') continue;
        if(index[col] == 'rating') continue;

        if (line != '') line += ',';

        // replacing values based on column names
        if(replace[index[col]]){
          find = Object.keys(replace[index[col]]);
          array[i][index[col]] = array[i][index[col]].toString().replace(
            RegExp(find.join('|'), 'i'), function(search){return replace[index[col]][search];}
          )}

        if(concat[index[col]]){
          array[i][index[col]] = concat[index[col]].concat(array[i][index[col]].toString());
        }

        // sanitising special characters
        array[i][index[col]] = array[i][index[col]].toString().split('"').join('""');
        array[i][index[col]] = array[i][index[col]].toString().replace('\n','');
        array[i][index[col]] = array[i][index[col]].toString().replace('\r','');

        if(index[col] == 'rollNo')
          line += '="' + array[i][index[col]] + '"';
        else
          line += '"' + array[i][index[col]] + '"';
      }

      str += line + '\r\n';
    }
    return str;
  }

  getAchievement(id: string): Promise<any>{
    // console.log('[getAchievement]')
    return this.http.get<any>( api + '/achievements/get/' + id).toPromise()
  }

  getAcademic(params?: string): Observable<any>{
    // console.log('[getAcademicAchievements]')
    if(!params){
      params = ''
    }
    return this.http.get<any>(api + '/academic/getall' + params)
  }

  getApprovedAchievements(limit:number, offset:number, params?: string): Observable<any>{
    // console.log('[getApprovedAchievements]')

    if(!params){
      params = '?'
    }

    params += '&limit=' + limit + '&offset=' + offset;
    return this.http.get<any>(api + '/achievements/all'+ params);
  }

  getUnapprovedAchievements(limit:number, offset:number, params?: string): Observable<any>{
    // console.log('[getUnapprovedAchievements]')
    if(!params)
      params = '?'

    if(localStorage.getItem('token')){
      params += '&token=' + localStorage.getItem('token');
    }else{
      params += '&token=' + sessionStorage.getItem('token');
    }

    params += '&limit=' + limit + '&offset=' + offset;
    return this.http.get<any>(api + '/achievements/unapproved' + params)
  }

  addAchievement(achievement: Achievement): Observable<any>{
    // console.log('[addAchievement]')

    const data: FormData = new FormData();

    for(let key in achievement)
      data.append(key, achievement[key]);

    const req = new HttpRequest('POST', api + '/achievements/add', data, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }


  deleteAchievement(id: string): Observable<any>{
    // console.log('[deleteAchievement]')
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let token = '';

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token');
    }else{
      token = sessionStorage.getItem('token');
    }

    let url = api + '/achievements/delete'
    url += ('?id=' + id)
    url += ('&token=' + token)

    return this.http.post(url, '', options)
  }


  addAcademic(achievement: Object): Observable<any>{
    // console.log('[addAcademic]');

    const data: FormData = new FormData();

    for(let key in achievement){
      data.append(key, achievement[key]);
    }

    if(localStorage.getItem('token')){
      data.append('token', localStorage.getItem('token'));
    }else{
      data.append('token', sessionStorage.getItem('token'));
    }

    const req = new HttpRequest('POST', api + '/academic/add', data, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }


  deleteAcademic(id: string){
    // console.log('[deleteAcademic]')

    const data: FormData = new FormData();

    data.append('id', id);

    if(localStorage.getItem('token')){
      data.append('token', localStorage.getItem('token'));
    }else{
      data.append('token', sessionStorage.getItem('token'));
    }

    const req = new HttpRequest('POST', api + '/academic/delete', data, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  editAcademic(achievement: Object){
    // console.log('[editAcademic]');

    const data: FormData = new FormData();
    for(let key in achievement){
      data.append(key, achievement[key]);
    }

    if(localStorage.getItem('token')){
      data.append('token', localStorage.getItem('token'));
    }else{
      data.append('token', sessionStorage.getItem('token'));
    }

    const req = new HttpRequest('PUT', api + '/academic/edit', data, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);

  }


  addTAchievement(achievement: Object): Observable<any>{
    // console.log('[addTAchievement]');

    const data: FormData = new FormData();

    for(let key in achievement){
      data.append(key, achievement[key]);
      console.log(key + ' ' + achievement[key]);
    }

    if(localStorage.getItem('token')){
      data.append('token', localStorage.getItem('token'));
    }else{
      data.append('token', sessionStorage.getItem('token'));
    }

    const req = new HttpRequest('POST', api + '/tachievements/add', data, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

}
