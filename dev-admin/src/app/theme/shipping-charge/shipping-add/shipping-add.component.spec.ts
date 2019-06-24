import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddComponent } from './shipping-add.component';

describe('ShippingAddComponent', () => {
  let component: ShippingAddComponent;
  let fixture: ComponentFixture<ShippingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
