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
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  achievements$: Achievement[];
  w$: Window = window;
  fileName$: string;
  dataLength$: number;
  limit: number;
  offset: number;
  table: any;
  error$: string;
  info$: string;

  constructor(private data: DataAccessService, public route: ActivatedRoute, public router: Router, private ac: AppComponent){
    this.achievements$ = [];
    this.limit = 10;
    this.offset = 0;
  }

  ngOnInit() {
    this.getdata(window.location.search);

    $('#filters').hide(50);
    $('#b').click(function(){
      $('#filters').toggle('fast');
    });
  }

  loadMore(event){
    event.preventDefault();
    this.offset+= this.limit;
    this.getdata(window.location.search);
  }

  getdata(params: string){
    $('#homeEmpty').hide(50);
    $('#downloadList').hide(50);
    $('#homeLoading').show(50);
    
    if(this.router.url.includes('/home/achievements')){
      
      this.data.getApprovedAchievements(this.limit, this.offset, params)
      .subscribe(
        (data) => {
          this.dataLength$ = data.length;

          // DO NOT REMOVE
          // Sorting accord ing to date (newest first)
          // data.sort(function(a, b){
          //   return b.date.split('-').join('') - a.date.split('-').join('');
          // });

          this.achievements$ = this.achievements$.concat(data);

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

    }else if(this.router.url.includes('/home/academic')){

      this.data.getAcademic(params)
      .subscribe(
        (data) => {
          this.dataLength$ = data.length;
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

    }else if(this.router.url.includes('/home/teacher-achievements')){

      this.data.getTAchievements(params)
      .then(
        (data) => {
          this.dataLength$ = data.length;
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
    this.achievements$ = [];
    this.offset = 0;
    this.getdata('');
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};

    if(this.router.url.includes('/home/achievements')){
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

    }else if(this.router.url.includes('/home/academic')){
      if(target.querySelector('#from').value == '' && target.querySelector('#to').value == ''){

      }else if(
        (target.querySelector('#from').value == '' && target.querySelector('#to').value != '') ||
        (target.querySelector('#to').value == '' && target.querySelector('#from').value != '')
      ){
        this.ac.snackbar('Clear or fill both fields for Batch!');
        return;
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
    this.achievements$ = [];
    this.offset = 0;
    this.getdata('?' + filters.toString());
  }
  
  downloadList(event?){

    this.info$ = undefined;
    this.error$ = undefined;

    let replace, headers, concat;

    if(event){
      event.preventDefault()
      let target = event.target;

      if (target.querySelector("#taType").value == "") {
        this.error$ = "Please select achievement type.";  
        this.info$ = undefined;  
        return;
      }

      let type = target.querySelector("#taType").value;
      
      let filters = new URLSearchParams();
      filters.append("taType", type)

      if (target.querySelector("#fromDate").value != "") {
        filters.append("fromDate", target.querySelector("#fromDate").value)
      }
      if (target.querySelector("#fromDate").value != "") {
        filters.append("toDate", target.querySelector("#toDate").value)
      }
      
      this.data.getTAchievements("?"+filters.toString())
      .then(
        (data) => {

          if (data.length == 0) {
            this.error$ = "No achievements found. Please adjust the filters.";  
            this.info$ = undefined;  
            return;
          }

          let achs = [];
          data.forEach(function (user) {
            user['achievements'].forEach(function (achievement) {

              let ach = {};

              // Order of adding keys MUST be maintained
              ach['name'] = user['firstName'] + " " + user['lastName']
              ach['designation'] = user['designation']

              if (achievement.hasOwnProperty('subType')){
                ach['subType'] = achievement['subType']
              }

              ach['international'] = achievement['international']

              if (achievement.hasOwnProperty('msi')){
                ach['msi'] = achievement['msi']
              }

              ach['topic'] = achievement['topic']

              if (achievement.hasOwnProperty('place')){
                ach['place'] = achievement['place']
              }

              if (achievement.hasOwnProperty('sponsored')){
                ach['sponsored'] = achievement['sponsored']
              }

              if (achievement.hasOwnProperty('published')){
                ach['published'] = achievement['published']
              }

              if (achievement.hasOwnProperty('reviewed')){
                ach['reviewed'] = achievement['reviewed']
              }

              ach['date'] = achievement['date']
              
              // Description is a must in all types
              if (achievement.hasOwnProperty('description')){
                ach['description'] = achievement['description']
              }else{
                ach['description'] = ''
              }

              achs.push(ach)
            });
          });
          
          this.fileName$ = 'Teacher Achievements.csv'

          if (type == 'Book'){
            headers = [
              'Name of faculty',
              'Designation',
              'Level',
              'Topic',
              'College',
              'Published',
              'Reviewed',
              'Date',
              'Description',
            ]
  
          }else if (type == 'Journal'){
            headers = [
              'Name of faculty',
              'Designation',
              'Level',
              'College',
              'Topic',
              'Published at (with ISSN No.)',
              'Reviewed',
              'Date',
              'Description',
            ]

          }else if (type == 'Conference'){
            headers = [
              'Name of faculty',
              'Designation',
              'Level',
              'College',
              'Topic',
              'Published',
              'Reviewed',
              'Date',
              'Description',
            ]

          }else if (type == 'SeminarAttended'){
            headers = [
              'Name of faculty',
              'Designation',
              'Type',
              'Level',
              'College',
              'Topic',
              'Place',
              'Sponsored',
              'Date',
              'Description',
            ]

          }

          replace = {
            'msi':{
              'true': 'MSI',
              'false': 'Other',
            },
            'international':{
              'true': 'International',
              'false': 'National',
            },
            'reviewed':{
              'true': 'Reviewed',
              'false': 'Not reviewed',
            },
            'sponsored':{
              'true': 'Sponsored',
              'false': 'Self funded',
            },
            'subType':{
              'SEMINAR': 'Seminar',
              'CONFERENCE': 'Conference',
              'WORKSHOP': 'Workshop',
            //'FDP': 'FDP', Kept for sake of completion.
              'FDP1WEEK': 'FDP one week or more',
            },
          }
          
          this.createCSV(achs, replace, concat, headers);

          this.info$ = "Successfully exported."
        },
        () =>{
          this.ac.snackbar('Server is not responding, Please try later.');
        });
        return;
      }
      
      if(this.router.url.includes('/home/academic')){
        this.fileName$ = 'Academic Achievements.csv'
        // var filters = window.location.search.substring(1).split('&');
        // var delim = '-';
        // for(let filter in filters){
          //   if(filters[filter]){
      //
      //   }
      //   this.fileName$ += delim + filters[filter];
      //   delim = ',';
      // }
      // this.fileName$ += '.csv';
      // console.log(this.fileName$);
      // return;

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

      this.createCSV(this.achievements$, replace, concat, headers);    

    }else if(this.router.url.includes('/home/achievements')){
      this.fileName$ = 'Non-Academic Achievements.csv'
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

      this.createCSV(this.achievements$, replace, concat, headers);    

    }

  }

  createCSV(table, replace, concat, headers){
    let csv = this.data.objArrToCSV(table, replace, concat, headers);
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