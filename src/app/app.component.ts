import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
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
  constructor(private auth: AuthService) {
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

  logout(){
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.userData$ = undefined;
    this.snackbar('Logged out successfully!');
  }

}
