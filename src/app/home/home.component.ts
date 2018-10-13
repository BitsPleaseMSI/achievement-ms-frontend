import { Component, OnInit } from '@angular/core';

import { DataAccessService } from '../data-access.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {

  achievements$: Object;

  constructor(private data: DataAccessService, private auth: AuthService){
    this.achievements$ = [];
  }

  ngOnInit() {
    console.log()
    this.getdata();
  }

  getdata(params?: Object){
    if(!params)
    params = {};

    this.data.getApprovedAchievements(params)
    .subscribe(
      (data) => {
        console.log(data)
        this.achievements$ = data;
      });
    }

  resetFilters(event){
    event.preventDefault();
    let target = document.getElementById('filter') as HTMLFormElement;
    target.reset();
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};
    params['sessionFrom'] = target.querySelector('#sessionFrom').value
    params['sessionTo'] = target.querySelector('#sessionTo').value
    params['dateFrom'] = target.querySelector('#dateFrom').value
    params['dateTo'] = target.querySelector('#dateTo').value
    params['rollNo'] = target.querySelector('#rollNo').value
    params['section'] = target.querySelector('#section').value
    params['semester'] = target.querySelector('#semester').value
    params['shift'] = target.querySelector('#shift').value
    params['category'] = target.querySelector('#category').value
    params['department'] = target.querySelector('#department').value
    this.getdata(params);
  }

}
