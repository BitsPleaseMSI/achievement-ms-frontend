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

  ngOnInit() { }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles[0].name;
    console.log('selectedFiles: ' + this.fileName );
  }

  addAchievement(event){
    event.preventDefault();
    const target = event.target;

    try {
        this.selectedFiles.item(0);
    }
    catch(err) {
        window.alert('Image upload error!');
        return;
    }

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
      target.querySelector('#participated').checked,
      target.querySelector('#description').value,
      this.selectedFiles.item(0),
    )

    this.data.addAchievement(achievement).subscribe(
      data => {
        if(data['partialText']){
          if(JSON.parse(data['partialText'])['bool']){
            window.alert('Achievement added Successfully.');
          }
        }
        console.log(data['partialText']);
      }
    )

  }


}
