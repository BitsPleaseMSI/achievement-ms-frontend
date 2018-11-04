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
  user: Object;
  w$: Window = window;
  error$: string;
  info$: string;

  constructor(private data: DataAccessService, private auth: AuthService, private router: Router, private route: ActivatedRoute, private ac: AppComponent) {
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
    this.achievements$ = [];
    let params = undefined;
    if(arg){
      params = arg;
    }else{
      params = window.location.search;
    }

    if(window.location.pathname.includes('/dashboard/approved')){
      if(params==''){
        params='?';
      }

      this.auth.currentUser().subscribe(
        (user) => {
          params += '&department=' +  user.department;
          this.data.getApprovedAchievements(params)
          .subscribe(
            (data) => {
              this.achievements$ = data;
              if(this.achievements$.length == 0){
                $('#dashboardEmpty').show(50);
              }
              $('#dashboardLoading').hide(50);
          },
          () =>{
            this.ac.snackbar('Server is not responding, Please try later.');
            $('#dashboardLoading').hide(50);
          });
        }
      )

    }else if(window.location.pathname.includes('/dashboard/unapproved')){
      if(params==''){
        params='?';
      }

      this.data.getUnapprovedAchievements(params)
      .subscribe(
        (data) => {
          this.achievements$ = data['data'];
          if(this.achievements$.length == 0){
            $('#dashboardEmpty').show(50);
          }
          $('#dashboardLoading').hide(50);
        },
        () =>{
          this.ac.snackbar('Server is not responding, Please try later.');
          $('#dashboardLoading').hide(50);
        });

    }else if(window.location.pathname.includes('/dashboard/academic')){

      this.data.getAcademic(params)
      .subscribe(
        (data) => {
          console.log('data.length')
          console.log(data.length)
          this.achievements$ = data;
          if(this.achievements$.length == 0){
            $('#dashboardEmpty').show(50);
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
    this.router.navigate([window.location.pathname]).then(
      () => {
        this.refresh('');
      }
    );
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};

    if (!window.location.pathname.includes('/dashboard/academic')) {
      params['sessionFrom'] = target.querySelector('#sessionFrom').value
      params['sessionTo'] = target.querySelector('#sessionTo').value
      params['dateFrom'] = target.querySelector('#dateFrom').value
      params['dateTo'] = target.querySelector('#dateTo').value
      params['rollNo'] = target.querySelector('#rollNo').value
      params['section'] = target.querySelector('#section').value
      params['semester'] = target.querySelector('#semester').value
      params['shift'] = target.querySelector('#shift').value
      params['category'] = target.querySelector('#category').value

    }else if(window.location.pathname.includes('/dashboard/academic')){
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

    console.log('params');
    console.log(params);

    Object.keys(params).forEach((key) => (params[key] == '') && delete params[key]);
    this.router.navigate([window.location.pathname], { queryParams: params });
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
        console.log(data);
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

}
