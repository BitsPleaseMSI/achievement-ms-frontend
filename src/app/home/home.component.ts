import { Component, OnInit } from '@angular/core';

import { DataAccessService } from '../data-access.service';
import { Router } from '@angular/router';
import { safe } from '../sanitise';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import * as $ from 'jquery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  achievements$: Object;

  constructor(private data: DataAccessService, private router: Router, private route: ActivatedRoute, private ac: AppComponent){
    this.achievements$ = [];
  }

  ngOnInit() {
    let params = this.route.snapshot.queryParams;
    let filters = new URLSearchParams();

    for(let key in params){
      if((params[key] != '') || (!safe(params[key].toString()))){
        filters.append(key, params[key]);
        let target = document.getElementById(key) as HTMLFormElement;
        target.value = params[key];
      }
    }

    this.getdata('?' + filters.toString());

    $('#filters').hide();

    $('#b').click(function(){
      $('#filters').toggle('fast');
    });


  }

  getdata(params: string){
    this.data.getApprovedAchievements(params)
    .subscribe(
      (data) => {
        console.log(data)
        this.achievements$ = data;
      },
      (error) =>{
        this.ac.snackbar('Server is not responding, Please try later.');
      });
  }

  resetFilters(event){
    event.preventDefault();
    let target = document.getElementById('filter') as HTMLFormElement;
    target.reset();
    this.router.navigate(['/home']);
    this.getdata('');
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

    let filters = new URLSearchParams();
    for(let key in params){
      if((params[key] != '') || (!safe(params[key].toString())))
        filters.append(key, params[key]);
    }

    Object.keys(params).forEach((key) => (params[key] == '') && delete params[key]);
    this.router.navigate(['/home'], { queryParams: params });
    this.getdata('?' + filters.toString());
  }

}
