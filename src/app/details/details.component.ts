import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';

interface Achievement {
    length: any;
    name: any;
    section: any;
    rollNo: any;
    shift: any;
    category: any;
    department: any;
    approved: any;
    approvedBy: any;
    date: any;
}

interface User {
    department: any;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  achievement$: Achievement;
  user$: User;

  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router, private auth: AuthService, private ac: AppComponent){}

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
