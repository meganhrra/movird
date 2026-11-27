import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { InicioPageRoutingModule } from './inicio-routing.module';
import { InicioPage } from './inicio.page';

import { TarjetaParqueoComponent } from '../../components/tarjeta-parqueo/tarjeta-parqueo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    TarjetaParqueoComponent,
  ],
  declarations: [InicioPage],
})
export class InicioPageModule {}
