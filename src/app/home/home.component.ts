import { Component, OnInit } from '@angular/core';

import { DataAccessService } from '../data-access.service';
import { Posts } from '../data-access.service';
import { Achievement } from '../data-access.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  apicall$: Achievement;

  constructor(private data: DataAccessService) { }

  ngOnInit() {
    this.data.getAchievements().subscribe(
      (data: Achievement) => {
        this.apicall$ = data;
        console.log(data.name);
      }
    )
  }

}
