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
  info$: string;

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

    this.auth.currentUser().subscribe(
      (data) => {

          if(!data['email']){
            this.auth.redirect('login', 'Unauthenticated user. Login again.')
          }else{
            this.auth.reset(
              data['email'],
              target.querySelector('#currentpass').value,
              target.querySelector('#newpass').value
            ).subscribe(
              (data) => {
                if(data.bool){
                  this.info$ = data.message.toString();
                  this.error$ = undefined;
                }else{
                  // Error while password reset
                  this.error$ = undefined;
                  this.error$ = data.message.toString()
                }
              }
            )
          }

      }
    )

  }

}
