import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  achievement$: Object;
  user$: Object;
  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router, private auth: AuthService, private ac: AppComponent) {
    this.achievement$ = {};
    this.user$ = {};
  }

  ngOnInit() {
    this.auth.currentUser().subscribe(
      (data) => {
        this.user$ = data;
      }
    )

    this.data.getAchievement( this.route.snapshot.params['id'] ).subscribe(
      (data) => {
        if(data)
          this.achievement$ = data;
        else
          this.router.navigate(['home']);
      },
      (error) =>{
        this.ac.snackbar('Server is not responding, Please try later.');
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
            this.router.navigate(['/dashboard/unapproved']);
          }else{
            this.ac.snackbar('Delete unsuccessful!');
          }
        },
        (error) =>{
          this.ac.snackbar('Server is not responding, Please try later.');
        }
      )
    }

  }

}
