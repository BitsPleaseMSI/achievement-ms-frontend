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

  constructor(private data: DataAccessService, private auth: AuthService) {
    this.getdata();
  }

  unapprovedAchievements$: Object;
  approvedAchievements$: Object;

  getdata(params?: Object, sortBy?: string){
    if(!params)
      params = {};

    this.auth.currentUser().subscribe(
      (user) => {
        this.data.getUnapprovedAchievements()
          .subscribe(
          (data) => {
          this.unapprovedAchievements$ = data['data']
        });

        params['department'] = user.department

        this.data.getApprovedAchievements(params)
          .subscribe(
          (data) => {
          this.approvedAchievements$ = data
        });
      },
      (error) => {
        this.auth.redirect('', 'Unauthenticated user. Illegal activity logged!')
      }
    )

  }

  ngOnInit() {
    this.getdata();
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};

    if(target.querySelector('#sectionFilter').checked)
      params['section'] = target.querySelector('#section').value

    if(target.querySelector('#semesterFilter').checked)
      params['semester'] = target.querySelector('#semester').value

    if(target.querySelector('#shiftFilter').checked)
      params['shift'] = target.querySelector('#shift').value

    if(target.querySelector('#categoryFilter').checked)
      params['category'] = target.querySelector('#category').value

    this.getdata(params);
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
                this.getdata();
              }else{
                window.alert(data['messsage'])
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
                this.getdata();
              }else{
                window.alert(data['message'])
              }
            }
          )
      }
    )

  }

}
