import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: '../map/map.module#MapPageModule'
          }
        ]
      },
      {
        path: 'mail',
        children: [
          {
            path: '',
            loadChildren: '../mail/mail.module#MailPageModule'
          }
        ]
      },
      {
        path: 'appcast',
        children: [
          {
            path: '',
            loadChildren: '../appcast/appcast.module#AppcastPageModule'
          }
        ]
      },
      {
        path: 'commander',
        children: [
          {
            path: '',
            loadChildren: '../commander/commander.module#CommanderPageModule'
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: '../settings/settings.module#SettingsPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/map',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
