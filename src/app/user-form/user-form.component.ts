import { Component, OnInit } from '@angular/core';

import { DataAccessService } from '../data-access.service';
import { User } from '../user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})

export class UserFormComponent {

  constructor(private api: DataAccessService){}

  model = new User('', '', '', '', '', '');

  submitted = false;

  onSubmit(){
    this.submitted = true;

    console.log("Form component: " + JSON.stringify(this.model))

    let tmp = {"email":"mailasa@mail1111.com","password":"asda","firstName":"asd","lastName":"asda","code":"code","department":"education"}

    this.api.addUser(tmp).subscribe(
      (data: any) => {
        console.log("Server response on next: " + data);
      },
      (err: any) =>{
        console.log("Server response on error: " + err)
      }
    )

  }

/*
  newUser(){
    this.model = new User('', '', '', '', '', '');
  }
*/

  //cleanup after done
  get diagnostic() { return JSON.stringify(this.model); }

}
