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

  constructor(private data: DataAccessService, private auth: AuthService, private router: Router, private route: ActivatedRoute, private ac: AppComponent) {
    this.achievements$ = [];
  }

  refresh(arg?: string){
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
              this.achievements$ = data
          },
          (error) =>{
            this.ac.snackbar('Server is not responding, Please try later.');
          });
        },
        (error) =>{
          this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
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
              this.achievements$ = data['data']
            },
            (error) =>{
              this.ac.snackbar('Server is not responding, Please try later.');
            });
        },
        (error) =>{
          this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
        }
      )
    }

  }

  ngOnInit(){
    console.log(window.location.search)
    console.log(this.route.snapshot.queryParams)
    this.achievements$ = [];
    this.refresh(window.location.search);

    let params = this.route.snapshot.queryParams;
    let filters = new URLSearchParams();

    for(let key in params){
      if((params[key] != '') || (!safe(params[key].toString()))){
        let target = document.getElementById(key) as HTMLFormElement;
        target.value = params[key];
      }
    }

    $('#filters').hide();

    $('#b').click(function(){
      $('#filters').toggle('fadeout');
    });
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
            this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
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
            this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
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

}
