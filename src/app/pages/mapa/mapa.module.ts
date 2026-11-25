import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { MapaPageRoutingModule } from './mapa-routing.module';
import { MapaPage } from './mapa.page';
import { ParkingCardComponent } from '../../components/parking-card/parking-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageRoutingModule,
    ParkingCardComponent,
  ],
  declarations: [MapaPage],
})
export class MapaPageModule {}
