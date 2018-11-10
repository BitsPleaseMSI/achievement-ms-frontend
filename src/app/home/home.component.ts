import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { Router, ActivatedRoute } from '@angular/router';
import { safe } from '../sanitise';
import { AppComponent } from '../app.component';
import * as $ from 'jquery';

interface Window {
    length: any;
    location: any;
}

interface Achievement {
    length: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  achievements$: Achievement;
  w$: Window = window;
  fileName$: string;

  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router, private ac: AppComponent){
    this.achievements$ = [];
  }

  ngOnInit() {
    this.getdata(window.location.search);

    $('#filters').hide(50);
    $('#b').click(function(){
      $('#filters').toggle('fast');
    });
  }

  getdata(params: string){
    $('#homeEmpty').hide(50);
    $('#downloadList').hide(50);
    $('#homeLoading').show(50);
    if(window.location.pathname.includes('/home/achievements')){

      this.data.getApprovedAchievements(params)
      .subscribe(
        (data) => {
          this.achievements$ = data;
          if(this.achievements$.length == 0){
            $('#homeEmpty').show(50);
          }else{
            $('#downloadList').show(50);
          }
          $('#homeLoading').hide(50);
        },
        () =>{
          $('#homeLoading').hide(50);
          this.ac.snackbar('Server is not responding, Please try later.');
      });

    }else if(window.location.pathname.includes('/home/academic')){

      this.data.getAcademic(params)
      .subscribe(
        (data) => {
          this.achievements$ = data;
          if(this.achievements$.length == 0){
            $('#homeEmpty').show(50);
          }else{
            $('#downloadList').show(50);
          }
          $('#homeLoading').hide(50);
        },
        () =>{
          $('#homeLoading').hide(50);
          this.ac.snackbar('Server is not responding, Please try later.');
      });

    }

  }

  resetFilters(event){
    event.preventDefault();
    let target = document.getElementById('filter') as HTMLFormElement;
    target.reset();
    this.router.navigate([window.location.pathname]);
    this.getdata('');
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};

    if(window.location.pathname.includes('/home/achievements')){
      params['sessionFrom'] = target.querySelector('#sessionFrom').value
      params['sessionTo'] = target.querySelector('#sessionTo').value
      params['dateFrom'] = target.querySelector('#dateFrom').value
      params['dateTo'] = target.querySelector('#dateTo').value
      params['rollNo'] = target.querySelector('#rollNo').value
      params['section'] = target.querySelector('#section').value
      params['semester'] = target.querySelector('#semester').value
      params['shift'] = target.querySelector('#shift').value
      params['category'] = target.querySelector('#category').value
      params['department'] = target.querySelector('#department').value

    }else if(window.location.pathname.includes('/home/academic')){

      if(target.querySelector('#from').value == '' && target.querySelector('#to').value == ''){

      }else if(
        (target.querySelector('#from').value == '' && target.querySelector('#to').value != '') ||
        (target.querySelector('#to').value == '' && target.querySelector('#from').value != '')
      ){
        this.ac.snackbar('Clear or fill both fields for Batch!');
      }else if(
        target.querySelector('#from').value.length != 4 ||
        target.querySelector('#to').value.length != 4
      ){
        this.ac.snackbar('Check Batch filter!');
        return;
      }else{
        params['batch'] = target.querySelector('#from').value + '-' + target.querySelector('#to').value;
      }
      params['category'] = target.querySelector('#categoryA').value
      params['programme'] = target.querySelector('#programme').value
    }

    let filters = new URLSearchParams();
    for(let key in params){
      if((params[key] != '') || (!safe(params[key].toString())))
        filters.append(key, params[key]);
    }

    Object.keys(params).forEach((key) => (params[key] == '') && delete params[key]);
    this.router.navigate([window.location.pathname], { queryParams: params });
    this.getdata('?' + filters.toString());
  }

  downloadList(){
    let replace, headers, concat;
    if(window.location.pathname.includes('/home/academic')){
      this.fileName$ = 'Academic_Achievements.csv'
      headers = [
        'Name',
        'Enrollment No.',
        'Course',
        'Batch',
        'Category',
      ]
      replace = {
        'category':{
          'both': 'Gold Medalist & Exemplary Performance',
          'exemplary': 'Exemplary Performance',
          'goldmedalist': 'Gold Medalist',
        },
      }

    }else if(window.location.pathname.includes('/home/achievements')){
      this.fileName$ = 'Approved_Achievements.csv'
      headers = [
        'Semester',
        'Session From',
        'Event name',
        'Name',
        'Role',
        'Description',
        'Enrollment No.',
        'Shift',
        'Session To',
        'Section',
        'Department',
        'Date',
        // 'Rating',
        'Category',
        'Title',
        'Image Url',
        'Status',
        'Venue',
      ]
      replace = {
        'approved':{
          'true': 'Approved',
          'false': 'Unapproved',
        },
        'participated':{
          'true': 'Participated',
          'false': 'Oraganized',
        },
      }
      concat = {
        'imageUrl':'http://13.59.95.13:8081/',
      }

    }

    //Passing by value so that achievements are not modified.
    let data = JSON.parse(JSON.stringify(this.achievements$));
    let csv = this.data.objArrToCSV(data, replace, concat, headers);
    let blob = new Blob([csv], { type: 'text/csv' });

    let a = document.createElement("a");
    let blobURL = URL.createObjectURL(blob);
    a.download = this.fileName$;
    a.href = blobURL;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  }

}
