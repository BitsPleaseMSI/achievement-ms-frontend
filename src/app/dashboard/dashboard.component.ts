import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { safe } from '../sanitise';
import * as $ from 'jquery';

interface Window {
    length: any;
    location: any;
}

interface Achievement {
    length: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  achievements$: Achievement;
  editId$: string;
  deleteId$: string;
  error$: string;
  info$: string;
  fileName$: string;

  constructor(private data: DataAccessService, private auth: AuthService, public router: Router, public route: ActivatedRoute, private ac: AppComponent) {
    // DO NOT REMOVE route DECLERATION. It is being used in the template.
    this.achievements$ = [];
  }

  ngOnInit(){
    this.achievements$ = [];
    this.refresh(window.location.search);

    $('#filters').hide(50);
    $('#b').click(function(){
      $('#filters').toggle('fast');
    });
  }

  refresh(arg?: string){
    $('#dashboardLoading').show(50);
    $('#dashboardEmpty').hide(50);
    $('#downloadList').hide(50);
    this.achievements$ = [];
    let params = undefined;
    if(arg){
      params = arg;
    }else{
      params = window.location.search;
    }

    if(this.router.url.includes('/dashboard/approved')){
      if(params==''){
        params='?';
      }

      this.auth.currentUser().subscribe(
        (user) => {
          params += '&department=' +  user.department;
          params += '&shift=' +  user.shift;
          this.data.getApprovedAchievements(params)
          .subscribe(
            (data) => {
              // Sorting according to date (newest first)
              data.sort(function(a, b){
                return b.date.split('-').join('') - a.date.split('-').join('');
              });

              this.achievements$ = data;
              if(this.achievements$.length == 0){
                $('#dashboardEmpty').show(50);
              }else{
                $('#downloadList').show(50);
              }
              $('#dashboardLoading').hide(50);
          },
          () =>{
            this.ac.snackbar('Server is not responding, Please try later.');
            $('#dashboardLoading').hide(50);
          });
        }
      )

    }else if(this.router.url.includes('/dashboard/unapproved')){
      if(params==''){
        params='?';
      }

      this.data.getUnapprovedAchievements(params)
      .subscribe(
        (data) => {
          // Sorting according to date (newest first)
          data['data'].sort(function(a, b){
            return b.date.split('-').join('') - a.date.split('-').join('');
          });

          this.achievements$ = data['data'];
          if(this.achievements$.length == 0){
            $('#dashboardEmpty').show(50);
          }else{
            $('#downloadList').show(50);
          }
          $('#dashboardLoading').hide(50);
        },
        () =>{
          this.ac.snackbar('Server is not responding, Please try later.');
          $('#dashboardLoading').hide(50);
        });

    }else if(this.router.url.includes('/dashboard/academic')){

      this.data.getAcademic(params)
      .subscribe(
        (data) => {
          this.achievements$ = data;
          if(this.achievements$.length == 0){
            $('#dashboardEmpty').show(50);
          }else{
            $('#downloadList').show(50);
          }
          $('#dashboardLoading').hide(50);
        },
        () =>{
          this.ac.snackbar('Server is not responding, Please try later.');
          $('#dashboardLoading').hide(50);
      });

    }

  }

  resetFilters(event){
    event.preventDefault();
    (document.getElementById('filter') as HTMLFormElement).reset();
    this.router.navigate([this.router.url]).then(
      () => {
        this.refresh('');
      }
    );
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};

    if (!this.router.url.includes('/dashboard/academic')) {
      params['sessionFrom'] = target.querySelector('#sessionFrom').value
      params['sessionTo'] = target.querySelector('#sessionTo').value
      params['dateFrom'] = target.querySelector('#dateFrom').value
      params['dateTo'] = target.querySelector('#dateTo').value
      params['rollNo'] = target.querySelector('#rollNo').value
      params['section'] = target.querySelector('#section').value
      params['semester'] = target.querySelector('#semester').value
      // params['shift'] = target.querySelector('#shift').value
      params['category'] = target.querySelector('#category').value

    }else if(this.router.url.includes('/dashboard/academic')){
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
      if(params[key] != '')
        filters.append(key, params[key]);
    }

