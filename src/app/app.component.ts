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
  message$: string;
  title = 'achievement-ms-front';

  constructor(private auth: AuthService, private router: Router) { }

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
  }

  logout(){
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.userData$ = undefined;
    this.router.navigate(['home']);
  }

}
