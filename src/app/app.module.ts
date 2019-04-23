import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AddAchievementComponent } from './add-achievement/add-achievement.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './settings/settings.component';
import { AddAcademicComponent } from './add-academic/add-academic.component';
import { AddFacultyComponent } from './add-tachievement/add-tachievement.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddAchievementComponent,
    RegisterComponent,
    ResetPassComponent,
    DashboardComponent,
    DetailsComponent,
    AboutComponent,
    SettingsComponent,
    AddAcademicComponent,
    AddFacultyComponent,
    TeacherDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    NgbModule.forRoot(),
    MatRadioModule,
    MatButtonToggleModule,
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
