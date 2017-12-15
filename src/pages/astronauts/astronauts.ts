import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-astronauts',
  templateUrl: 'astronauts.html'
})
export class AstronautsPage {
  constructor(private navCtrl: NavController) {}
}
