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

    if(
      target.querySelector('#newpass').value == target.querySelector('#newpass1').value
    ){
      this.auth.reset(
        target.querySelector('#email').value,
        target.querySelector('#currentpass').value,
        target.querySelector('#newpass').value
      ).subscribe(
        (data) => {
          // Successful login
          if(data.bool){
            window.alert('Password reset successful!');
            this.router.navigate(['dashboard']);
          }else{
            // Access denied
            this.error$ = data.message.toString()
          }
        }
      )
    }else{
      this.error$ = "New passwords do not match!"
    }


  }

}
