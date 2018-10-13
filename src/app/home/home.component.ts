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

  getdata(params?: Object, sortBy?: string){
    if(!params)
      params = {};

    this.data.getApprovedAchievements(params)
    .subscribe(
      (data) => {
        this.achievements$ = data;
      });
  }

  constructor(private data: DataAccessService, private auth: AuthService) { }

  ngOnInit() {
    this.getdata()
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};

    if(target.querySelector('#sectionFilter').checked)
      params['section'] = target.querySelector('#section').value

    if(target.querySelector('#semesterFilter').checked)
      params['semester'] = target.querySelector('#semester').value

    if(target.querySelector('#shiftFilter').checked)
      params['shift'] = target.querySelector('#shift').value

    if(target.querySelector('#categoryFilter').checked)
      params['category'] = target.querySelector('#category').value

    if(target.querySelector('#departmentFilter').checked)
      params['department'] = target.querySelector('#department').value

    this.getdata(params);
  }

}
