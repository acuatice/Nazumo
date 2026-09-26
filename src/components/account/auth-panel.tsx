import { requestPasswordReset, signInWithEmail, signUpWithEmail, updatePassword } from "@/app/cuenta/actions";

const messages: Record<string, string> = {
  "check-email": "Te enviamos un enlace para confirmar el correo y activar tu cuenta.",
  confirmed: "Correo confirmado. Ya has iniciado sesión.",
  created: "Cuenta creada. Ya puedes empezar a aprender.",
  "signed-in": "Has iniciado sesión.",
  "signed-out": "Has cerrado sesión de forma segura.",
  invalid: "Revisa el correo y la contraseña. La contraseña debe tener al menos 8 caracteres.",
  "signup-error": "No se pudo crear la cuenta. Comprueba el correo o intenta iniciar sesión.",
  "confirmation-error": "El enlace de confirmación ha caducado o ya se ha usado. Solicita uno nuevo.",
  "reset-sent": "Si existe una cuenta con ese correo, recibirás un enlace para cambiar la contraseña.",
  "reset-ready": "Ya puedes elegir una contraseña nueva.",
  "reset-error": "No se pudo completar el cambio de contraseña. Solicita un enlace nuevo.",
  "password-updated": "Contraseña actualizada. Ya puedes seguir aprendiendo.",
};

export function AuthPanel({ status, mode = "auth" }: { status?: string; mode?: "auth" | "reset" }) {
  return <div className="mt-7 space-y-4">
    {status && messages[status] ? <p role="status" className="rounded-2xl bg-[var(--nazumo-lime)]/50 p-4 text-sm font-semibold text-[var(--nazumo-ink)]">{messages[status]}</p> : null}
    {mode === "reset" ? <form action={updatePassword} className="rounded-2xl bg-[var(--nazumo-cream)] p-4 sm:p-5">
      <h2 className="text-lg font-extrabold">Elige una contraseña nueva</h2>
      <label className="mt-4 block text-sm font-bold" htmlFor="new-password">Nueva contraseña<input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-white px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="8 caracteres como mínimo" /></label>
      <button className="mt-5 min-h-12 w-full rounded-full bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white transition active:scale-[.99]">Guardar contraseña</button>
    </form> : <>
    <form action={signInWithEmail} className="rounded-2xl bg-[var(--nazumo-cream)] p-4 sm:p-5">
      <h2 className="text-lg font-extrabold">Iniciar sesión</h2>
      <label className="mt-4 block text-sm font-bold" htmlFor="login-email">Correo electrónico<input id="login-email" name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-white px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="hola@ejemplo.com" /></label>
      <label className="mt-4 block text-sm font-bold" htmlFor="login-password">Contraseña<input id="login-password" name="password" type="password" autoComplete="current-password" minLength={8} maxLength={128} required className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-white px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="8 caracteres como mínimo" /></label>
      <button className="mt-5 min-h-12 w-full rounded-full bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white transition active:scale-[.99]">Entrar</button>
    </form>
    <details className="rounded-2xl border border-[var(--border)] bg-white p-4">
      <summary className="cursor-pointer list-none text-sm font-bold text-[var(--muted)]">He olvidado mi contraseña</summary>
      <form action={requestPasswordReset} className="mt-4">
        <label className="block text-sm font-bold" htmlFor="reset-email">Correo electrónico<input id="reset-email" name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--nazumo-cream)] px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="hola@ejemplo.com" /></label>
        <button className="mt-4 min-h-11 rounded-full border border-[var(--nazumo-purple)] px-5 text-sm font-bold text-[var(--nazumo-purple)]">Enviar enlace</button>
      </form>
    </details>
    <details className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5">
      <summary className="cursor-pointer list-none text-sm font-extrabold text-[var(--nazumo-purple)]">¿Primera vez en Nazumo? Crear cuenta</summary>
      <form action={signUpWithEmail} className="mt-4">
        <label className="block text-sm font-bold" htmlFor="signup-name">Nombre<input id="signup-name" name="name" autoComplete="name" minLength={2} maxLength={40} required className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--nazumo-cream)] px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="Tu nombre" /></label>
        <label className="mt-4 block text-sm font-bold" htmlFor="signup-email">Correo electrónico<input id="signup-email" name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--nazumo-cream)] px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="hola@ejemplo.com" /></label>
        <label className="mt-4 block text-sm font-bold" htmlFor="signup-password">Contraseña<input id="signup-password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--nazumo-cream)] px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="8 caracteres como mínimo" /></label>
        <button className="mt-5 min-h-12 w-full rounded-full border border-[var(--nazumo-purple)] px-6 text-sm font-bold text-[var(--nazumo-purple)] transition active:scale-[.99]">Crear cuenta</button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">Te pediremos que confirmes el correo antes de activar la cuenta. El nombre, el correo y el progreso se guardan para que puedas seguir en otros dispositivos.</p>
    </details>
    </>}
  </div>;
}
