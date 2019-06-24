import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsAddComponent } from './variants-add.component';

describe('VariantsAddComponent', () => {
  let component: VariantsAddComponent;
  let fixture: ComponentFixture<VariantsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
