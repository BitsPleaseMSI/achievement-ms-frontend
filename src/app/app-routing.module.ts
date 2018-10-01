import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { AddAchievementComponent } from './add-achievement/add-achievement.component'
import { UserFormComponent } from './user-form/user-form.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'teacherLogin',
    component: LoginComponent,
  },
  {
    path: 'myNewAchievement',
    component: AddAchievementComponent,
  },
  {
    path: 'userRegistration',
    component: UserFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
