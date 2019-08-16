import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MomentModule} from 'ngx-moment';
import {AppcastDetailsPage} from './appcast-details.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MomentModule,
    RouterModule.forChild([{ path: '', component: AppcastDetailsPage}])
  ],
  declarations: [AppcastDetailsPage]
})
export class AppcastDetailsPageModule {}
