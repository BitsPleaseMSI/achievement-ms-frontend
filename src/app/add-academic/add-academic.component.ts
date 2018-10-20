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
  constructor(private data: DataAccessService, private ac: AppComponent) { }

  ngOnInit() {
  }

  addAcademic(event){
    event.preventDefault();
    const target = event.target;

    let achievement = new Object;
    achievement['name'] = target.querySelector('#name').value;
    achievement['rollNo'] = target.querySelector('#rollNo').value;
    achievement['batch'] = target.querySelector('#batch').value;
    achievement['programme'] = target.querySelector('#programme').value;

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
