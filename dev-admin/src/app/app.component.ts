import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

// SERVICES
import { AppSettingsService, CommonModalInterface } from './services/app-settings.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Clara';
  @ViewChild('commonModal') commonModal: TemplateRef<any>;
  private commonModalData: CommonModalInterface = null;
  constructor(private router: Router,
    private modalService: NgbModal,
    private appSettingsService: AppSettingsService
  ) {
    this.commonModalData = {
      title: '',
      content: ''
    };
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this
      .appSettingsService
      .commonModal$
      .subscribe(commonModalData => {
        console.log('commonModalData', commonModalData);
        if (commonModalData) {
          this.commonModalData = commonModalData;
          this.modalService.open(this.commonModal, {beforeDismiss: this.commonModalData.beforeDismiss});
        }
      });
  }

}
