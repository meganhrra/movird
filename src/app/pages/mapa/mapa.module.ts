import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { MapaPageRoutingModule } from './mapa-routing.module';
import { MapaPage } from './mapa.page';
import { TarjetaParqueoComponent } from '../../components/tarjeta-parqueo/tarjeta-parqueo.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MapaPageRoutingModule, TarjetaParqueoComponent],
  declarations: [MapaPage],
})
export class MapaPageModule {}
