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

  constructor(private data: DataAccessService, private auth: AuthService) {}

  unapprovedAchievements$: Object;
  approvedAchievements$: Object;

  getdata(){

    this.auth.currentUser().subscribe(
      (data) => {
        this.data.getUnapprovedAchievements()
          .subscribe(
          (data) => {
          this.unapprovedAchievements$ = data['data']
        });

        this.data.getApprovedAchievements()
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
                window.alert("Successfully approved!")
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
                window.alert("Successfully unapproved!")
                this.getdata();
              }else{
                window.alert(data['messsage'])
              }
            }
          )
      }
    )

  }

}
