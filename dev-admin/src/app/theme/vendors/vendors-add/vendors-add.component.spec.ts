import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsAddComponent } from './vendors-add.component';

describe('VendorsAddComponent', () => {
  let component: VendorsAddComponent;
  let fixture: ComponentFixture<VendorsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
