import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
        if(data.bool){
          console.log(data.message)
          // Success redrect location
          window.location.href = "/"
          localStorage.setItem('token', data['token'].toString());
        }else{
          window.alert('Incorrect credentials.')
          console.log(data.message)
        }
      }
    )

  }

}
