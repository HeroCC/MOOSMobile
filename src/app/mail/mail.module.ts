import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailPage } from './mail.page';
import {MomentModule} from 'ngx-moment';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MomentModule,
    RouterModule.forChild([{ path: '', component: MailPage }]),
  ],
  providers: [
    LocalNotifications
  ],
  declarations: [MailPage]
})
export class MailPageModule {}
