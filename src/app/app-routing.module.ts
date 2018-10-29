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
import { AddAcademicComponent } from './add-academic/add-academic.component'
import { AuthGuard as AG } from './auth.guard'

const routes: Routes = [
  {
    path: 'home/achievements',
    component: HomeComponent,
  },
  {
    path: 'home/academic',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  // },
  {
    path: 'achievement/add',
    component: AddAchievementComponent,
  },
  {
    path: 'academic/add',
    component: AddAcademicComponent,
    canActivate: [AG],
  },
  {
    path: 'user/register',
    component: RegisterComponent,
  },
  {
    path: 'user/settings',
    component: SettingsComponent,
    canActivate: [AG],
  },
  {
    path: 'passwordreset',
    component: ResetPassComponent,
    canActivate: [AG],
  },
  {
    path: 'dashboard/approved',
    component: DashboardComponent,
    canActivate: [AG],
  },
  {
    path: 'dashboard/unapproved',
    component: DashboardComponent,
    canActivate: [AG],
  },
  {
    path: 'dashboard/academic',
    component: DashboardComponent,
    canActivate: [AG],
  },
  {
    path: 'achievement/:id',
    component: DetailsComponent,
  },
  {
    path: '**',
    redirectTo: 'home/achievements',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
