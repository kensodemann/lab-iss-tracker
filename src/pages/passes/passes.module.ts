import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PassesPage } from './passes';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [PassesPage],
  imports: [IonicPageModule.forChild(PassesPage), PipesModule],
  entryComponents: [PassesPage]
})
export class PassesPageModule {}
