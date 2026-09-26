# Cuentas y progreso entre dispositivos

Nazumo integra Supabase Auth mediante sesiones PKCE en cookies y la API SSR oficial. El progreso sigue disponible en el almacenamiento local mientras no se configure el servicio remoto.

## Conectar el entorno

1. Crea un proyecto Supabase y ejecuta [`supabase/schema.sql`](../supabase/schema.sql) en SQL Editor.
2. En Supabase, configura **Site URL** como `https://nazumo.vercel.app` y añade estas URL exactas a las redirecciones permitidas: `https://nazumo.vercel.app/auth/confirm`, `https://nazumo.vercel.app/auth/recover`, `http://localhost:3000/auth/confirm` y `http://localhost:3000/auth/recover`.
3. En Vercel, configura las variables siguientes para Production, Preview y Development:
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL del proyecto Supabase.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: publishable key del proyecto.
   - `NEXT_PUBLIC_SITE_URL`: `https://nazumo.vercel.app` en producción y la URL correspondiente en preview.
4. Configura el proveedor de correo de Supabase para confirmaciones y recuperación de contraseña; mantén los enlaces de plantilla basados en `{{ .ConfirmationURL }}` para que el intercambio PKCE vuelva a las rutas callback de Nazumo.
5. Despliega de nuevo. `/cuenta` mostrará registro e inicio de sesión reales; al confirmar el correo se crea la sesión y el progreso local se fusiona con la copia privada de la cuenta.

No añadas una `service_role` key a variables `NEXT_PUBLIC_*` ni al navegador. La clave publishable se usa con la sesión del usuario y RLS; el endpoint deriva el identificador de la sesión validada y nunca acepta un `user_id` del cliente.

## Comportamiento de sincronización

- Una cuenta nueva sube el progreso que ya existía en ese navegador.
- En un dispositivo con progreso local y remoto, combina unidades desbloqueadas/completadas, personajes, fechas de actividad y sesiones sin duplicar intentos idénticos.
- Las nuevas acciones de estudio se guardan localmente primero; una sesión autenticada las replica cuando hay conexión.
- La programación del vocabulario espaciado se incluye en el progreso sincronizado; las palabras más difíciles vuelven antes y las repasadas actualizan la actividad diaria.
- Una sesión cerrada conserva el progreso local del dispositivo. Los datos remotos pertenecen a la cuenta y se eliminan al borrar dicha cuenta en Supabase.
- Si hay un error de red, el estudio sigue funcionando localmente y el siguiente cambio vuelve a intentar la sincronización.

La reconciliación conserva el máximo de contadores por ejercicio para evitar duplicarlos al sincronizar la misma copia en dispositivos distintos. Las sesiones se deduplican por unidad y marca temporal.
