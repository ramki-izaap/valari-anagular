import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderViewComponent } from './sales-order-view.component';

describe('SalesOrderViewComponent', () => {
  let component: SalesOrderViewComponent;
  let fixture: ComponentFixture<SalesOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
