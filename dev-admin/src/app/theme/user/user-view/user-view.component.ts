import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// SERVICES
import { UsersService } from '../../../services/users/users.service';

// INTERFACE
import { UserInetrface } from '../../../theme/user/user-add/user-add.interface';
@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  public user:UserInetrface;
  constructor(private UsersService: UsersService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      console.log(params);
      if (params.id) {
        this.UsersService.getUser(params.id)
          .subscribe(mappedUser => {
            this.user = mappedUser;
            console.log('Edit profile info',this.user);
          });
      } 
    });

  }
  
  back() {
    this.router.navigate(['/user/list/']);
  }
  

}
