import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { Achievement } from '../achievement';
import { safe } from '../sanitise';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-add-achievement',
  templateUrl: './add-achievement.component.html',
  styleUrls: ['./add-achievement.component.css']
})

export class AddAchievementComponent implements OnInit {
  error$: string;
  info$: string;
  selectedFiles: FileList;
  fileName: string;

  constructor(private data: DataAccessService, private ac: AppComponent) { }

  ngOnInit() { }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles[0].name;
  }

  addAchievement(event){
    event.preventDefault();
    const target = event.target;

    try{
      this.selectedFiles.item(0);
    }catch(err){
      this.error$ = 'Image upload error!';
      this.ac.snackbar('Image upload error!');
      this.info$ = undefined;
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
    // Sanitising data
    for(let key in achievement){
      if(key == 'participated'){

      }else if((achievement[key] == '') || (!safe(achievement[key].toString()))){
        this.error$ = 'Input error. Please check ' + key;
        this.info$ = undefined;
        return;
      }
    }

    let error = true;
    this.data.addAchievement(achievement).subscribe(
      data => {
        if(data['partialText']){
          if(JSON.parse(data['partialText'])['bool']){
            error = false;
            this.ac.snackbar('Achievement added Successfully!');
            this.info$ = 'Achievement added Successfully.';
            this.error$ = undefined;
          }
        }
      },
      (error) =>{
        this.info$ = undefined;
        this.ac.snackbar('Server is not responding, Please try later.');
      }
    )

    setTimeout(function () {
      if(error){
        setTimeout('', 5000);
        this.info$ = undefined;
        this.error$ = 'Error uploading achievement. Please try again later.';
      }
    }, 8000);

  }


}
