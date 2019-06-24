import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsValueListComponent } from './variants-value-list.component';

describe('VariantsValueListComponent', () => {
  let component: VariantsValueListComponent;
  let fixture: ComponentFixture<VariantsValueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantsValueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantsValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
