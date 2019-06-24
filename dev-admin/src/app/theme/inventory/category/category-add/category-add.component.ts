import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { UsersService } from '../../../../services/users/users.service';
import { AuthService } from '../../../../services/auth/auth.service';

// SERVICES
import { AppSettingsService, CommonModalInterface } from '../../../../services/app-settings.service';

// INTERFACE
import { CategoryCreation } from './category-add.interface';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {

  private categoryForm: CategoryCreation = {  id: 0,
    category_name: ''
    };
    myForm : FormGroup;
    catForm : any; 
    userInfo : any;
    public categoryFormSubmitted:boolean = false;
  constructor(private user: UsersService, private route: ActivatedRoute,
    private router: Router,private authService: AuthService,private appSettingsService: AppSettingsService) { 
      this.userInfo = this.authService.getUserInfo();
      console.log(this.userInfo); 
    }

  ngOnInit() {

    const category_name          = new FormControl(this.categoryForm.category_name, [Validators.required]);
    this.myForm = new FormGroup({
                  category_name: category_name
                  }
    );
  }

  CategoryCreation()
  {

    this.categoryFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    
     this.catForm = { category_name : this.myForm.value.category_name,
                      user_id : this.userInfo.id};
     console.log(this.catForm);

    this.user.category(this.catForm).subscribe( resp => {
      console.log(resp);
      const httpResponse: any = resp;
        let modalData: CommonModalInterface = null;
        if (resp.status === 'success') {
          modalData = {
            title: 'Success',
            content: httpResponse.message,
            beforeDismiss: () => {
              this.router.navigate(['/category/list']);
            }
          };
        } else {
          modalData = {
            title: 'Error',
            content: httpResponse.message,
            beforeDismiss: () => {}
          };
        }
        this.appSettingsService.setCommonModalData(modalData);
        });
    
  }

}
