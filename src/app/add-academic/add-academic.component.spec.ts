import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAcademicComponent } from './add-academic.component';

describe('AddAcademicComponent', () => {
  let component: AddAcademicComponent;
  let fixture: ComponentFixture<AddAcademicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAcademicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAcademicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
