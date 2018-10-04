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

  constructor(private data: DataAccessService, private auth: AuthService) { }
  unapprovedAchievements$: Object;
  approvedAchievements$: Object;

  getdata(){

    this.data.getUnapprovedAchievements()
    .subscribe(
      (data) => {
        this.unapprovedAchievements$ = data['data']
      });

    this.data.getApprovedAchievements()
    .subscribe(
      (data) => {
        console.log(data);
        this.approvedAchievements$ = data
      });

  }

  ngOnInit() {
    this.getdata();
  }

  approve(event, id: string){
    event.preventDefault();
    const target = event.target;

    let token: string;
    token = localStorage.getItem('token');

    this.auth.approveAchievement(id, token).subscribe(
      (data) => {
        console.log(data)
        if(data['bool']){
          window.alert("Successfully approved!")
          this.getdata();
        }else{
          window.alert(data['messsage'])
        }
      }
    )

  }

  unapprove(event, id: string){
    event.preventDefault();
    const target = event.target;

    let token: string;
    token = localStorage.getItem('token');

    this.auth.unapproveAchievement(id, token).subscribe(
      (data) => {
        console.log(data)
        if(data['bool']){
          window.alert("Successfully unaproved!")
          this.getdata();
        }else{
          window.alert(data['messsage'])
        }
      }
    )

  }

}
