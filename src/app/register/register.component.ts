import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  error$: string;
  info$: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {}

  registerUser(event){
    event.preventDefault();

    const target = event.target;

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
            this.info$ = "Successfully added new user!";
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
