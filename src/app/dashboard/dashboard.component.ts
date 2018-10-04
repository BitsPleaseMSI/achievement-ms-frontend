import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  achievements$: Object;

  constructor(private data: DataAccessService) { }

  ngOnInit() {
    this.data.getUnapprovedAchievements()
    .subscribe(
      (data) => {
        console.log("the data " + data)
        this.achievements$ = data['data']
      });
  }
  /*
  approve(event){
    event.preventDefault();
    const target = event.target;

    this.auth.approveAchievement(
      target.querySelector('#email').value,
      target.querySelector('#password').value
    ).subscribe(
      (data) => {
        // Successful login
        if(data.bool){
          if(this.saveUser$){
            console.log('save')
          }
          localStorage.setItem('token', data['token'].toString());
          window.location.href = "/"
        }else{
          // Access denied
          console.log(data.message.toString())
          this.error$ = "Incorrect credentials"
        }
      }
    )

  }
  */
}
