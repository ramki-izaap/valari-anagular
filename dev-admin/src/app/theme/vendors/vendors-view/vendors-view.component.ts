import { Component, OnInit, ViewChild, Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

// SERVICES
import { UsersService } from '../../../services/users/users.service';
import { AuthService } from '../../../services/auth/auth.service';
import { VendorInetrface } from '../../../theme/vendors/vendors-add/vendors-add.interface';
@Component({
  selector: 'app-vendors-view',
  templateUrl: './vendors-view.component.html',
  styleUrls: ['./vendors-view.component.scss']
})
export class VendorsViewComponent implements OnInit {

  public vendor: VendorInetrface;
  constructor(private router: Router, private route: ActivatedRoute, private user: UsersService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      if (params.id) {
        this.user.getVendor(params.id)
          .subscribe(mappedVendor => {
            this.vendor = mappedVendor;
            console.log(this.vendor);
          });
      }
    });
  }

  back() {
    this.router.navigate(['/vendors']);
  }

}
