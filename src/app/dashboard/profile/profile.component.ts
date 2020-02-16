import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 profile;
  constructor(private route: ActivatedRoute, private profileService: ProfileService) { }

  ngOnInit() {
    this.getProfile();
  }


  getProfile() {
    this.route.paramMap.subscribe(params => {
      const id = params['params'].id;

     this.profileService.getProfile(id).subscribe(userProfile => {
       this.profile = {
        firstName: userProfile['data'].firstName,
        lastName: userProfile['data'].lastName,
        skills: userProfile['data'].skills
       }

     })
    })
  }

}
