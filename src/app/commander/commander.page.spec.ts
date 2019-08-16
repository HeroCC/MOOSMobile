import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanderPage } from './commander.page';

describe('AppcastPage', () => {
  let component: CommanderPage;
  let fixture: ComponentFixture<CommanderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommanderPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommanderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
