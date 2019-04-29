import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataAccessService } from '../data-access.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';
import * as $ from 'jquery';

interface User {
  department: any;
  shift: any;
}

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: ['./teacher-details.component.css']
})
export class TeacherDetailsComponent implements OnInit {
  achievement$: any = [];
  user$: User;
  tName$: string;
  deleteId$: string;

  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router, private auth: AuthService, private ac: AppComponent, private loc: Location) {
    this.data.getTAchievement( this.route.snapshot.params['id'] ).then(
      (data) => {
        if(data){
          this.tName$ = data["user"]["firstName"] + " " + data["user"]["lastName"];
          this.achievement$ = data["achs"];

          console.log(this.achievement$)

          $('#detailLoading').hide(50);
        }
      },
      () =>{
        this.router.navigate(['home']);
        this.ac.snackbar('Achievement does not exist!');
      }
    )
  }

  ngOnInit() {
    this.auth.currentUser().subscribe(
      (data) => {
        this.user$ = data;
      }
    )
  }

  delete(event){
    
  }  

}
