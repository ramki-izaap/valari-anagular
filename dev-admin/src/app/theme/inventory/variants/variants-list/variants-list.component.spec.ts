import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsListComponent } from './variants-list.component';

describe('VariantsListComponent', () => {
  let component: VariantsListComponent;
  let fixture: ComponentFixture<VariantsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
