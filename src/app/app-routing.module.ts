import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then((m) => m.InicioPageModule),
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then((m) => m.MapaPageModule),
  },
  {
    path: 'favoritos',
    loadChildren: () =>
      import('./pages/favoritos/favoritos.module').then((m) => m.FavoritosPageModule),
  },
  {
    path: 'resultados',
    loadChildren: () =>
      import('./pages/resultados/resultados.module').then((m) => m.ResultadosPageModule),
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
