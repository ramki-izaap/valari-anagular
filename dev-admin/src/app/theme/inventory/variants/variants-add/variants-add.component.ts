import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { InventoryService } from '../../../../services/inventory/inventory.service';
import { AuthService } from '../../../../services/auth/auth.service';

// SERVICES
import { AppSettingsService, CommonModalInterface } from '../../../../services/app-settings.service';

// INTERFACE
import { VariantsCreation,VariantsValueCreation } from './variants-add.interface';
//import { VariantsValueCreation } from './variants-add.interface';

@Component({
  selector: 'app-variants-add',
  templateUrl: './variants-add.component.html',
  styleUrls: ['./variants-add.component.scss']
})
export class VariantsAddComponent implements OnInit {
  private Variantsform : VariantsCreation = { id: 0,variants_name:'' };
  private VariantsValueform : VariantsValueCreation = { variants_id: '', variants_value:'', short_code:'' };
  myForm : FormGroup;
  myForm1 : FormGroup;
  public userInfo : any;
  public varForm : any;
  public variantslist : any;
  public variantsFormSubmitted:boolean = false;
  public variantsValueFormSubmitted:boolean = false;
  public varvalForm : any;
  constructor(private inventory: InventoryService,private route: ActivatedRoute,
    private router: Router,private authService: AuthService,private appSettingsService: AppSettingsService) { 
      this.userInfo = this.authService.getUserInfo();
      console.log(this.userInfo); 
    }

  ngOnInit() {
    
    const variants_name  = new FormControl(this.Variantsform.variants_name, [Validators.required]);
    this.myForm = new FormGroup({
      variants_name: variants_name
      });
    
    const variants_id = new FormControl(this.VariantsValueform.variants_id, [Validators.required]);
    const variants_value = new FormControl(this.VariantsValueform.variants_value, [Validators.required]);
    const short_code = new FormControl(this.VariantsValueform.short_code, [Validators.required]);
    this.myForm1 = new FormGroup({ 
      variants_id : variants_id,
      variants_value : variants_value,
      short_code : short_code
    });
     
      this.inventory.listVariantsName().subscribe( result => {
       // console.log(result);
        const httpResponse: any = result;
        this.variantslist = httpResponse.variants;
      });
  }

  // VariantsCreation()
  // {

  //   this.variantsFormSubmitted = true;
  //   if (this.myForm.invalid) {
  //     return;
  //   }
   
  //   this.varForm = { variants_name : this.myForm.value.variants_name,
  //     user_id : this.userInfo.id};
  //     console.log(this.varForm);
  //     this.inventory.variants(this.varForm).subscribe( resp => {
  //     console.log(resp);
  //     const httpResponse: any = resp;
  //     let modalData: CommonModalInterface = null;
  //         if (resp.status === 'success') {
  //           modalData = {
  //             title: 'Success',
  //             content: httpResponse.message,
  //             beforeDismiss: () => {
  //               this.router.navigate(['/variants/list']);
  //             }
  //           };
  //         } else {
  //           modalData = {
  //             title: 'Error',
  //             content: httpResponse.message,
  //             beforeDismiss: () => {}
  //           };
  //         }
  //         this.appSettingsService.setCommonModalData(modalData);
  //     });
  // }

  VariantsValueCreation()
  {

    this.variantsValueFormSubmitted = true;
    if (this.myForm1.invalid) {
      return;
    }

     this.varvalForm = { variants_id: this.myForm1.value.variants_id,
      variants_value : this.myForm1.value.variants_value,
      short_code:this.myForm1.value.short_code,user_id : this.userInfo.id };
      
      this.inventory.variantsValue(this.varvalForm).subscribe( resp => {
        console.log(resp);
        const httpResponse: any = resp;
        let modalData: CommonModalInterface = null;
                if (resp.status === 'success') {
                  modalData = {
                    title: 'Success',
                    content: httpResponse.message,
                    beforeDismiss: () => {
                      this.router.navigate(['/variants/list']);
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
