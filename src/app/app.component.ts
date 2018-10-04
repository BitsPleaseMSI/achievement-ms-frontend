import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { Achievement } from './achievement';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'achievement-ms-front';

  userData$: Object;

  getdata(){
    if( localStorage.getItem('token') ) {
      this.auth.isValid(localStorage.getItem('token')).subscribe(
        (data) => {
          this.userData$ = data;
        }
      )
    }else{ this.userData$ = null; }

  }

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.getdata();
  }

  logout(){
    localStorage.removeItem('token');
    this.getdata();
  }

}
