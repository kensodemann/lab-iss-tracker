import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule  } from '../../pipes/pipes.module';
import { PassesPage } from './passes.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule,
    RouterModule.forChild([{ path: '', component: PassesPage }])
  ],
  declarations: [PassesPage]
})
export class PassesPageModule {}
