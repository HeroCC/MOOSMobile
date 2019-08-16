import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppcastDetailsPage } from './appcast-details.page';

describe('AppcastDetailsPage', () => {
  let component: AppcastDetailsPage;
  let fixture: ComponentFixture<AppcastDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppcastDetailsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppcastDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
