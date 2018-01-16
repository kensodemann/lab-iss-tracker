import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AstronautsPage } from './astronauts';

@NgModule({
  declarations: [AstronautsPage],
  imports: [IonicPageModule.forChild(AstronautsPage)],
  entryComponents: [AstronautsPage]
})
export class AstronautsPageModule {}
