import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../data-access.service';
import { AuthService } from '../auth.service';
import { AppComponent } from '../app.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  achievements$: Object;

  constructor(private data: DataAccessService, private auth: AuthService) {
    this.achievements$ = [];
  }

  refresh(params?: Object){
    if(document.getElementById('listUnapproved').checked){
      this.getUnapprovedAchievements();
    }else{
      if(!params)
        params = {};
      this.getApprovedAchievements(params);
    }
  }

  getApprovedAchievements(params?: Object){
    this.auth.currentUser().subscribe(
      (user) => {
        console.log('params')
        console.log(params)
        params['department'] = user.department
        this.data.getApprovedAchievements(params)
          .subscribe(
          (data) => {
            this.achievements$ = data
          });
      },
      (error) => {
        this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
      }
    )
  }

  getUnapprovedAchievements(){
    this.auth.currentUser().subscribe(
      (user) => {
        this.data.getUnapprovedAchievements()
        .subscribe(
          (data) => {
            this.achievements$ = data['data']
          });
        },
        (error) => {
          this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
        }
      )
    }

  // getdata(params?: Object, sortBy?: string){
  //   if(!params)
  //     params = {};
  //
  //   this.auth.currentUser().subscribe(
  //     (user) => {
  //       this.data.getUnapprovedAchievements()
  //         .subscribe(
  //         (data) => {
  //         this.unapprovedAchievements$ = data['data']
  //       });
  //
  //       params['department'] = user.department
  //
  //       this.data.getApprovedAchievements(params)
  //         .subscribe(
  //         (data) => {
  //         this.approvedAchievements$ = data
  //       });
  //     },
  //     (error) => {
  //       this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
  //     }
  //   )
  //
  // }

  ngOnInit(){
    this.achievements$ = [];
    this.refresh();
  }

  resetFilters(event){
    event.preventDefault();
    const target = event.target;
    document.getElementById('filter').reset();
  }

  filter(event){
    event.preventDefault();
    const target = event.target;
    let params = {};
    params['sessionFrom'] = target.querySelector('#sessionFrom').value
    params['sessionTo'] = target.querySelector('#sessionTo').value
    params['dateFrom'] = target.querySelector('#dateFrom').value
    params['dateTo'] = target.querySelector('#dateTo').value
    params['rollno'] = target.querySelector('#rollNo').value
    params['section'] = target.querySelector('#section').value
    params['semester'] = target.querySelector('#semester').value
    params['shift'] = target.querySelector('#shift').value
    params['category'] = target.querySelector('#category').value
    params['department'] = target.querySelector('#department').value
    this.refresh(params);
  }

  // filter(event){
  //   event.preventDefault();
  //   const target = event.target;
  //   let params = {};
  //   if(target.querySelector('#sectionFilter').checked)
  //     params['section'] = target.querySelector('#section').value
  //   if(target.querySelector('#semesterFilter').checked)
  //     params['semester'] = target.querySelector('#semester').value
  //   if(target.querySelector('#shiftFilter').checked)
  //     params['shift'] = target.querySelector('#shift').value
  //   if(target.querySelector('#categoryFilter').checked)
  //     params['category'] = target.querySelector('#category').value
  //
  //   this.refresh(params);
  // }

  approve(event, id: string){
    event.preventDefault();
    const target = event.target;

    this.auth.currentUser().subscribe(
      (data) => {
          if(!data['email']){
            this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
            return;
          }

          this.auth.approveAchievement(id).subscribe(
            (data) => {
              if(data['bool']){
                this.refresh();
              }else{
                window.alert(data['messsage'])
              }
            }
          )
      }
    )

  }

  unapprove(event, id: string){
    event.preventDefault();
    const target = event.target;

    this.auth.currentUser().subscribe(
      (data) => {
          if(!data['email']){
            this.auth.redirect('home', 'Unauthenticated user. Illegal activity logged!')
            return;
          }

          this.auth.unapproveAchievement(id).subscribe(
            (data) => {
              if(data['bool']){
                this.refresh();
              }else{
                window.alert(data['message'])
              }
            }
          )
      }
    )

  }

}
