import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProductsListComponent } from './vendor-products-list.component';

describe('ProductListComponent', () => {
  let component: VendorProductsListComponent;
  let fixture: ComponentFixture<VendorProductsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorProductsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
