import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  achievements$: Object;

  constructor(private data: DataAccessService, private auth: AuthService) {
    this.achievements$ = [];
  }

  refresh(){
    if(window.location.pathname == '/dashboard/unapproved'){
      this.getUnapprovedAchievements(window.location.search);
    }else{
      this.getApprovedAchievements(window.location.search);
    }
  }

  getApprovedAchievements(params?: string){
    if(!params)
      params='?'
    this.auth.currentUser().subscribe(
      (user) => {
        params += '&department=' +  user.department;
        console.log('Params for approved in dashboard')
        console.log(params.toString())
        this.data.getApprovedAchievements(params)
          .subscribe(
          (data) => {
            this.achievements$ = data
          });
      },
      (error) => {
        this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
      }
    )
  }

  getUnapprovedAchievements(params?: string){
    if(!params)
      params=''
    this.auth.currentUser().subscribe(
      (user) => {
        this.data.getUnapprovedAchievements(params)
        .subscribe(
          (data) => {
            this.achievements$ = data['data']
          });
        },
        (error) => {
          this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
        }
    )
  }

  ngOnInit(){
    this.achievements$ = [];
    this.refresh();
  }

  resetFilters(event){
    event.preventDefault();
    let target = document.getElementById('filter') as HTMLFormElement;
    target.reset();
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
    window.location.href = window.location.pathname + '?' + filters.toString();

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
              }else{
                window.alert(data['message'])
              }
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
              }else{
                window.alert(data['message'])
              }
            }
          )
      }
    )

  }

}
