import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MysinglesComponent } from './mysingles.component';

describe('MysinglesComponent', () => {
  let component: MysinglesComponent;
  let fixture: ComponentFixture<MysinglesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysinglesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MysinglesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
