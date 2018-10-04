import { Component, OnInit } from '@angular/core';
import { Achievement } from '../achievement';
import { DataAccessService } from '../data-access.service';

@Component({
  selector: 'app-add-achievement',
  templateUrl: './add-achievement.component.html',
  styleUrls: ['./add-achievement.component.css']
})

export class AddAchievementComponent implements OnInit {
  error$: string;

  constructor(private data: DataAccessService) { }

  ngOnInit() {

  }

  addAchievement($event){
    event.preventDefault();
    const target = event.target;

/*  form sanitisation block
    if(){
      error$ = ""
    }
*/
    let achievement = new Achievement(
      target.querySelector('#name').value,
      target.querySelector('#rollNo').value,
      target.querySelector('#section').value,
      target.querySelector('#sessionFrom').value,
      target.querySelector('#sessionTo').value,
      target.querySelector('#semester').value,
      target.querySelector('#department').value,
      target.querySelector('#shift').value,
      target.querySelector('#eventName').value,
      target.querySelector('#year').value,
      target.querySelector('#date').value,
      target.querySelector('#title').value,
      target.querySelector('#venue').value,
      target.querySelector('#category').value,
      target.querySelector('#participated').value,
      target.querySelector('#description').value,
      target.querySelector('#image').value,
    )

    this.data.addAchievement(achievement).subscribe(
      (data) => {
        console.log("hola!")
        console.log(data.message.toString())
        if(data.bool){
          // Successful addition
          window.alert("Successfully added achievement!")
        }else{
          this.error$ = data.message.toString()
        }
      }
    )

  }


}
