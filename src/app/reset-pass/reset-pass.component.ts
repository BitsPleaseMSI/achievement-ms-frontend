import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  error$: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {}

  resetPass(event){
    event.preventDefault();
    const target = event.target;
    let email = undefined;

    if( target.querySelector('#newpass').value != target.querySelector('#newpass1').value ){
      this.error$ = "New passwords do not match!"
      return;
    }

    // Do we have a token?
    if( localStorage.getItem('token') ) {

      // Is the token valid?
      this.auth.isValid(localStorage.getItem('token')).subscribe(
        (data) => {

          // Get email from user's token
          email = data['email']

          if( !(email) ){
            this.error$ = 'User not authenticated! Please log in again.'
            return;
          }

          // Reseting password
          this.auth.reset(
            email,
            target.querySelector('#currentpass').value,
            target.querySelector('#newpass').value
          ).subscribe(
            (data) => {
              if(data.bool){
                window.alert('Password reset successful!');
                this.router.navigate(['dashboard']);
              }else{
                // Error while password reset
                this.error$ = data.message.toString()
              }
            }
          )

        }
      )
    }else{
      // User does not have a token!
      this.error$ = 'User not authenticated! Please log in again.'
      return;
    }

  }

}
