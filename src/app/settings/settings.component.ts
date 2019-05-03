import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { safe } from '../sanitise';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  error$: string;
  info$: string;
  constructor(private auth: AuthService, private router: Router, private ac: AppComponent) { }

  ngOnInit() {
    this.auth.currentUser().subscribe(
      (data) => {
        (document.getElementById('firstName') as HTMLInputElement).value = data['firstName'];
        (document.getElementById('lastName') as HTMLInputElement).value = data['lastName'];
        (document.getElementById('newEmail') as HTMLInputElement).value = data['email'];
        (document.getElementById('designation') as HTMLInputElement).value = data['designation'];
        (document.getElementById('password') as HTMLInputElement).value = '';
      },
      (error) => {
        this.ac.snackbar('Server is not responding, Please try later.');
      }
    )
  }

  resetForm(event){
    event.preventDefault();
    this.info$ = undefined;
    this.error$ = undefined;
    this.auth.currentUser().subscribe(
      (data) => {
        (document.getElementById('firstName') as HTMLInputElement).value = data['firstName'];
        (document.getElementById('lastName') as HTMLInputElement).value = data['lastName'];
        (document.getElementById('newEmail') as HTMLInputElement).value = data['email'];
        (document.getElementById('designation') as HTMLInputElement).value = data['designation'];
        (document.getElementById('password') as HTMLInputElement).value = '';
      },
      (error) => {
        this.ac.snackbar('Server is not responding, Please try later.');
      }
    )
  }

  update(event){
    $('#updateLoading').show(50);
    event.preventDefault();
    const target = event.target;
    let params = {};

    this.auth.currentUser().subscribe(
      (data) => {
          if(!data['email']){
            this.auth.redirect('login', 'Unauthenticated user. Login again.');
          }else{

            params['firstName'] = target.querySelector('#firstName').value;
            params['lastName'] = target.querySelector('#lastName').value;
            params['email'] = data['email'];
            params['newEmail'] = target.querySelector('#newEmail').value;
            params['password'] = target.querySelector('#password').value;
            params['designation'] = target.querySelector('#designation').value;

            for(let key in params){
              if((params[key] == '') || (!safe(params[key].toString()))){
                $('#updateLoading').hide(50);
                this.error$ = 'Check ' + key;
                this.info$ = undefined;
                return;
              }
            }

            this.error$ = undefined;
            this.info$ = undefined;

            let error = true;
            this.auth.updateUser(params).subscribe(
              (data) => {
                if(data['body']){
                  if(JSON.parse(data['body'])['bool']){
                    error = false;
                    this.ac.snackbar('Profile updated successfully!');
                    this.error$ = undefined;
                    this.info$ = 'Profile updated successfully.';
                    this.ac.getdata();
                  }else if(!JSON.parse(data['body'])['bool']){
                    error = false;
                    this.ac.snackbar(JSON.parse(data['body'])['message']);
                    this.error$ = JSON.parse(data['body'])['message'];
                    this.info$ = undefined;
                  }
                }
              },
              () => {
                this.info$ = undefined;
                this.ac.snackbar('Server is not responding, Please try later.');
              }
            )

            setTimeout(function () {
              if(error){
                setTimeout('', 5000);
                this.error$ = 'Error updating profile. Please try again later.';
                this.info$ = undefined;
              }
            }, 2000);

          }

      }
    )

    $('#updateLoading').hide(50);
  }

}
