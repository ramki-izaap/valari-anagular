import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

import { UsersService } from '../../services/users/users.service';

export interface LogInterface{
    decription:string;
    createdTime:string;
    createdBy:string;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})



export class LogsComponent implements OnInit {
    public showLog:boolean = false;
    public logtitle:string = "Show Log History";
  @Input() id: number;
  @Input() type: string;
  public logs:LogInterface;
  constructor(public users:UsersService) { 
      
  }

  ngOnInit() {
    console.log('Id',this.id);
    if(this.id)
    {
        let data = {id:this.id,type:this.type};
        this.users.getLogs(data).subscribe((data)=>{
            this.logs = data.msg;
            
        },(error)=>{
            console.log(error);
        });
    }
  }
    log()
    {
        if(this.showLog === true)
        {
            this.showLog = false;
            this.logtitle = 'Show Log History';
        }
        else{
            this.showLog = true;
            this.logtitle = 'Hide Log History';
        }

    }


}
