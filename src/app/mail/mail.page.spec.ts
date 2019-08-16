import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailPage } from './mail.page';

describe('MailPage', () => {
  let component: MailPage;
  let fixture: ComponentFixture<MailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MailPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
