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

  constructor(private auth: AuthService) { }

  ngOnInit() {

    if( localStorage.getItem('token') ) {
      this.auth.isValid(localStorage.getItem('token')).subscribe(
        (data) => {
          this.userData$ = data;
        }
      )
    }

  }

  logout(){
    localStorage.removeItem('token');
    window.location.href='/'
  }

}
