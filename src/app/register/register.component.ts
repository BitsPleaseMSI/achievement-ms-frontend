import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { safe } from '../sanitise';

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
    $('#registerUserLoading').show(50);
    event.preventDefault();

    const target = event.target;

    function validateEmail(email) {
      $('#registerUserLoading').hide(50);
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if(!validateEmail(target.querySelector('#email').value.trim())){
      $('#registerUserLoading').hide(50);
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
        target.querySelector('#firstName').value.trim(),
        target.querySelector('#lastName').value.trim(),
        target.querySelector('#department').value.trim(),
        target.querySelector('#shift').value.trim(),
        target.querySelector('#email').value.trim(),
        target.querySelector('#designation').value.trim(),
        target.querySelector('#password').value.trim(),
        target.querySelector('#code').value.trim(),
      );

      // Sanitising data
      for(let key in user){
        if((user[key] == '') || (!safe(user[key].toString()))){
          $('#registerUserLoading').hide(50);
          this.error$ = 'Input error. Please check ' + key;
          this.info$ = undefined;
          return;
        }
      }

      this.auth.register(user).subscribe(
        (data) => {
          if(data.bool){
            this.error$ = undefined;
            this.info$ = undefined;
            this.ac.snackbar('User successfully registered!')
            this.error$ = undefined;
          }else{
            this.error$ = data.message.toString()
          }
        },
        (error) =>{
          this.info$ = undefined;
          this.ac.snackbar('Server is not responding, Please try later.');
        }
      )
    }else{
      this.error$ = "New passwords do not match!";
      this.info$ = undefined;
    }

    $('#registerUserLoading').hide(50);
  }

}