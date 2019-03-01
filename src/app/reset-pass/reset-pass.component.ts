import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { safe } from '../sanitise';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  error$: string;
  info$: string;

  constructor(private auth: AuthService, private router: Router, private ac: AppComponent) { }

  ngOnInit() { }
  
  resetPass(event){
    event.preventDefault();
    this.info$ = undefined;
    this.error$ = undefined;
    const target = event.target;

    if((target.querySelector('#currentpass').value == '') || (!safe(target.querySelector('#currentpass').value.toString()))){
      this.error$ = 'Current password cannot be empty!';
      this.info$ = undefined;
      return;
    }
    if((target.querySelector('#newpass').value == '') || (!safe(target.querySelector('#newpass').value.toString()))){
      this.error$ = 'New password cannot be empty!';
      this.info$ = undefined;
      return;
    }
    if( target.querySelector('#newpass').value != target.querySelector('#newpass1').value ){
      this.error$ = "New passwords do not match!"
      this.info$ = undefined;
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
                  this.router.navigate(['/dashboard/unapproved']);
                  this.ac.snackbar('Password changed successfully!');
                  this.error$ = undefined;
                  this.info$ = undefined;
                }else{
                  // Error while password reset
                  this.error$ = 'Current password is Incorrect';
                  this.info$ = undefined;
                }
              },
              () =>{
                this.error$ = undefined;
                this.info$ = undefined;
                this.ac.snackbar('Server is not responding, Please try later.');
              }
            )
          }
          
      }
    )
  }

}
