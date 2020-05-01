import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleComponent } from './add-single.component';

describe('AddSingleComponent', () => {
  let component: AddSingleComponent;
  let fixture: ComponentFixture<AddSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
