import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-add-tachievement',
  templateUrl: './add-tachievement.component.html',
  styleUrls: ['./add-tachievement.component.css']
})
export class AddFacultyComponent implements OnInit {
  error$: string;
  info$: string;

  constructor(private data: DataAccessService, private ac: AppComponent) { }

  hideControls(){
    $('#basicControl').hide();
    $('#levelControl').hide();
    $('#reviewedControl').hide();
    $('#fundingControl').hide();
    $('#publishedControl').hide();
    $('#placeControl').hide();    
  }

  ngOnInit() {
    $('#addAchievementLoading').hide();
    this.hideControls();
  }
  
  showControls(event){
    const target = event.target;
    this.hideControls();

    if(  target.value == "Journal"){
      $('#pubLabel').text("Published at (with ISSN No.)");
    }else{
      $('#pubLabel').text("Published / Presented at");
    }

    if(
      target.value == "Book" ||
      target.value == "Journal" ||
      target.value == "Conference"
    ){
      $('#basicControl').show();
      $('#levelControl').show();
      $('#reviewedControl').show();
      $('#publishedControl').show();
    }else if(target.value == "SeminarAttended"){
      $('#basicControl').show();
      $('#levelControl').show();
      $('#placeControl').show();
      $('#fundingControl').show();
    }
    
  }

  addTAchievement(event){
    event.preventDefault();
    const target = event.target;

    $('#addAchievementLoading').show(50);
    $('#addAchievementButton').attr('disabled', 'disabled');

    this.info$ = "Adding achievement. Please wait.";
    this.error$ = undefined;

    // Form data check
    // Achievement type
    if(target.querySelector('#taType').value == ''){
      this.error$ = 'Please select achievement type';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // Date
    if(target.querySelector('#date').value.trim() == ''){
      this.error$ = 'Please check date';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // Topic
    if(target.querySelector('#topic').value.trim() == ''){
      this.error$ = 'Please check topic';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // Level
    if(
      target.querySelector('#taType').value == 'Book' &&
      target.querySelector('#international').checked == false &&
      target.querySelector('#national').checked == false
    ){
      this.error$ = 'Please select level';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // Description
    if(target.querySelector('#description').value.trim() == ''){
      this.error$ = 'Please add description';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }

    let achievement = new Object;
    achievement['taType'] = target.querySelector('#taType').value.trim();
    achievement['msi'] = target.querySelector('#msi').checked;
    achievement['date'] = target.querySelector('#date').value.trim();
    achievement['international'] = target.querySelector('#international').checked;
    achievement['description'] = target.querySelector('#description').value.trim();

    for(let key in achievement){
      console.log(key + " " +achievement[key])
    }

    return;
    
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
            target.querySelector('#taType').value = "";
            target.querySelector('#msi').checked = false;
            target.querySelector('#otherCollege').checked = false;
            target.querySelector('#international').checked = false;
            target.querySelector('#national').checked = false;
            target.querySelector('#description').value = '';
            target.querySelector('#date').value = undefined;
            console.log("cleaned form");
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
