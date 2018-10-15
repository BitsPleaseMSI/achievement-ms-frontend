import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  error$: string;
  info$: string;

  constructor(private auth: AuthService, private router: Router, private ac: AppComponent) { }

  ngOnInit() {}

  registerUser(event){
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

    if(
      target.querySelector('#password').value == target.querySelector('#password2').value
    ){
      let user = new User(
        target.querySelector('#firstName').value,
        target.querySelector('#lastName').value,
        target.querySelector('#department').value,
        target.querySelector('#email').value,
        target.querySelector('#password').value,
        target.querySelector('#code').value,
      );

      this.auth.register(user).subscribe(
        (data) => {
          if(data.bool){
            this.router.navigate(['login']);
            this.error$ = undefined;
            this.info$ = undefined;
            this.ac.snackbar('User successfully registered!')
            this.error$ = undefined;
          }else{
            console.log(data)
            this.error$ = data.message.toString()
          }
        }
      )
    }else{
      this.error$ = "New passwords do not match!";
      this.info$ = undefined;
    }

  }

}
