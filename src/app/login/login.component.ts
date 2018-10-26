import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { safe } from '../sanitise';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  error$: string;
  info$: string;
  trylater: boolean;

  constructor(private auth: AuthService, private ac: AppComponent, private router: Router) {
    this.trylater = true;
  }

  ngOnInit() {
    this.trylater = true;
  }

  loginUser(event){
    this.error$ = undefined;
    this.info$ = "Logging in, Please wait.";

    event.preventDefault();
    const target = event.target;

    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if(!validateEmail(target.querySelector('#email').value)){
      this.info$ = undefined;
      this.error$ = "Invalid Email";
      return;
    }else{
      this.error$ = undefined;
    }

    // Sanitising data
    if((target.querySelector('#email').value == '') || (!safe(target.querySelector('#email').value.toString()))){
      this.error$ = 'Input error. Please check username';
      this.info$ = undefined;
      return;
    }
    if((target.querySelector('#password').value == '') || (!safe(target.querySelector('#password').value.toString()))){
      this.error$ = 'Input error. Please check password';
      this.info$ = undefined;
      return;
    }

    this.auth.login(
      target.querySelector('#email').value,
      target.querySelector('#password').value
    ).subscribe(
      (data) => {
        this.trylater = false;
        if(data.bool){
          if(target.querySelector('#saveUser').checked){
            localStorage.setItem('token', data['token'].toString());
          }else{
            sessionStorage.setItem('token', data['token'].toString());
          }
          this.ac.snackbar('Logged in Successfully!');
          this.ac.getdata();
          this.router.navigate(['/dashboard/unapproved']);
        }else{
          this.info$ = undefined;
          this.error$ = "Incorrect credentials";
        }
      },
      () =>{
        this.info$ = undefined;
        this.ac.snackbar('Server is not responding, Please try later.');
      }
    )

  }

}
