import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { InventoryService } from '../../../services/inventory/inventory.service';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';


// INTERFACE

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.scss'],
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
export class ProductUploadComponent implements OnInit {

public uploadDiv:boolean = true;
public progressDiv:boolean = false;
public errorDiv:boolean = false;
public successDiv:boolean = false;
public errorDiv2:boolean = false;
public up_error;
public fileToUpload ="";
public import_type:string = "";
public file_error:boolean = false;
public import_error:boolean = false;
public download_csv_type:string="";
public csv_download_url:string = "./docs/product-import.csv";
public filepath:string='';
public errors = [];
public showConfirmButtom:boolean = false;
public invalid_sku: any;
public invalid_images: any;
public imageUploadErrors: boolean = false;
public image_upload_erros: any;
public image_upload_success: boolean = false;
public progressImagesDiv: boolean = false; 
  constructor(  public inventoryService:InventoryService,
                public modalService: NgbModal, 
                public route: ActivatedRoute,
                public router: Router
  ) { 

      
    }
  

  ngOnInit() {
     
  }

  onFileChange(event)
  {
    let filename = event.target.files.item(0);
    console.log('Event',filename);
    this.fileToUpload = filename;
    console.log(filename);
  }
  
  uploadImages()
  {
    const status = confirm("Please make sure if you have images in the path!" + '\n' + "/var/www/html/api/uploads/product_images");
    if (status) {
      this.uploadDiv = false;
      this.progressImagesDiv = true;    
      this.inventoryService.productImageUploadCSV().subscribe(( data : any) => {

        if(data.status==='success'){
          // this.loadPage();
          this.uploadDiv         = this.errorDiv = this.progressDiv = this.errorDiv2 = false;
          this.showConfirmButtom = false;          
          
          this.invalid_sku       = data.invalid_sku;
          this.invalid_images    = data.invalid_images;
          this.image_upload_success = true;
          this.progressImagesDiv = false;
          console.log('invalid_sku: '+ data.invalid_sku);
          console.log('invalid_images: '+ data.invalid_images);
          setTimeout(() => {
            this.uploadDiv = true;
            this.image_upload_success = false;
          }, 3000);
        }
        else
        {
          this.imageUploadErrors = true;
          this.image_upload_erros = data.msg;
          this.invalid_sku = '';
          this.invalid_images = '';
        }

      });
   }
  }


  uploadSubmit()
  {

    console.log("Import type", this.import_type);

    console.log(this.fileToUpload);
    if(this.import_type === '' || this.fileToUpload === '')
    {
      if(this.import_type === '')
        this.import_error = true;
      else
        this.import_error = false;
      if(this.fileToUpload === '')
        this.file_error = true;
      else
        this.file_error = false;
    }
    else  
    {
      this.uploadDiv = false;
      this.progressDiv = true;

      console.log(this.fileToUpload);

        this.inventoryService.uploadCSV(this.import_type,this.fileToUpload).subscribe(( data : any) => {

          console.log('Upload Response',data);

          if(data.status == 'error')
          {
            this.uploadDiv = true;
            this.progressDiv = false;
            this.errorDiv = true;
            this.up_error = data['error'];
          }
          else
          {
            this.progressDiv = this.errorDiv = this.errorDiv2 = false;
            // do something, if upload success
            let upload_response = data['response'];

            if(upload_response.status === 'error')
            {
              if(upload_response.type==='columns')
                this.showConfirmButtom = false;
              else
              {
                this.showConfirmButtom = true;
                this.filepath = data['file_path'];
              }
              this.uploadDiv = true;
              this.errorDiv2 = true;
              this.errors = upload_response.errors;
            }
            else
            {
              // this.loadPage();
              this.uploadDiv = this.errorDiv = this.progressDiv = this.errorDiv2 = false;
              this.showConfirmButtom = false;          
              this.successDiv = true;
              this.invalid_sku       = '';
              this.invalid_images    = '';
            }
            console.log(data);
            
            setTimeout(() => {
              this.uploadDiv = true;
              this.successDiv = false;
            }, 3000);

          }
          }, 
          error => {
            console.log(error);
          }
        );
    }
  }

  confirmUpload()
  {
    this.progressDiv = true;
    this.errorDiv = this.uploadDiv = false;
    console.log('Filepath',this.filepath);
    this.inventoryService.uploadCSV(this.import_type,this.filepath,'confirm').subscribe(data => {
      let upload_response = data['response'];
      if(upload_response.status==='success')
          {
            this.uploadDiv = this.errorDiv = this.progressDiv  = false;
            this.showConfirmButtom = false;          
            this.successDiv = true;
          }
    });
  }

  onSelectChange(event)
  {
    this.import_type = event.target.value;
    console.log(this.import_type);
  }

  onDownloadTypeChange(event)
  {
    this.download_csv_type = event.target.value;

      if(this.download_csv_type == '1')
        this.csv_download_url = './docs/product-import.csv';
      else
        this.csv_download_url = './docs/product-update.csv';

  }
  downloadCSV()
  {
    if(this.download_csv_type==='')
    {
      alert("Please Select download CSV type");
      return false;
    }
  }

}
