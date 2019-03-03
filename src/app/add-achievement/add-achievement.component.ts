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
  sessionFrom: number;
  sessionTo: number;

  constructor(private data: DataAccessService, private ac: AppComponent) {}

  ngOnInit() {}

  autoBatch(event){
    event.preventDefault();
    let tmp = 0;
    let roll = ($('#rollNo')[0] as HTMLInputElement).value.trim().substr(-5);
    if(roll == '')
      return;

    let year = roll.substr(-2);
    let prog = roll.substr(0, 3);

    if(prog == '021'){
      tmp = Number(year) + 2;
    }else{
      tmp = Number(year) + 3;
    }

    ($('#batch')[0] as HTMLInputElement).value = '20' + year + '-' + '20' + tmp.toString();

    this.sessionFrom = parseInt('20' + year);
    this.sessionTo = parseInt('20' + tmp);
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles[0].name;
  }

  addAchievement(event){
    event.preventDefault();
    const target = event.target;

    $('#addAchievementLoading').show(50);
    $('#addAchievementButton').attr('disabled', 'disabled');

    this.info$ = "Adding Achievement. Please wait.";
    this.error$ = undefined;

    // Upload file check
    try{
      if(
        this.selectedFiles.item(0)['type'].substr(0,5) != 'image' ||
        this.selectedFiles.item(0)['size'] > 8000000
      ){
        $('#addAchievementLoading').hide(50);
        $('#addAchievementButton').removeAttr('disabled');
        this.error$ = 'Image upload error. Only jpg, jpeg, png formats allowed with a maximim limit of 8 MegaBytes';
        this.info$ = undefined;
        this.ac.snackbar('Image upload error!');
        return;
      }
    }catch(err){
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      this.error$ = 'Image upload error!';
      this.info$ = undefined;
      this.ac.snackbar('Image upload error!');
      return;
    }

    let achievement = new Achievement(
      target.querySelector('#name').value.trim(),
      target.querySelector('#rollNo').value.trim(),
      target.querySelector('#section').value,
      this.sessionFrom,
      this.sessionTo,
      target.querySelector('#semester').value,
      target.querySelector('#department').value,
      target.querySelector('#shift').value,
      target.querySelector('#eventName').value.trim(),
      target.querySelector('#date').value,
      target.querySelector('#title').value.trim(),
      target.querySelector('#venue').value.trim(),
      target.querySelector('#category').value,
      target.querySelector('#participated').checked,
      target.querySelector('#description').value.trim(),
      this.selectedFiles.item(0),
    )
    // Sanitising data
    for(let key in achievement){
      if(key == 'participated'){

      }else if((achievement[key] == '') || (!safe(achievement[key].toString()))){
        $('#addAchievementLoading').hide(50);
        $('#addAchievementButton').removeAttr('disabled');
        if(key == 'eventName')
          key = 'event name'
        if(key == 'rollNo')
          key = 'enrollment no.'

        this.error$ = 'Please check ' + key;
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
            $('#addAchievementLoading').hide(50);
            this.error$ = undefined;
            this.info$ = 'Achievement added successfully.';
            this.ac.snackbar('Achievement added successfully!');

            // Reseting some form fields
            target.querySelector('#eventName').value = '';
            target.querySelector('#date').value = undefined;
            target.querySelector('#title').value = '';
            target.querySelector('#venue').value = '';
            target.querySelector('#category').value = 'sports';
            target.querySelector('#description').value = '';
            target.querySelector('#image').value = '';

            $('#addAchievementButton').removeAttr('disabled');
          }
        }
      },
      () =>{
        this.info$ = undefined;
        this.ac.snackbar('Server is not responding, Please try later.');
        $('#addAchievementLoading').hide(50);
        $('#addAchievementButton').removeAttr('disabled');
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
