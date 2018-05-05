import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AstronautsPage } from '../astronauts/astronauts.page';
import { ConfigurationPage } from '../configuration/configuration.page';
import { MapPage } from '../map/map.page';
import { PassesPage } from '../passes/passes.page';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'map',
        outlet: 'map',
        component: MapPage
      },
      {
        path: 'passes',
        outlet: 'passes',
        component: PassesPage
      },
      {
        path: 'astronauts',
        outlet: 'astronauts',
        component: AstronautsPage
      },
      {
        path: 'configuration',
        outlet: 'configuration',
        component: ConfigurationPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(map:map)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
