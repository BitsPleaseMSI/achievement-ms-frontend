import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  achievement$: Object;
  user$: boolean;
  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.auth.currentUser().subscribe(
      (data) => {
        console.log(data)
        if(data['email']){
          this.user$ = true;
          console.log('trued')
        }else{
          this.user$ = false;
          console.log('falsed')
        }
      }
    )

    this.data.getAchievement( this.route.snapshot.params['id'] ).subscribe(
      (data) => {
        if(data)
          this.achievement$ = data;
        else
          this.router.navigate(['home']);
      }
    )
  }

  delete(event, id: string){
    event.preventDefault();

    if(window.confirm('Sure you want to delete this?')){
      console.log('deleteing')
      this.data.deleteAchievement(id).subscribe(
        (data) => {
          if(data['bool']){
            window.alert('Deleted Successfully.')
            this.router.navigate(['dashboard']);
          }else{
            console.log(data)
            window.alert('Deletion unsuccessful.')
          }
        }
      )
    }

  }

}
