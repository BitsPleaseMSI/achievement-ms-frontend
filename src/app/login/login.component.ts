import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  error$: string;
  saveUser$: boolean;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  loginUser(event){
    event.preventDefault();
    const target = event.target;

    this.auth.login(
      target.querySelector('#email').value,
      target.querySelector('#password').value
    ).subscribe(
      (data) => {
        // Successful login
        if(data.bool){
          if(this.saveUser$){
            console.log('save')
          }
          localStorage.setItem('token', data['token'].toString());
          window.location.href = "/"
        }else{
          // Access denied
          console.log(data.message.toString())
          this.error$ = "Incorrect credentials"
        }
      }
    )

  }

}
