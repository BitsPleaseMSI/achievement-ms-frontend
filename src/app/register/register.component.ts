import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  error$: string;

  constructor(private auth: AuthService) { }

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
            // Successful registration
            console.log(data.message.toString())
            window.location.href = "/login"
            window.alert("Successfully added new user!")
          }else{
            console.log(data.message.toString())
            this.error$ = data.message.toString()
          }
        }
      )
    }else{
      this.error$ = "New passwords do not match!"
    }

  }

}
