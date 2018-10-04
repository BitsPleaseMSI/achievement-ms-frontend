import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { Achievement } from './achievement';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  constructor(private auth: AuthService) { }

  userData$: Object;
  title = 'achievement-ms-front';

  getdata(){
    if( localStorage.getItem('token') ) {
      this.auth.isValid(localStorage.getItem('token')).subscribe(
        (data) => {
          this.userData$ = data;
        }
      )
    }else{ this.userData$ = null; }

  }

  ngOnInit() {
    this.getdata();
  }

  logout(){
    localStorage.removeItem('token');
    this.getdata();
  }

}
