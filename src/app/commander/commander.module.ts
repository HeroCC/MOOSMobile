import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommanderPage, NewButtonComponent} from './commander.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: CommanderPage }, { path: 'addNewButton', component: NewButtonComponent}])
  ],
  declarations: [CommanderPage, NewButtonComponent]
})
export class CommanderPageModule {}
