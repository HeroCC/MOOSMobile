import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SettingsPage } from './settings.page';
import {IonicStorageModule} from '@ionic/storage';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        IonicStorageModule.forRoot(),
        RouterModule.forChild([{path: '', component: SettingsPage}]),
        ReactiveFormsModule
    ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
