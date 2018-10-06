import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { AddAchievementComponent } from './add-achievement/add-achievement.component'
import { ResetPassComponent } from './reset-pass/reset-pass.component'
import { RegisterComponent } from './register/register.component'
import { DashboardComponent } from './dashboard/dashboard.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'achievement/add',
    component: AddAchievementComponent,
  },
  {
    path: 'user/register',
    component: RegisterComponent,
  },
  {
    path: 'passwordreset',
    component: ResetPassComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
