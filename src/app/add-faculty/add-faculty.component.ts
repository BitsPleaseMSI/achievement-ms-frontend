import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-add-faculty',
  templateUrl: './add-faculty.component.html',
  styleUrls: ['./add-faculty.component.css']
})
export class AddFacultyComponent implements OnInit {
  error$: string;
  info$: string;

  constructor(private data: DataAccessService, private ac: AppComponent) { }

  ngOnInit() {
    $('#addAchievementLoading').hide(50);
  }

  addTAchievement(event){
    event.preventDefault();
    const target = event.target;

    $('#addAchievementLoading').show(50);
    $('#addAchievementButton').attr('disabled', 'disabled');

    this.info$ = "Adding achievement. Please wait.";
    this.error$ = undefined;

    // Form data check
    if(target.querySelector('#taType').value == 'Select type'){
      this.error$ = 'Input error. Please select achievement type';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    if(
      target.querySelector('#msi').checked == false && target.querySelector('#otherCollege').checked == false
    ){
      this.error$ = 'Input error. Please select college';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    if(
      target.querySelector('#international').checked == false && target.querySelector('#national').checked == false
    ){
      this.error$ = 'Input error. Please select region';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    if(target.querySelector('#description').value.trim() == ''){
      this.error$ = 'Input error. Please add description';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    if(target.querySelector('#date').value.trim() == ''){
      this.error$ = 'Input error. Please check date';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }

    let achievement = new Object;
    achievement['taType'] = target.querySelector('#taType').value.trim();
    achievement['msi'] = target.querySelector('#msi').value.trim();
    achievement['date'] = target.querySelector('#date').value.trim();
    achievement['international'] = target.querySelector('#international').value.trim();
    achievement['description'] = target.querySelector('#description').value.trim();

    let error = true;
    this.data.addTAchievement(achievement).subscribe(
      data => {
        if(data['partialText']){
          if(JSON.parse(data['partialText'])['bool']){
            error = false;
            $('#addAchievementLoading').hide(50);
            this.error$ = undefined;
            this.info$ = 'Achievement added successfully.';
            this.ac.snackbar('Achievement added successfully!');
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
