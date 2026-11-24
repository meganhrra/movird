# MoviRD

App móvil para encontrar parqueos públicos y privados en Santiago de los Caballeros.
Proyecto de Programación de Dispositivos Móviles (ISW-307), UAPA.

> Los parqueos, precios y horarios son datos de demostración.

## Tecnologías

- Ionic 9 + Angular 22 (NgModules)
- Capacitor (Android)

## Cómo correrlo

```bash
npm install
ionic serve                  # navegador
ionic capacitor run android  # emulador
```

Antes de subir cambios:

```bash
npm run format
npm run lint
npm test -- --watch=false
ionic build
```

## Estructura

```
src/
├── app/
│   ├── app.component.*      menú lateral y split-pane
│   ├── app-routing.module.ts
│   └── pages/
│       ├── inicio/
│       ├── mapa/
│       └── favoritos/
├── theme/variables.scss     colores
└── global.scss              fuentes y estilos generales
```

## Forma de trabajo

- `main` siempre debe compilar. Cada quien trabaja en su rama (`parte-2`, `parte-3`) y la integra con un Pull Request.
- Mensajes de commit cortos y en presente: `feat: ...`, `fix: ...`, `style: ...`, `chore: ...`.
- Usar `@for (item of items; track item.id)` en lugar de `*ngFor`.
- Mantener el encabezado de cada pantalla (`movird-header` con `ion-menu-button`).
- Los colores salen de `variables.scss` (`var(--movird-red)`, `var(--movird-cream)`, ...), no se escriben a mano.
- Ionic se puede importar desde `@ionic/angular` o `@ionic/angular/lazy`; dentro de un mismo archivo, usar solo uno.
