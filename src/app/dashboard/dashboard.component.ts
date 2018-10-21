import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { safe } from '../sanitise';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  achievements$: Object;
  editId$: string;
  user: Object;
  w$: Object = window;
  error$: string;
  info$: string;

  constructor(private data: DataAccessService, private auth: AuthService, private router: Router, private route: ActivatedRoute, private ac: AppComponent) {
    this.achievements$ = [];
    this.auth.currentUser().subscribe(
      (user) => {

      },
      (error) =>{
        this.auth.redirect('home', 'You are not authorised. Please login to continue!')
        return;
      }
    )
  }

  ngOnInit(){
    this.achievements$ = [];
    this.refresh(window.location.search);

    let params = this.route.snapshot.queryParams;

    for(let key in params){
      if((params[key] != '') || (!safe(params[key].toString()))){
        let target = document.getElementById(key) as HTMLFormElement;
        target.value = params[key];
      }
    }

    $('#filters').hide();

    $('#b').click(function(){
      $('#filters').slideToggle( 400 );
    });
  }

  refresh(arg?: string){
    this.achievements$ = [];
    let params = '';
    if(arg)
      params = arg;

    if(window.location.pathname == '/dashboard/approved'){
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
          },
          (error) =>{
            this.ac.snackbar('Server is not responding, Please try later.');
          });
        },
        (error) =>{
          this.auth.redirect('home', 'You are not authorised. Please login to continue!')
        }
      )

    }else if(window.location.pathname == '/dashboard/unapproved'){
      if(params==''){
        params='?';
      }

      this.auth.currentUser().subscribe(
        (user) => {
          this.data.getUnapprovedAchievements(params)
          .subscribe(
            (data) => {
              this.achievements$ = data['data'];
            },
            (error) =>{
              this.ac.snackbar('Server is not responding, Please try later.');
            });
        },
        (error) =>{
          this.auth.redirect('home', 'You are not authorised. Please login to continue!')
        }
      )
    }else if(window.location.pathname == '/dashboard/academic'){
      if(params==''){
        params='?';
      }

      this.auth.currentUser().subscribe(
        (user) => {
          this.data.getAcademic()
          .subscribe(
            (data) => {
              this.achievements$ = data;
            },
            (error) =>{
              this.ac.snackbar('Server is not responding, Please try later.');
          });
        },
        (error) =>{
          this.auth.redirect('home', 'You are not authorised. Please login to continue!')
        }
      )

    }

  }

  resetFilters(event){
    event.preventDefault();
    let target = document.getElementById('filter') as HTMLFormElement;
    target.reset();
    this.router.navigate([window.location.pathname]);
    this.refresh();
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};
    params['sessionFrom'] = target.querySelector('#sessionFrom').value
    params['sessionTo'] = target.querySelector('#sessionTo').value
    params['dateFrom'] = target.querySelector('#dateFrom').value
    params['dateTo'] = target.querySelector('#dateTo').value
    params['rollNo'] = target.querySelector('#rollNo').value
    params['section'] = target.querySelector('#section').value
    params['semester'] = target.querySelector('#semester').value
    params['shift'] = target.querySelector('#shift').value
    params['category'] = target.querySelector('#category').value

    let filters = new URLSearchParams();
    for(let key in params){
      if(params[key] != '')
        filters.append(key, params[key]);
    }
    Object.keys(params).forEach((key) => (params[key] == '') && delete params[key]);
    this.router.navigate([window.location.pathname], { queryParams: params });
    this.refresh('?'+filters.toString());
    // window.location.href = window.location.pathname + '?' + filters.toString();

  }

  approve(event, id: string){
    event.preventDefault();
    const target = event.target;

    this.auth.currentUser().subscribe(
      (data) => {
          if(!data['email']){
            this.auth.redirect('home', 'You are not authorised. Please login to continue!')
            return;
          }

          this.auth.approveAchievement(id).subscribe(
            (data) => {
              if(data['bool']){
                this.refresh();
                this.ac.snackbar('Approved successfully!')
              }else{
                this.ac.snackbar(data['message'])
              }
            },
            (error) =>{
              this.ac.snackbar('Server is not responding, Please try later.');
            }
          )
      }
    )

  }

  unapprove(event, id: string){
    event.preventDefault();
    const target = event.target;

    this.auth.currentUser().subscribe(
      (data) => {
          if(!data['email']){
            this.auth.redirect('home', 'You are not authorised. Please login to continue!')
            return;
          }

          this.auth.unapproveAchievement(id).subscribe(
            (data) => {
              if(data['bool']){
                this.refresh();
                this.ac.snackbar('Unapproved successfully!')
              }else{
                this.ac.snackbar(data['message'])
              }
            },
            (error) =>{
              this.ac.snackbar('Server is not responding, Please try later.');
            }
          )
      }
    )

  }

  deleteAcademic(event, id: string){
    event.preventDefault();
    if(window.confirm('Sure you want to delete this?')){
      this.data.deleteAcademic(id).subscribe(
        (data) => {
          if(data['partialText']){
            if(JSON.parse(data['partialText'])['bool']){
              this.ac.snackbar('Achievement deleted Successfully!');
            }
          }
        },
        (error) =>{
          this.ac.snackbar('Server is not responding, Please try later.');
        }
      )
      this.refresh();
    }
  }

  editAcademicForm(event, achievement: Object){
    event.preventDefault();
    (document.getElementById('nameA') as HTMLInputElement).value = achievement['name'];
    (document.getElementById('rollNoA') as HTMLInputElement).value = achievement['rollNo'];
    (document.getElementById('from') as HTMLInputElement).value = achievement['batch'].split('-')[0];
    (document.getElementById('to') as HTMLInputElement).value = achievement['batch'].split('-')[1];
    (document.getElementById('programme') as HTMLInputElement).value = achievement['programme'];
    this.editId$ = achievement['_id'];
  }

  editAcademic(event){
    event.preventDefault();
    const target = event.target;

    let achievement = new Object;
    achievement['name'] = target.querySelector('#nameA').value;
    achievement['rollNo'] = target.querySelector('#rollNoA').value;
    achievement['batch'] = target.querySelector('#from').value + '-' + target.querySelector('#to').value;
    achievement['programme'] = target.querySelector('#programme').value;
    achievement['id'] = this.editId$;

    // Sanitising data
    for(let key in achievement){
      if((achievement[key] == '') || (!safe(achievement[key].toString()))){
        this.error$ = 'Input error. Please check ' + key;
        this.info$ = undefined;
        return;
      }
    }

    let error = true;
    this.data.editAcademic(achievement).subscribe(
      data => {
        console.log(data);
        if(data['partialText']){
          if(JSON.parse(data['partialText'])['bool']){
            error = false;
            this.ac.snackbar('Achievement edited Successfully!');
            this.info$ = 'Achievement edited Successfully.';
            this.error$ = undefined;
          }
        }
      },
      (error) =>{
        this.info$ = undefined;
        this.ac.snackbar('Server is not responding, Please try later.');
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
