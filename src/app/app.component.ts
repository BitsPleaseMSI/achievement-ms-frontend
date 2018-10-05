import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { Achievement } from './achievement';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  userData$: Object;
  title = 'achievement-ms-front';

  constructor(private auth: AuthService, private router: Router) { }

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
  }

  logout(){
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.userData$ = undefined;
    this.router.navigate(['']);
  }

}
