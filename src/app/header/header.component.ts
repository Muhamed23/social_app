import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from '../dashboard/services/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private authListenerSubs: Subscription;
  public userIsAuthenticated = false;
  public userEmail: string;
  public userId: string;

  constructor(private authService: AuthService, private profileService: ProfileService, private router: Router) { }



  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userEmail = this.authService.getUserEmail();
    this.userId = this.authService.getUserId();

    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userEmail = this.authService.getUserEmail();
      this.userId = this.authService.getUserId();

    });
  }


  getProfile() {
    this.profileService.getProfile(this.userId).subscribe(profile => {

      this.router.navigate([`/profile/${profile['data'].userId}`]);
    })
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