    Object.keys(params).forEach((key) => (params[key] == '') && delete params[key]);
    this.router.navigate([this.router.url], { queryParams: params });
    this.refresh('?'+filters.toString());

  }

  approve(event, id: string){
    $('#changeApproveLoading' + id).show(50);
    event.preventDefault();

    this.auth.approveAchievement(id).subscribe(
      (data) => {
        if(data['bool']){
          this.refresh();
          this.ac.snackbar('Approved successfully!')
        }else{
          this.ac.snackbar(data['message'])
        }
        $('#changeApproveLoading' + id).hide(50);
      },
      () =>{
        this.ac.snackbar('Server is not responding, Please try later.');
        $('#changeApproveLoading' + id).hide(50);
      }
    )
    return ;

  }

  unapprove(event, id: string){
    $('#changeApproveLoading' + id).show(50);
    event.preventDefault();

    this.auth.unapproveAchievement(id).subscribe(
      (data) => {
        if(data['bool']){
          this.refresh();
          this.ac.snackbar('Unapproved successfully!')
        }else{
          this.ac.snackbar(data['message'])
        }
        $('#changeApproveLoading' + id).hide(50);
      },
      () =>{
        this.ac.snackbar('Server is not responding, Please try later.');
        $('#changeApproveLoading' + id).hide(50);
      }
    )
  }

  setAcademicDeleteId(event, id: string){
    event.preventDefault();
    this.deleteId$ = id;
  }

  deleteAcademic(event){
    $("#deleteAcademicLoading").show(50);
    event.preventDefault();
    this.data.deleteAcademic(this.deleteId$).subscribe(
      (data) => {
        if(data['partialText']){
          if(JSON.parse(data['partialText'])['bool']){
            this.ac.snackbar('Achievement deleted Successfully!');
            this.refresh();
          }
        }
        $("#deleteAcademicLoading").hide(50);
        $('#deleteAcademicModal .close').click();
      },
      () =>{
        this.ac.snackbar('Server is not responding, Please try later.');
        $("#deleteAcademicLoading").hide(50);
        $('#deleteAcademicModal .close').click();
        this.refresh();
      }
    )
  }

  editAcademicForm(event, achievement: Object){
    event.preventDefault();
    (document.getElementById('nameA') as HTMLInputElement).value = achievement['name'];
    (document.getElementById('rollNoA') as HTMLInputElement).value = achievement['rollNo'];
    (document.getElementById('from') as HTMLInputElement).value = achievement['batch'].split('-')[0];
    (document.getElementById('to') as HTMLInputElement).value = achievement['batch'].split('-')[1];
    (document.getElementById('programme') as HTMLInputElement).value = achievement['programme'];
    (document.getElementById('category') as HTMLInputElement).value = achievement['category'];
    this.editId$ = achievement['_id'];
  }

  editAcademic(event){
    $('#editAcademicLoading').show(50);
    event.preventDefault();
    const target = event.target;

    let achievement = new Object;
    achievement['name'] = target.querySelector('#nameA').value;
    achievement['rollNo'] = target.querySelector('#rollNoA').value;
    achievement['batch'] = target.querySelector('#from').value + '-' + target.querySelector('#to').value;
    achievement['programme'] = target.querySelector('#programme').value;
    achievement['category'] = target.querySelector('#category').value;
    achievement['id'] = this.editId$;

    // Sanitising data
    for(let key in achievement){
      if((achievement[key] == '') || (!safe(achievement[key].toString()))){
        this.error$ = 'Input error. Please check ' + key;
        this.info$ = undefined;
        $('#editAcademicLoading').hide(50);
        return;
      }
    }

    let error = true;
    this.data.editAcademic(achievement).subscribe(
      data => {
        if(data['partialText']){
          if(JSON.parse(data['partialText'])['bool']){
            error = false;
            this.ac.snackbar('Achievement edited Successfully!');
            this.info$ = 'Achievement edited Successfully.';
            this.error$ = undefined;
          }
        }
        $('#editAcademicLoading').hide(50);
      },
      () =>{
        this.info$ = undefined;
        this.ac.snackbar('Server is not responding, Please try later.');
        $('#editAcademicLoading').hide(50);
      }
    )

    setTimeout(function () {
      if(error){
        setTimeout('', 5000);
        this.info$ = undefined;
        this.error$ = 'Error uploading data. Please try again later.';
      }
    }, 8000);

    this.refresh();
  }

  downloadList(){
    let replace, headers, concat;
    if(this.router.url.includes('academic')){
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

    }else{
      if(this.router.url.includes('/approved')){
        this.fileName$ = 'Approved_Non-Academic_Achievements.csv'
      }else if(this.router.url.includes('/unapproved')){
        this.fileName$ = 'Unapproved_Non-Academic_Achievements.csv'
      }
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
