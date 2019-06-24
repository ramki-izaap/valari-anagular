import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {AddressInterface} from '../../theme/sales-order/sales-order-interfaces';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddressComponent implements OnInit {
  @Input() address: AddressInterface;
  
  constructor() { 
      
  }

  ngOnInit() {

  }


}
