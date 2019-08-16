import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppcastPage } from './appcast.page';
import {MomentModule} from 'ngx-moment';
import {AppcastDetailsPage} from './appcast-details/appcast-details.page';
import {AppcastPageRoutingModule} from './appcast.router.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MomentModule,
    AppcastPageRoutingModule
  ],
  declarations: [AppcastPage]
})
export class AppcastPageModule {}
