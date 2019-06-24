import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';

// SERVICES
import { UsersService } from '../../../services/users/users.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// INTERFACE
import { UserInetrface } from './user-add.interface';
import { AppSettingsService, CommonModalInterface } from './../../../services/app-settings.service';
// Validators
import { QstAsyncValidatorWrapper } from './../../../validators/async-validator-wrapper';
import { AsyncValidators } from './../../../validators/async-validator';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  private user: UserInetrface;
  public userForm: FormGroup;
  public userFormSubmitted:boolean = false;
  private firstName: FormControl;
  private lastName: FormControl;
  private email: FormControl;
  private password: FormControl;
  private asyncEmailValidator;
  constructor(private router: Router,private UsersService: UsersService,private route: ActivatedRoute,private modalService: NgbModal,
  private appSettingsService: AppSettingsService) { 

    this.asyncEmailValidator = AsyncValidators.validateStoreNOtTaken(this.UsersService, '0');
    this.user = {
      userId: '0',
      firstName:'',
      lastName: '',
      password: '',
      email: '',
    };

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      if (params.id) {
        this.UsersService.getUser(params.id)
          .subscribe(mappedUser => {
            this.user = mappedUser;
            console.log('test',this.user);
            this.asyncEmailValidator = AsyncValidators.validateStoreNOtTaken(this.UsersService, this.user.userId);
            this.createFormControls();
          });
      } else {
        this.createFormControls();
      }
    });
}

submit() {
  console.log(this.userForm.invalid, this.userForm);
  this.userFormSubmitted = true;
  if (this.userForm.invalid) {
    return;
  }
  
  this.user = {
    userId: this.user.userId,
    firstName: this.userForm.value.firstName,
    lastName:this.userForm.value.lastName,
    email: this.userForm.value.email,
    password: this.userForm.value.password,
  };

  if (this.user.userId === '0') {
    console.log('1111');
    this
      .UsersService
      .createUser(this.user)
      .subscribe((resp: any) => {
        console.log(resp);
        let modalData: CommonModalInterface = null;
        if (resp.status === 'success') {
          modalData = {
            title: 'Success',
            content: 'User created successfully',
            beforeDismiss: () => {
              this.router.navigate(['/user/list']);
            }
          };
        } else {
          modalData = {
            title: 'Error',
            content: resp.message,
            beforeDismiss: () => {}
          };
        }
        this.appSettingsService.setCommonModalData(modalData);
      });
  } else {
    console.log('2222');
    this
      .UsersService
      .updateUser(this.user)
      .subscribe((resp: any) => {
        console.log(resp);
        let modalData: CommonModalInterface = null;
        if (resp.status === 'success') {
          modalData = {
            title: 'Success',
            content: 'User updated successfully',
            beforeDismiss: () => {
              this.router.navigate(['/user/list']);
            }
          };
        } else {
          modalData = {
            title: 'Error',
            content: resp.message,
            beforeDismiss: () => {}
          };
        }
        this.appSettingsService.setCommonModalData(modalData);
      });
  }

}

private createFormControls() {
 
  console.log('User',this.user);
  this.firstName = new FormControl(this.user.firstName, [
    Validators.required
  ]);
  this.lastName = new FormControl(this.user.lastName, [
    Validators.required
  ]);
  this.email = new FormControl(this.user.email, [
    Validators.required,
    Validators.email
  ]);
  this.password = new FormControl('', [
    Validators.required
  ]);

  this.userForm = new FormGroup({
    firstName: this.firstName,
    lastName:this.lastName,
    password:this.password,
    email: this.email
  });

}

}
