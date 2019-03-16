import { Component, OnInit } from '@angular/core';
import { safe } from '../sanitise';
import { DataAccessService } from '../data-access.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-add-academic',
  templateUrl: './add-academic.component.html',
  styleUrls: ['./add-academic.component.css']
})
export class AddAcademicComponent implements OnInit {
  error$: string;
  info$: string;
  constructor(private data: DataAccessService, private ac: AppComponent) {}

  ngOnInit() {}

  addAcademic(event){
    event.preventDefault();
    const target = event.target;

    this.info$ = "Adding achievement. Please wait.";
    this.error$ = undefined;

    if(
      target.querySelector('#from').value.trim() == '' ||
      target.querySelector('#from').value.trim().length != 4 ||
      target.querySelector('#to').value.trim() == '' ||
      target.querySelector('#to').value.trim().length != 4
    ){
      this.error$ = 'Input error. Please check batch';
      this.info$ = undefined;
      return;
    }

    let achievement = new Object;
    achievement['name'] = target.querySelector('#name').value.trim();
    achievement['rollNo'] = target.querySelector('#rollNo').value.trim();
    achievement['batch'] = target.querySelector('#from').value.trim() + '-' + target.querySelector('#to').value.trim();
    achievement['programme'] = target.querySelector('#programme').value.trim();
    achievement['category'] = target.querySelector('#category').value.trim();

    // Sanitising data
    for(let key in achievement){
      if((achievement[key] == '') || (!safe(achievement[key].toString()))){
        this.error$ = 'Input error. Please check ' + key;
        this.info$ = undefined;
        return;
      }
    }

    let error = true;
    this.data.addAcademic(achievement).subscribe(
      data => {
        if(data['partialText']){
          if(JSON.parse(data['partialText'])['bool']){
            this.error$ = undefined;
            this.info$ = 'Achievement added Successfully.';
            this.ac.snackbar('Achievement added Successfully!');
            error = false;
          }else{
            this.error$ = JSON.parse(data['partialText'])['message'];
            this.info$ = undefined;
          }
        }
      },
      () =>{
        this.error$ = undefined;
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
