# nazumo

Aplicación mobile-first para aprender japonés mediante reconocimiento, memoria y escritura. Construida con Next.js, React, TypeScript, Tailwind CSS y App Router.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`.

## Comprobaciones

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Estructura

- `src/app`: rutas, layout y estilos globales.
- `src/components`: shell, navegación y piezas reutilizables de interfaz.
- `src/lib`: tipos y datos de dominio.
- `src/hooks`: persistencia local y estado de aprendizaje.
- `src/lib/supabase`: clientes con cookies para servidor y navegador.
- `supabase/schema.sql`: tabla de sincronización de progreso con RLS.

## PWA e iconos

El manifest se genera desde `src/app/manifest.ts` y el Service Worker está en
`public/sw.js`. El registro solo se activa en producción para no interferir con
el desarrollo local.

Cuando cambie el contenido precacheado, incrementa `CACHE_VERSION` en
`public/sw.js` para que las instalaciones existentes renueven el shell offline.

Los iconos utilizan el personaje lineal de nazumo sobre el color morado de la
marca. Para sustituirlos en el futuro, conserva los nombres y tamaños de estos archivos:

- `src/app/favicon.ico`: favicon de 32 × 32 px.
- `src/app/icon.png`: icono general de 192 × 192 px.
- `src/app/apple-icon.png`: Apple Touch Icon de 180 × 180 px.
- `public/icons/kana-192.png`: icono PWA de 192 × 192 px.
- `public/icons/kana-512.png`: icono PWA de 512 × 512 px.
- `public/icons/kana-maskable-512.png`: icono maskable de 512 × 512 px.

## Producción y cuentas

La interfaz de cuenta usa Supabase Auth cuando el proyecto está configurado. Para activar registro, inicio de sesión, confirmación de correo y sincronización entre dispositivos, sigue [`docs/cuenta-y-sincronizacion.md`](docs/cuenta-y-sincronizacion.md).

Sin las variables de Supabase, el modo local mantiene el progreso en el navegador. Una vez conectado el backend, el progreso se fusiona con la copia de la cuenta y se sincroniza en segundo plano.

## Datos de orden de trazos

Los vectores y el orden de trazos proceden de KanjiVG y se incluyen localmente
para que la práctica funcione sin conexión. Consulta la fuente, licencia CC
BY-SA 3.0 y requisitos de atribución en [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md).
