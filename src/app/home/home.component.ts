import { Component, OnInit } from '@angular/core';

import { DataAccessService } from '../data-access.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  achievements$: Object;

  getdata(){
    this.data.getApprovedAchievements()
    .subscribe(
      (data) => {
        this.achievements$ = data
      });
  }

  constructor(private data: DataAccessService, private auth: AuthService) { }

  ngOnInit() {
    this.getdata()
  }

}
