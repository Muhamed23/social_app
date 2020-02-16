import { Injectable } from '@angular/core';
import { AuthData } from './authData';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = '';
  private token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private userId: string;
  private userEmail: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
    this.url = environment.url;
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUserEmail() {
    return this.userEmail;
  }


  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  register(userData: AuthData) {
    const user: AuthData = { email: userData.email, password: userData.password };

    return this.http.post<{ message: string, data: any }>(`${this.url}api/user/register`, user).subscribe(user => {
      this.router.navigate(['auth/login'])
    });
  }

  login(userData: AuthData) {
    const user: AuthData = { email: userData.email, password: userData.password };

    return this.http.post<{ token: any, haveProfile: boolean, expiresIn: number, userId: string, userEmail: string }>(`${this.url}api/user/login`, user).subscribe(response => {

      this.token = response.token
      if (this.token) {
        const expiresInDuration = response.expiresIn;

        this.setAuthTimer(expiresInDuration);
        this.userId = response.userId;
        this.userEmail = response.userEmail;
        this.isAuthenticated = true;
        this.authStatusListener.next(this.isAuthenticated);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

        this.saveAuthData(this.token, expirationDate, this.userId, this.userEmail);

        if (response.haveProfile) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate([`/createUser/${this.userId}`]);
        }
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.userEmail = null;
    this.authStatusListener.next(this.isAuthenticated);
    this.router.navigate(['auth/login']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }


  private saveAuthData(token: string, exirationDate: Date, userId: string, userEmail: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', exirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);


  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');

  }

  private getAuthdata() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');




    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      userId: userId,
      userEmail: userEmail,
      expirationDate: new Date(expirationDate)
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthdata();
    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userEmail = authInformation.userEmail;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(this.isAuthenticated);

    }
  }





}
