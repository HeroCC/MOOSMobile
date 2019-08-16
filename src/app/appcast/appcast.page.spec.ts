import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppcastPage } from './appcast.page';

describe('AppcastPage', () => {
  let component: AppcastPage;
  let fixture: ComponentFixture<AppcastPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppcastPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppcastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
