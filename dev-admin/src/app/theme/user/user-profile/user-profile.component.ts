import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormControl, FormGroup,FormBuilder ,Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


import { UsersService } from '../../../services/users/users.service';
import { AuthService } from '../../../services/auth/auth.service';

//INTERFACE
import { userProfileUpdate } from './user-profile.interface';
import { RegistrationValidator } from './password-validation';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class UserProfileComponent implements OnInit {
  editProfile = true;
  editProfileIcon = 'icofont-edit';
  userProfileEditForm: FormGroup;
  public editor;
  public editorContent: string;
  public userID: 0;

  rowsContact = [];
  loadingIndicator = true;
  reorderable = true;
  public userInfo: any;
  public userName: any;
  public passwordFormSubmitted:boolean = false;
  public profileFormSubmitted:boolean = false;
  public profileUpdate: userProfileUpdate;
  passwordFormGroup: FormGroup;
  changePasswordForm: FormGroup;
  changePasswordFormFields: any = {
                                      new_password: '',
                                      confirm_password: '' 
                                  };
  constructor(
              private user: UsersService,
              private route: ActivatedRoute,
              private router: Router, 
              private auth: AuthService,
              private formBuilder: FormBuilder
  ) {



    this.passwordFormGroup = this.formBuilder.group({
      new_password: ['', Validators.compose([Validators.required,Validators.minLength(6)])],
      confirm_password: ['', Validators.required]
    }, {
      validator: RegistrationValidator.validate.bind(this)
    });

    this.changePasswordForm = new FormGroup({
      passwordFormGroup: this.passwordFormGroup,
      }
    );


    this.userInfo = this.auth.getUserInfo();
    console.log(this.userInfo);
    this.loadProfileData();
 
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      console.log('params', params);
      //Base64.decode();
      if(params.id){
          this.userID = params.id;
       }
       console.log(this.userID);

    });

  }


  loadProfileData(){
     
    const first_name    = new FormControl(this.userInfo.first_name, [Validators.required]);
    const last_name     = new FormControl(this.userInfo.last_name, [Validators.required]);
    const email         = new FormControl(this.userInfo.email, [Validators.required]);
    
    this.userProfileEditForm = new FormGroup({
      first_name: first_name,
      last_name: last_name,
      email: email
     }
   );

  }
  
  toggleEditProfile() {
    this.editProfileIcon = (this.editProfileIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editProfile = !this.editProfile;
  }

  userProfileEdit(){
    this.profileFormSubmitted = true;
    this.profileUpdate = {
       id: this.userInfo.id,
       first_name: this.userProfileEditForm.value.first_name,
       last_name: this.userProfileEditForm.value.last_name,
       email: this.userProfileEditForm.value.email
    };

    if(this.userProfileEditForm.valid){
        this.user.profileUpdate(this.profileUpdate).subscribe( resp => {
          console.log(resp);
          const httpResponse: any = resp;
          alert(httpResponse.message);
          
        });
    } 
    
  }

  changePassword() {
    this.passwordFormSubmitted = true;
    console.log(this.changePasswordForm);
    if(this.changePasswordForm.valid)
    {
     // console.log(this.userInfo.id + "checking" + this.changePasswordForm.value.passwordFormGroup.new_password);
       // this.userID = (this.userID > 0)?this.userID:this.userInfo.id; 

        this.user.changePassword(this.userInfo.id,this.changePasswordForm.value.passwordFormGroup.new_password)
                .subscribe((res:any) => {
                const httpResponse = res;
                if(httpResponse.status == 'success'){
                  alert('Password Changed Successfully');
                  //this.router.navigate(['/coupons/list']);
                }
        });
      }
    }

}