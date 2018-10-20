import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { AddAchievementComponent } from './add-achievement/add-achievement.component'
import { ResetPassComponent } from './reset-pass/reset-pass.component'
import { RegisterComponent } from './register/register.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DetailsComponent } from './details/details.component'
import { AboutComponent } from './about/about.component'
import { SettingsComponent } from './settings/settings.component'

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
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
    path: 'user/settings',
    component: SettingsComponent,
  },
  {
    path: 'passwordreset',
    component: ResetPassComponent,
  },
  {
    path: 'dashboard/approved',
    component: DashboardComponent,
  },
  {
    path: 'dashboard/unapproved',
    component: DashboardComponent,
  },
  {
    path: 'achievement/:id',
    component: DetailsComponent,
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
