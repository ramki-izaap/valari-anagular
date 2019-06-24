import {Component, OnInit, Input, ViewEncapsulation,ViewChild, ElementRef} from '@angular/core';
import { UsersService } from '../../services/users/users.service';
// import { NotifyItnerface } from './notify.interface';
// import {NotificationComponent} from '../../theme/ui-elements/advance/notification/notification.component';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesComponent implements OnInit {
  // @ViewChild(NotificationComponent) notify: NotificationComponent;
  @Input() id: number;
  @Input() type: string;
  public description:string;
  // public notify_options: NotifyItnerface;
  public notes;
  public errnote:boolean=false;
  constructor(public users:UsersService) { 
      
  }

  ngOnInit() {
    console.log('Id',this.id);
    if(this.id)
    {
        let data = {id:this.id,type:this.type};
        this.users.getNotes(data).subscribe((data)=>{
            console.log(data);
            this.notes = data.notes;
        },(error)=>{
            console.log(error);
        });
    }
  }

  showModal()
  {
    document.querySelector('#effect-1').classList.add('md-show');

  } 
  addNote()
  {
    // let element: HTMLElement = document.getElementById('notifyClick') as HTMLElement;
    // element.click();
    if( this.description ==='' || this.description == '' || this.description === null || this.description === undefined)
    {
      this.errnote = true;
    }
    else
    {
      let data = {desc:this.description,type:this.type,id:this.id};
      this.errnote = false;
      this.users.addNotes(data).subscribe((data)=>{
        console.log(data);
        this.close('effect-1');
        if(data.status === 'success')
        {
          this.notes = data.notes;          
          alert("Notes added Successfully");
        }
        else
        {
          alert("Something Went Wrong!");
        }
      },(error)=>{
        console.log(error);
      })
    }
  }

  close(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }
}
