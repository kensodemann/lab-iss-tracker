import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { MapPage } from '../map/map.page';
import { PassesPage } from '../passes/passes.page';
import { AstronautsPage } from '../astronauts/astronauts.page';

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
