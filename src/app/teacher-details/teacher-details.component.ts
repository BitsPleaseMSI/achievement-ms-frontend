import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataAccessService } from '../data-access.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';
import * as $ from 'jquery';
import { refreshDescendantViews } from '@angular/core/src/render3/instructions';

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
  serverResponse: any = [];
  user$: User;
  tName$: string;
  deleteId$: string;

  
  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router, private auth: AuthService, private ac: AppComponent, private loc: Location) {
    this.data.getTAchievement( this.route.snapshot.params['id'] ).then(
      (data) => {
        if(data){
          this.serverResponse = data["achs"];
          this.tName$ = data["user"]["firstName"] + " " + data["user"]["lastName"];
          this.achievement$ = data["achs"];
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


  refreshList(){
    // Remove deleted achievement from memory
    // WARNING Only call when achievement successfuly deleted from server
    var delid = this.deleteId$
    this.achievement$ = this.achievement$.filter(function(value, index, arr){
      return value._id != delid;
    });
  }


  delete(event){
    event.preventDefault();
    this.data.deleteTAchievement(this.deleteId$).subscribe(
      (data) => {
        if(data['bool']){
          this.refreshList()
          this.ac.snackbar('Achievement deleted Successfully!');
        }else{
          this.ac.snackbar(data['message']);
        }
      },
      () =>{
        this.ac.snackbar('Server is not responding, Please try later.');
      }
    )
  }


  resetFilters(event){
    event.preventDefault();
    this.achievement$ = this.serverResponse;
  }


  filter(event){
    event.preventDefault();
    const target = event.target;

    let taType = target.querySelector('#taType').value.trim()

    this.achievement$ = this.serverResponse.filter(function(value, index, arr){
      return value.taType == taType;
    });

  }


}
