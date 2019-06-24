import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderCreateComponent } from './sales-order-create.component';

describe('PurchaseCreateComponent', () => {
  let component: SalesOrderCreateComponent;
  let fixture: ComponentFixture<SalesOrderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
