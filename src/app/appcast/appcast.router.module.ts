import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppcastPage } from './appcast.page';

const routes: Routes = [
  { path: '', component: AppcastPage },
  {
    path: 'appcast-details',
    children: [
      {
        path: '',
        loadChildren: './appcast-details/appcast-details.module#AppcastDetailsPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppcastPageRoutingModule {}
