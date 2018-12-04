import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { safe } from './sanitise';

import { AuthService } from './auth.service';
import * as $ from 'jquery';

interface Window {
    length: any;
    location: any;
    scrollTo: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('closeLogin') closeLogin: ElementRef;

  w$: Window = window;
  error$: string;
  info$: string;
  trylater: boolean;
  userData$: Object;
  message$: string;
  title = 'achievement-ms-front';
  date = new Date();
  constructor(private auth: AuthService, private router: Router) {
    console.log('AMS Version 32');
    setInterval(() => {
      this.date = new Date();
    }, 1000)
  }

  public snackbar(message: string){
    var x = document.getElementById("snackbar");
    this.message$ = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  getdata(){
    this.auth.currentUser().subscribe(
      (data) => {
        if( data['email'] ){
          this.userData$ = data;
        }
      }
    )
  }

  ngOnInit() {
    $('#loading').hide(50);
    this.getdata();

    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
      $(this).toggleClass('active');
    });

    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block";
        } else {
            document.getElementById("myBtn").style.display = "none";
        }
    }



  }

  loginUser(event){
    $('#loading').show(50);
    this.error$ = undefined;
    this.info$ = "Logging in, Please wait.";

    event.preventDefault();
    const target = event.target;

    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    if(!validateEmail(target.querySelector('#email').value)){
      $('#loading').hide(50);
      this.info$ = undefined;
      this.error$ = "Invalid Email";
      return;
    }else{
      this.error$ = undefined;
    }

    // Sanitising data
    if((target.querySelector('#email').value == '') || (!safe(target.querySelector('#email').value.toString()))){
      $('#loading').hide(50);
      this.error$ = 'Input error. Please check username';
      this.info$ = undefined;
      return;
    }
    if((target.querySelector('#password').value == '') || (!safe(target.querySelector('#password').value.toString()))){
      $('#loading').hide(50);
      this.error$ = 'Input error. Please check password';
      this.info$ = undefined;
      return;
    }

    this.auth.login(
      target.querySelector('#email').value,
      target.querySelector('#password').value
    ).subscribe(
      (data) => {
        if(data.bool){
          if(target.querySelector('#saveUser').checked){
            localStorage.setItem('token', data['token'].toString());
          }else{
            sessionStorage.setItem('token', data['token'].toString());
          }
          this.closeLogin.nativeElement.click();
          this.snackbar('Logged in Successfully!');
          this.info$ = undefined;
          this.error$ = undefined;
          this.getdata();
          this.router.navigate(['/dashboard/unapproved']);
        }else{
          this.info$ = undefined;
          this.error$ = "Incorrect credentials";
        }
        $('#loading').hide(50);
      },
      () =>{
        this.info$ = undefined;
        this.error$ = 'Server is not responding, Please try later.';
        this.snackbar('Server is not responding, Please try later.');
        $('#loading').hide(50);
      }
    )
  }

  logout(){
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.userData$ = undefined;
    this.snackbar('Logged out successfully!');
  }

}
