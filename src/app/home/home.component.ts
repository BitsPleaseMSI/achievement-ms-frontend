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

  constructor(private data: DataAccessService, private auth: AuthService) { }

  ngOnInit() {
    this.data.getAchievements()
    .subscribe(
      (data) => {
        console.log("the data " + data)
        this.achievements$ = data
      });
  }

}
