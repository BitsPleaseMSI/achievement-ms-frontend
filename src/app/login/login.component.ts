import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

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
    this.info$ = "Logging in, Please wait."

    event.preventDefault();
    const target = event.target;

    this.auth.login(
      target.querySelector('#email').value,
      target.querySelector('#password').value
    ).subscribe(
      (data) => {
        console.log('got data')
        this.trylater = false;
        // Successful login
        if(data.bool){
          if(target.querySelector('#saveUser').checked){
            localStorage.setItem('token', data['token'].toString());
          }else{
            sessionStorage.setItem('token', data['token'].toString());
          }
          this.ac.snackbar('Logged in Successfully!');
          this.router.navigate(['/dashboard/unapproved']);
          this.ac.getdata()
        }else{
          // Access denied
          console.log(data)
          this.info$ = undefined;
          this.error$ = "Incorrect credentials";
        }
      },
      (error) =>{
        this.info$ = undefined;
        this.ac.snackbar('Server is not responding, Please try later.');
      }
    )

  }

}
