import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponsAddComponent } from './coupons-add.component';

describe('CouponsAddComponent', () => {
  let component: CouponsAddComponent;
  let fixture: ComponentFixture<CouponsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
