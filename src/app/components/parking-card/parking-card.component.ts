import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { addIcons } from 'ionicons';
import { carSportOutline, heart, chevronForwardOutline } from 'ionicons/icons';
import { Parqueo } from '../../data/parking';

@Component({
  selector: 'app-parking-card',
  standalone: true,
  imports: [NgClass, NgIf, IonicModule],
  template: `
    <ion-card
  class="parking-card"
  (pointerdown)="iniciarPulsacion()"
  (pointerup)="cancelarPulsacion()"
  (pointerleave)="cancelarPulsacion()"
  (pointercancel)="cancelarPulsacion()"
  >
      <div class="top">
        <div class="icon-box">
          <ion-icon name="car-sport-outline"></ion-icon>
        </div>
        <div class="info">
          <h3>{{ parqueo.nombre }}</h3>
          <span class="tipo">{{ parqueo.tipo }}</span>
        </div>
        <ion-icon name="heart" class="heart"></ion-icon>
      </div>

      <p class="meta">
        {{ parqueo.distancia }} • <strong>{{ parqueo.precio }}</strong> • {{ parqueo.horario }}
      </p>

      <div class="bottom">
        <span class="badge" [ngClass]="parqueo.disponibilidad === 'disponible' ? 'ok' : 'warn'">
          {{
            parqueo.disponibilidad === 'disponible'
              ? 'Información disponible'
              : 'Disponibilidad no confirmada'
          }}
        </span>
        <ion-button fill="clear" size="small" class="details">
          Ver detalles
          <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
        </ion-button>
      </div>
      <div class="opciones-presion" *ngIf="opcionesVisibles">
  <ion-button size="small" fill="clear" (click)="opcionesVisibles = false">
    Cerrar opciones
  </ion-button>
  <span>Opciones del parqueo: {{ parqueo.nombre }}</span>
</div>
    </ion-card>
  `,
  styles: [
    `
      .parking-card {
        margin: 0;
        padding: 14px 16px 10px;
        border-radius: 18px;
        background: #fff;
        border: 1px solid #f3d6d3;
        box-shadow: 0 2px 10px rgba(217, 72, 72, 0.06);
      }
      .top {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .icon-box {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: #fde4e1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #d94848;
        font-size: 22px;
      }
      .info {
        flex: 1;
      }
      .info h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 500;
        color: #222;
      }
      .tipo {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        color: #d94848;
      }
      .heart {
        color: #d94848;
        font-size: 22px;
      }
      .meta {
        margin: 12px 0 8px;
        font-size: 12px;
        color: #777;
      }
      .meta strong {
        color: #222;
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #f3d6d3;
        padding-top: 6px;
      }
      .badge {
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 10px;
      }
      .badge.warn {
        background: #fdebc8;
        color: #8a5a00;
      }
      .badge.ok {
        background: #d9f2de;
        color: #2c7a3f;
      }
      .details {
        --color: #d94848;
        font-size: 12px;
        font-weight: 700;
        text-transform: none;
      }
    `,
  ],
})
export class ParkingCardComponent {
  @Input({ required: true }) parqueo!: Parqueo;
  opcionesVisibles = false;
private temporizador?: ReturnType<typeof setTimeout>;

iniciarPulsacion() {
  this.cancelarPulsacion();

  this.temporizador = setTimeout(() => {
    this.opcionesVisibles = true;
  }, 500);
}

cancelarPulsacion() {
  if (this.temporizador) {
    clearTimeout(this.temporizador);
    this.temporizador = undefined;
  }
}

  constructor() {
    addIcons({ carSportOutline, heart, chevronForwardOutline });
  }
}
