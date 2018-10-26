import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataAccessService } from '../data-access.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';

interface User {
    department: any;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  achievement$: any = {};
  user$: User;

  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router, private auth: AuthService, private ac: AppComponent, private loc: Location){
    this.data.getAchievement( this.route.snapshot.params['id'] ).then(
      (data) => {
        if(data){
          this.achievement$ = data;
        }else{
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

  delete(event, id: string){
    event.preventDefault();
    if(window.confirm('Sure you want to delete this?')){
      this.data.deleteAchievement(id).subscribe(
        (data) => {
          if(data['bool']){
            this.ac.snackbar('Deleted successfully!')
            this.loc.back();
          }else{
            this.ac.snackbar('Delete unsuccessful!');
          }
        },
        () =>{
          this.ac.snackbar('Server is not responding, Please try later.');
        }
      )
    }

  }

}
