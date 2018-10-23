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
  w$: Object = window;

  constructor(private data: DataAccessService, private router: Router, private route: ActivatedRoute, private ac: AppComponent){
    this.achievements$ = [];
  }

  ngOnInit() {
    this.getdata(window.location.search);

    $('#filters').hide();

    $('#b').click(function(){
      $('#filters').toggle('fast');
    });

  }

  getdata(params: string){
    if(window.location.pathname == '/home/achievements'){

      this.data.getApprovedAchievements(params)
      .subscribe(
        (data) => {
          this.achievements$ = data;
        },
        (error) =>{
          this.ac.snackbar('Server is not responding, Please try later.');
      });

    }else if(window.location.pathname == '/home/academic'){

      this.data.getAcademic(params)
      .subscribe(
        (data) => {
          this.achievements$ = data;
        },
        (error) =>{
          this.ac.snackbar('Server is not responding, Please try later.');
      });

    }

  }

  resetFilters(event){
    event.preventDefault();
    let target = document.getElementById('filter') as HTMLFormElement;
    target.reset();
    this.router.navigate([window.location.pathname]);
    this.getdata('');
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};

    if(window.location.pathname == '/home/achievements'){
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

    }else if(window.location.pathname == '/home/academic'){

      if(target.querySelector('#from').value == '' && target.querySelector('#to').value == ''){

      }else if(
        (target.querySelector('#from').value == '' && target.querySelector('#to').value != '') ||
        (target.querySelector('#to').value == '' && target.querySelector('#from').value != '')
      ){
        this.ac.snackbar('Clear or fill both fields for Batch!');
      }else if(
        target.querySelector('#from').value.length != 4 ||
        target.querySelector('#to').value.length != 4
      ){
        this.ac.snackbar('Check Batch filter!');
        return;
      }else{
        params['batch'] = target.querySelector('#from').value + '-' + target.querySelector('#to').value;
      }
      params['category'] = target.querySelector('#categoryA').value
      params['programme'] = target.querySelector('#programme').value
    }


    let filters = new URLSearchParams();
    for(let key in params){
      if((params[key] != '') || (!safe(params[key].toString())))
        filters.append(key, params[key]);
    }

    Object.keys(params).forEach((key) => (params[key] == '') && delete params[key]);
    this.router.navigate([window.location.pathname], { queryParams: params });
    this.getdata('?' + filters.toString());
  }

}
