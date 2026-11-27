import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { FavoritosPageRoutingModule } from './favoritos-routing.module';
import { FavoritosPage } from './favoritos.page';
import { TarjetaParqueoComponent } from '../../components/tarjeta-parqueo/tarjeta-parqueo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritosPageRoutingModule,
    TarjetaParqueoComponent,
  ],
  declarations: [FavoritosPage],
})
export class FavoritosPageModule {}
