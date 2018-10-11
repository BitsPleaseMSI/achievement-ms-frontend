import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { Achievement } from '../achievement';

@Component({
  selector: 'app-add-achievement',
  templateUrl: './add-achievement.component.html',
  styleUrls: ['./add-achievement.component.css']
})

export class AddAchievementComponent implements OnInit {
  error$: string;
  selectedFiles: FileList;
  fileName: string;

  constructor(private data: DataAccessService) { }

  ngOnInit() {

  }


  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles[0].name;
    console.log('selectedFiles: ' + this.fileName );
  }

  addAchievement(event){
    console.log(this.fileName + " " + console.log(this.selectedFiles))
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
      target.querySelector('#date').value,
      target.querySelector('#title').value,
      target.querySelector('#venue').value,
      target.querySelector('#category').value,
      target.querySelector('#participated').value,
      target.querySelector('#description').value,
      this.selectedFiles.item(0),
    )

    console.log('almost there')

    // console.log('Our image is' + target.querySelector('#image').value);
    let req = this.data.addAchievement(achievement)
    console.log(req.forEach(console.log))

    req.subscribe(
      (res) => {
        console.log("hola!" + this.error$.toString());
        // console.log(data.message.toString())
        if(res.bool){
          // Successful addition
          window.alert("Successfully added achievement!");
        }else{
          console.log("not added");
          console.log("errors -> " + this.error$ + " " + res.toLocaleString() + " " + res.toString());
        }
      }

    );

  }


}
