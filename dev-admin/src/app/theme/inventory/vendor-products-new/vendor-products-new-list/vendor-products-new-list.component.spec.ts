import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProductsNewListComponent } from './vendor-products-new-list.component';

describe('VendorProductsNewListComponent', () => {
  let component: VendorProductsNewListComponent;
  let fixture: ComponentFixture<VendorProductsNewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorProductsNewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProductsNewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
