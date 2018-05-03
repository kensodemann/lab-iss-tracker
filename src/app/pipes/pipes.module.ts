import { NgModule } from '@angular/core';
import { AddressPipe } from './address/address.pipe';
@NgModule({
	declarations: [AddressPipe],
	imports: [],
	exports: [AddressPipe]
})
export class PipesModule {}
