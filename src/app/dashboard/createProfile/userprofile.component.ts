import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  profileForm: FormGroup
  userEmail;
  rate;
  max;
  skillValue: string;
  skillButtonValidity: boolean = true;

  workPositions: any[] = [
    'Front End Developer',
    'Back End Developer',
    'Full stack Developer',
    'UI/UX Designer',
    'Graphics Designer'
  ];

  modalRef: BsModalRef;
  config = {
    keyboard: true
  };
  overStar: number | undefined;
  percent: number;

  skills: any[] = [
    // {
    //   name: 'Object Oriented Programming',
    //   rate: 4
    // },
    // {
    //   name: 'Team Work',
    //   rate: 8
    // }
  ]

  constructor(
    private _formBuilder: FormBuilder,
    private modalService: BsModalService,
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService) { }

  ngOnInit() {
    this.profileForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['Male', Validators.required],
      profession: ['', Validators.required],
      skills: [[], Validators.required]
    });

    this.userEmail = this.authService.getUserEmail();

  }


  createProfile() {

    console.log(this.profileForm.value);
    this.profileService.createUserProfile(this.profileForm.value).subscribe(data => {
      console.log(data);
      this.router.navigate(['/dashboard'])
    });

  }

  setPosition($event) {
    this.profileForm.get('profession').setValue($event.target.value);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  hoveringOver(value: number): void {
    this.overStar = value;
    this.percent = (value / this.max) * 100;
  }

  resetStar(): void {
    this.overStar = void 0;
  }

  addToSkills() {
    this.skills.push({
      name: this.skillValue,
      rate: this.rate
    });

    this.profileForm.get('skills').setValue(this.skills);

    this.skillValue = '';
    this.rate = 0;
    this.skillButtonValidity = true;
  }

}
