import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzTableComponent } from './iz-table.component';

describe('IzTableComponent', () => {
  let component: IzTableComponent;
  let fixture: ComponentFixture<IzTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
