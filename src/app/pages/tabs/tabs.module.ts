import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { AstronautsPageModule } from '../astronauts/astronauts.module';
import { ConfigurationPageModule } from '../configuration/configuration.module';
import { MapPageModule } from '../map/map.module';
import { PassesPageModule } from '../passes/passes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    AstronautsPageModule,
    ConfigurationPageModule,
    MapPageModule,
    PassesPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
