import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AsideComponent } from './aside/aside.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { UserprofileComponent } from './dashboard/createProfile/userprofile.component';
import { ProfileService } from './dashboard/services/profile.service';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';


@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      AuthComponent,
      LoginComponent,
      RegisterComponent,
      AsideComponent,
      DashboardComponent,
      UserprofileComponent,
      ProfileComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      ReactiveFormsModule,
      FormsModule,
      ModalModule.forRoot(),
      RatingModule.forRoot()
   ],
   providers: [
      AuthService,
      ProfileService,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
