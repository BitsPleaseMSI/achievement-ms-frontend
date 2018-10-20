import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userData$: Object;
  message$: string;
  title = 'achievement-ms-front';
  date = new Date();
  constructor(private auth: AuthService, private router: Router) {
    setInterval(() => {
      this.date = new Date();
    }, 1000)
  }

  public snackbar(message: string){
    var x = document.getElementById("snackbar");
    this.message$ = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  getdata(){
    this.auth.currentUser().subscribe(
      (data) => {
        if( data['email'] )
          this.userData$ = data;
      }
    )
  }

  ngOnInit() {
    this.getdata();

    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');

    });
  }

  // Very inefficient but does the job!
  sleep(seconds)
  {
    var e = new Date().getTime() + (seconds * 1000);
    while (new Date().getTime() <= e) {}
  }

  logout(){
    this.sleep(2);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.userData$ = undefined;
    this.snackbar('Logged out successfully!');
    this.router.navigate(['home']);
  }

}
