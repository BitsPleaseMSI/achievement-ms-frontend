import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  achievements$: Object;

  getdata(){
    this.data.getUnapprovedAchievements()
    .subscribe(
      (data) => {
        console.log("the data " + data)
        this.achievements$ = data['data']
      });
  }

  constructor(private data: DataAccessService, private auth: AuthService) { }

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
        if(data['bool']){
          window.alert("Successfully approved!")
          this.getdata();
        }else{
          window.alert(data['messsage'])
        }
      }
    )

  }

}
