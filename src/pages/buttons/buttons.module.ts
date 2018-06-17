import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ButtonsPage, NewButton} from "./buttons";

@NgModule({
  declarations: [
    ButtonsPage,
    NewButton,
  ],
  entryComponents: [
    NewButton
  ],
  imports: [
    IonicPageModule.forChild(ButtonsPage),
  ],
})
export class ButtonsPageModule {}
