import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--nazumo-purple)]">
        Error 404
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
        Esta página no existe
      </h1>
      <p className="mt-4 max-w-sm text-[var(--muted)]">
        Puedes volver al inicio y continuar aprendiendo desde donde lo dejaste.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-13 items-center justify-center rounded-[var(--radius-button)] bg-[var(--ink)] px-7 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
