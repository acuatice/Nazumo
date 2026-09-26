# Auditoría móvil y de producto de Nazumo

**Fecha:** 26 de septiembre de 2026  
**Entorno revisado:** producción en `https://nazumo.vercel.app` y compilación local de producción  
**Viewport móvil:** 390 × 844 px

## Estado observado

- La interfaz ya se comporta como una app móvil: navegación inferior fija con Inicio, Aprender, Práctica y Progreso; áreas seguras para iOS; tarjetas táctiles; PWA instalable y transiciones entre rutas.
- El recorrido principal de hiragana ofrece una ruta progresiva de reconocimiento, escritura y práctica. La guía de inicio explica el primer paso y se puede omitir.
- Inicio muestra el avance y un acceso a continuar. El vocabulario estaba separado de esa ruta; ahora Inicio prioriza los repasos vencidos y dirige a `/vocabulario`.
- Vocabulario incluye 12 palabras en contexto, tandas de cinco, revelado de traducción y ejemplo, autoevaluación y repasos espaciados. En la tarjeta ahora se puede escuchar la palabra con la voz japonesa disponible en el dispositivo.
- La página Progreso muestra unidades completadas, caracteres y sesiones. Los repasos de vocabulario cuentan ahora como actividad diaria para la racha.
- La cuenta real con Supabase ya está activa en producción: `/cuenta` ofrece inicio de sesión, alta, recuperación y confirmación de contraseña; la navegación móvil identifica el acceso como “Cuenta”.
- El endpoint de progreso en producción devuelve `401 unauthorized` sin una sesión, señal de que no permite acceso anónimo. Falta recorrer alta y confirmación con una cuenta de prueba y verificar la continuidad en un segundo dispositivo.
- La guía inicial mantiene el foco dentro del diálogo, vuelve al botón que la abrió al cerrarse y deja el resto de la app inerte mientras está abierta.

## Comparación de patrones de producto

| Patrón observado en otras apps | Implicación para Nazumo | Estado |
| --- | --- | --- |
| Duolingo acorta la tarea diaria y mezcla repaso con avance por la ruta. | Hacer visible una acción concreta al volver a Inicio; no dejar vocabulario como isla. | CTA dinámico hacia los repasos vencidos; el resto de rutas existentes se conserva. |
| Busuu y LingoDeer vuelven antes sobre elementos débiles y espacian los que el alumno recuerda. | Programar por palabra, con autoevaluación rápida y sesiones pequeñas. | Hecho para las 12 palabras: intervalos de 1, 3, 7, 14 y 30 días; las difíciles vuelven en 10 minutos. |
| Las apps de aprendizaje necesitan continuidad entre sesiones y dispositivos. | El progreso, la actividad diaria y el calendario de repaso deben sobrevivir al cambio de dispositivo. | Supabase Auth y el endpoint protegido están activos; la sincronización entre dos sesiones/dispositivos queda pendiente de una prueba con cuenta real. |
| Una interfaz móvil de uso frecuente necesita navegación reconocible y respuesta sin brusquedad. | Mantener navegación inferior, animar las transiciones y respetar movimiento reducido. | Hecho: navegación, transiciones, línea y Ten animados; la hoja global limita animaciones para `prefers-reduced-motion`. |

## Mejoras realizadas en esta auditoría

- Repaso espaciado en tandas breves con selección de palabras vencidas y nuevas.
- Estado del vocabulario fusionado entre copias locales y remotas, con validación de fechas e intervalos.
- Las revisiones actualizan la actividad diaria y la racha.
- Inicio detecta repasos vencidos y los convierte en el siguiente paso destacado.
- Los intervalos usan días UTC para evitar cambios de una hora al cruzar el horario de verano.
- Revisión visual de Inicio, Vocabulario y Progreso a 390 × 844 px, y confirmación de que Vocabulario y la navegación nueva responden correctamente.
- Revisión de `/cuenta` y el onboarding a 375 × 812 px; alta, recuperación y acceso visibles en producción; flujo de teclado del diálogo comprobado en local.
- Enlace de cuenta explícito en navegación móvil y callback compatible con `code` PKCE y `token_hash` de Supabase.
- Pronunciación japonesa opcional en vocabulario, probada en móvil a 375 × 812 px; la tarjeta conserva la traducción oculta hasta que el alumno la revele.

## Pendiente para cerrar el objetivo

1. Crear una cuenta de prueba, confirmar el correo, iniciar sesión y probar recuperación de contraseña en producción.
2. Verificar que el progreso local se fusiona con la cuenta y reaparece al iniciar sesión en otro dispositivo; revisar las políticas RLS después de la primera escritura.
3. Añadir una modalidad de respuesta escrita al vocabulario; hoy el repaso evalúa recuerdo mediante autoevaluación.
4. Incorporar una meta diaria configurable y mostrar su avance junto al siguiente paso, manteniendo rachas sin presión excesiva.

## Referencias de producto

- [Duolingo: diseño de ruta, repaso espaciado y práctica integrada](https://blog.duolingo.com/new-duolingo-home-screen-design/)
- [Duolingo: metas pequeñas y práctica habitual](https://blog.duolingo.com/putting-in-work-the-habit-of-language-learning/)
- [Busuu: repaso de vocabulario y algoritmo de repetición espaciada](https://www.busuu.com/en/english/personalized-study-plan-busuu-premium)
- [LingoDeer: sistema SRS y programación según el dominio](https://support.lingodeer.com/en/support/solutions/articles/61000319118-how-does-the-spaced-repetition-system-srs-work-)
