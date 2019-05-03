import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { AppComponent } from '../app.component';
import { safe } from '../sanitise';
import * as $ from 'jquery';


@Component({
  selector: 'app-add-tachievement',
  templateUrl: './add-tachievement.component.html',
  styleUrls: ['./add-tachievement.component.css']
})
export class AddFacultyComponent implements OnInit {
  error$: string;
  info$: string;
  international: Boolean;
  reviewed: Boolean;
  sponsored: Boolean;
  msi: Boolean;

  constructor(private data: DataAccessService, private ac: AppComponent) { }

  hideControls(){
    $('#basicControl').hide();
    $('#typeControl').hide();
    $('#levelControl').hide();
    $('#reviewedControl').hide();
    $('#fundingControl').hide();
    $('#publishedControl').hide();
    $('#descControl').hide();
    $('#collegeControl').hide();
  }

  ngOnInit() {
    $('#addAchievementLoading').hide();
    this.hideControls();
  }

  resetFields(target){
    // Clearing all fields
    // target.querySelector('#taType').value = '';
    target.querySelector('#subType').value = '';
    target.querySelector('#date').value = '';
    target.querySelector('#topic').value = '';
    target.querySelector('#published').value = '';
    this.international = undefined;
    this.reviewed = undefined;
    this.sponsored = undefined;
    this.msi = undefined;

  }

  showControls(event){
    const target = event.target;
    this.hideControls();
    this.resetFields(target.parentNode.parentNode.parentNode);

    if(target.value == "Journal"){
      $('#pubLabel').text("Published at (with ISSN No.)");
      $('#published').attr("placeholder", "Published");
    }else if(target.value == "SeminarAttended"){
      $('#pubLabel').text("Place");
      $('#published').attr("placeholder", "Place");
    }else{
      $('#pubLabel').text("Published / Presented at");
      $('#published').attr("placeholder", "Published");
    }

    if (target.value != "Book" && target.value != "") {
      $('#collegeControl').show();
    }

    if(
      target.value == "Book" ||
      target.value == "Journal" ||
      target.value == "Conference"
    ){
      $('#reviewedControl').show();
      $('#publishedControl').show();
      $('#basicControl').show();
      $('#levelControl').show();
      $('#descControl').show();  
    }else if(target.value == "SeminarAttended"){
      $('#typeControl').show();
      $('#publishedControl').show();
      $('#fundingControl').show();
      $('#basicControl').show();
      $('#levelControl').show();
      $('#descControl').show();
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
    if( this.international == undefined ){
      this.error$ = 'Please select level';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // Reviewed
    if(
      (target.querySelector('#taType').value == 'Book' ||
      target.querySelector('#taType').value == 'Journal' ||
      target.querySelector('#taType').value == 'Conference') &&
      this.reviewed == undefined
    ){
      this.error$ = 'Please select reviewed';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // Sub type
    if(
      target.querySelector('#taType').value == 'SeminarAttended' &&
      target.querySelector('#subType').value.trim() == ""
    ){
      this.error$ = 'Please select a sub type';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // Funding
    if(
      target.querySelector('#taType').value == 'SeminarAttended' &&
      this.sponsored == undefined
    ){
      this.error$ = 'Please select funding';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // Published desc
    if(target.querySelector('#published').value.trim() == ""){
      this.error$ = 'Please check published description';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    // College
    if(
      target.querySelector('#taType').value != 'Book' &&
      this.msi == undefined
    ){
      this.error$ = 'Please select college';
      this.info$ = undefined;
      $('#addAchievementLoading').hide(50);
      $('#addAchievementButton').removeAttr('disabled');
      return;
    }
    

    let achievement = new Object;
    achievement['taType'] = target.querySelector('#taType').value.trim();
    achievement['topic'] = target.querySelector('#topic').value.trim();
    achievement['date'] = target.querySelector('#date').value.trim();
    achievement['published'] = target.querySelector('#published').value.trim();

    if (target.querySelector('#subType').value.trim() != "") {
      achievement['subType'] = target.querySelector('#subType').value.trim();
    }
    if (target.querySelector('#description').value.trim() != "") {
      achievement['description'] = target.querySelector('#description').value.trim();
    }
    if (this.reviewed != undefined) {
      achievement['reviewed'] = this.reviewed;
    }
    if (this.international != undefined) {
      achievement['international'] = this.international;
    }
    if (this.sponsored != undefined) {
      achievement['sponsored'] = this.sponsored;
    }
    if (this.msi != undefined) {
      achievement['msi'] = this.msi;
    }else{
      // Because API is not perfectly implemented
      achievement['msi'] = false;
    }
    

    // Sanitising data
    for(let key in achievement){
      if(!safe(achievement[key].toString())){
        this.error$ = 'Please check ' + key;
        this.info$ = undefined;
        $('#addAchievementLoading').hide(50);
        $('#addAchievementButton').removeAttr('disabled');
        return;
      }
    }


    for(let key in achievement){
      console.log(key.padStart(13) + ": " +achievement[key])
    }
    
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
            // this.resetFields(target);
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