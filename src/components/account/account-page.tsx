"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState, type FormEvent } from "react";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";
import { clearLearnerProfile, saveLearnerProfile, useLearnerProfile } from "@/components/account/profile-store";
import { signOut } from "@/app/cuenta/actions";

export function AccountPage({ authEnabled = false, user = null, authPanel, authMode = "auth" }: { authEnabled?: boolean; user?: { name: string; email: string } | null; authPanel?: ReactNode; authMode?: "auth" | "reset" }) {
  const profile = useLearnerProfile();
  const progress = useLearningSnapshot();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (name.length < 2) { setError("Escribe un nombre de al menos dos letras."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Comprueba el formato del correo electrónico."); return; }
    if (!saveLearnerProfile(name, email)) setError("El navegador no ha permitido guardar el perfil. Revisa el almacenamiento del sitio.");
  }

  return <div className="mx-auto max-w-xl pb-12 pt-6 sm:pt-12 animate-page-in">
    <Link href="/" className="text-sm font-semibold text-[var(--nazumo-purple)]">← Volver al inicio</Link>
    <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(52,24,114,.09)] sm:p-9">
      {user && authMode === "reset" ? <>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Seguridad de tu cuenta</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-.06em]">Actualiza tu contraseña.</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">La sesión de recuperación está verificada. Elige una contraseña nueva para continuar.</p>
        {authPanel}
      </> : user ? <>
        <div className="flex size-16 items-center justify-center rounded-full bg-[var(--nazumo-lime)] text-2xl font-extrabold text-[var(--nazumo-ink)]" aria-hidden="true">{user.name.slice(0, 1).toUpperCase() || "日"}</div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Tu cuenta de Nazumo</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-[-.06em]">Hola, {user.name || "estudiante"}.</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{user.email}</p>
        <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[var(--nazumo-cream)] p-4"><p className="text-2xl font-extrabold">{progress?.learnedIds.length ?? 0}</p><p className="mt-1 text-xs text-[var(--muted)]">caracteres aprendidos</p></div><div className="rounded-2xl bg-[var(--nazumo-cream)] p-4"><p className="text-2xl font-extrabold">{progress?.streak ?? 0} días</p><p className="mt-1 text-xs text-[var(--muted)]">racha actual</p></div></div>
        <p className="mt-5 rounded-2xl bg-[var(--nazumo-lavender)]/50 p-4 text-sm leading-relaxed text-[var(--nazumo-ink)]/75">El progreso se guarda primero en este dispositivo y se sincroniza con tu cuenta cuando hay conexión.</p>
        <form action={signOut}><button className="mt-6 min-h-11 rounded-full border border-[var(--border)] px-5 text-sm font-bold transition hover:bg-[var(--nazumo-cream)]">Cerrar sesión</button></form>
      </> : authEnabled ? <>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Tu espacio de aprendizaje</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-.06em] sm:text-5xl">Tu cuenta, tu progreso.</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">Inicia sesión y sigue aprendiendo en cualquier dispositivo.</p>
        {authPanel}
      </> : profile ? <>
        <div className="flex size-16 items-center justify-center rounded-full bg-[var(--nazumo-lime)] text-2xl font-extrabold text-[var(--nazumo-ink)]" aria-hidden="true">{profile.name.slice(0, 1).toUpperCase()}</div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Tu perfil de Nazumo</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-[-.06em]">Hola, {profile.name}.</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{profile.email}</p>
        <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[var(--nazumo-cream)] p-4"><p className="text-2xl font-extrabold">{progress?.learnedIds.length ?? 0}</p><p className="mt-1 text-xs text-[var(--muted)]">caracteres aprendidos</p></div><div className="rounded-2xl bg-[var(--nazumo-cream)] p-4"><p className="text-2xl font-extrabold">{progress?.streak ?? 0} días</p><p className="mt-1 text-xs text-[var(--muted)]">racha actual</p></div></div>
        <p className="mt-5 rounded-2xl bg-[var(--nazumo-lavender)]/50 p-4 text-sm leading-relaxed text-[var(--nazumo-ink)]/75">Este perfil se guarda en este dispositivo. El progreso de estudio sigue guardándose en tu navegador.</p>
        <button type="button" onClick={clearLearnerProfile} className="mt-6 min-h-11 rounded-full border border-[var(--border)] px-5 text-sm font-bold transition hover:bg-[var(--nazumo-cream)]">Borrar perfil local</button>
      </> : <>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Tu espacio de aprendizaje</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-.06em] sm:text-5xl">Un pequeño perfil para tu viaje.</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">Guarda tu nombre y correo en este navegador para personalizar tu experiencia.</p>
        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
          <label className="block text-sm font-bold" htmlFor="account-name">¿Cómo te llamas?<input id="account-name" name="name" autoComplete="name" required minLength={2} maxLength={40} className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--nazumo-cream)] px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="Tu nombre" /></label>
          <label className="block text-sm font-bold" htmlFor="account-email">Correo electrónico<input id="account-email" name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--nazumo-cream)] px-4 font-normal outline-none focus:border-[var(--nazumo-purple)]" placeholder="hola@ejemplo.com" /></label>
          {error ? <p role="alert" className="text-sm font-medium text-[#b42318]">{error}</p> : null}
          <button className="min-h-13 w-full rounded-full bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 active:scale-[.99]">Crear mi perfil</button>
        </form>
        <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">Es un perfil local, no una cuenta con contraseña. No se envía ningún dato a un servidor.</p>
      </>}
    </section>
  </div>;
}
