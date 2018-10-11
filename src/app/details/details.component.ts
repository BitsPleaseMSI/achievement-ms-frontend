import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  achievement$: Object;
  constructor(private data: DataAccessService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.data.getAchievement( this.route.snapshot.params['id'] ).subscribe(
      (data) => {
        this.achievement$ = data;
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
