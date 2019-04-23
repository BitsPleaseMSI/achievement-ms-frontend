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
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  achievement$: any = {};
  user$: User;
  deleteId$: string;

  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router, private auth: AuthService, private ac: AppComponent, private loc: Location){
    this.data.getAchievement( this.route.snapshot.params['id'] ).then(
      (data) => {
        if(data){
          this.achievement$ = data;
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

  toggle_visibility(id) {
    $("#img-details").slideToggle(50);
  }

  delete(event){

    if(this.user$ && ((this.user$.department != this.achievement$.department) || ((this.user$.shift != this.achievement$.shift)))){
      this.ac.snackbar('This achievement is not under your department.');
      return;
    }

    $("#deleteAchievementLoading").show(50);
    event.preventDefault();
    this.data.deleteAchievement(this.achievement$._id).subscribe(
      (data) => {
        if(data['bool']){
          this.ac.snackbar('Deleted successfully!')
          this.loc.back();
        }else{
          this.ac.snackbar('Delete unsuccessful!');
        }
        $('#deleteModal .close').click();
        $("#deleteAchievementLoading").hide(50);
      },
      () =>{
        this.ac.snackbar('Server is not responding, Please try later.');
        $('#deleteModal .close').click();
        $("#deleteAchievementLoading").hide(50);
      }
    )

  }

  approve(event, id: string){
    event.preventDefault();
    // $('#changeDetApproveLoading').show(50);
    event.preventDefault();

    this.auth.approveAchievement(id).subscribe(
      (data) => {
        if(data['bool']){
          this.loc.back();
          this.ac.snackbar('Approved successfully!');
          window.location.reload();
        }else{
          this.ac.snackbar(data['message']);
        }
        // $('#changeApproveLoading').hide(50);
      },
      () =>{
        this.ac.snackbar('Server is not responding, Please try later.');
        // $('#changeApproveLoading').hide(50);
      }
    )


  }

  unapprove(event, id: string){
    event.preventDefault();

    this.auth.unapproveAchievement(id).subscribe(
      (data) => {
        if(data['bool']){
          this.loc.back();
          this.ac.snackbar('Unapproved successfully!')
          window.location.reload();
        }else{
          this.ac.snackbar(data['message'])
        }
        $('#changeApproveLoading').hide(50);
      },
      () =>{
        this.ac.snackbar('Server is not responding, Please try later.');
        $('#changeApproveLoading').hide(50);
      }
    )
  }

}
