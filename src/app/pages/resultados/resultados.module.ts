import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ResultadosPageRoutingModule } from './resultados-routing.module';
import { ResultadosPage } from './resultados.page';
import { TarjetaParqueoComponent } from '../../components/tarjeta-parqueo/tarjeta-parqueo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultadosPageRoutingModule,
    TarjetaParqueoComponent,
  ],
  declarations: [ResultadosPage],
})
export class ResultadosPageModule {}
