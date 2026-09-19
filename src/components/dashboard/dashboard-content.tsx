"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { hiraganaCurriculum } from "@/data/hiragana-curriculum";
import { hiraganaCharacters } from "@/data/hiragana";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";
import { selectProgressiveCharacters } from "@/lib/practice/selection";

export function DashboardContent() {
  const snapshot = useLearningSnapshot();
  const currentUnit = hiraganaCurriculum.find((unit) => unit.id === (snapshot?.currentUnitId ?? 1)) ?? hiraganaCurriculum[0];
  const learned = snapshot?.learnedIds.length ?? 0;
  const reviewCount = snapshot ? selectProgressiveCharacters(snapshot, hiraganaCharacters).length : 0;

  return <div className="pb-7 pt-2 sm:pt-6 lg:pt-8">
    <header className="mb-5 max-w-2xl sm:mb-7">
      <p className="text-base font-medium">¡Hola!</p>
      <h1 className="mt-1 max-w-[20rem] text-[2rem] font-extrabold leading-[1.08] tracking-[-.055em] min-[375px]:text-[2.25rem] sm:max-w-2xl sm:text-5xl">Hoy es un buen día para aprender japonés.</h1>
    </header>

    <section className="relative min-h-[15.5rem] overflow-hidden rounded-[1.8rem] bg-[var(--nazumo-lavender)] shadow-[0_16px_45px_rgba(63,31,128,.09)] min-[375px]:min-h-[16.5rem] sm:min-h-[20rem]">
      <Image src="/brand/nazumo-hero.png" alt="Personaje de Nazumo" fill priority loading="eager" sizes="(max-width: 768px) 100vw, 1200px" className="object-cover object-[64%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#e8e0ff] via-[#e8e0ff]/82 to-transparent sm:via-[#e8e0ff]/55" />
      <div className="relative z-10 flex min-h-[15.5rem] max-w-[12.25rem] flex-col justify-between p-5 min-[375px]:min-h-[16.5rem] min-[375px]:max-w-[13rem] min-[375px]:p-6 sm:min-h-[20rem] sm:max-w-sm sm:p-8">
        <div><h2 className="text-[1.7rem] font-extrabold leading-[.98] tracking-[-.05em] sm:text-4xl">Tu primer<br />trazo</h2><p className="mt-3 text-xs leading-[1.45] text-[var(--sumi)]/65 sm:max-w-52 sm:text-sm">Empieza por lo esencial: reconoce, escribe y familiarízate con hiragana.</p></div>
        <Link href={`/hiragana/unit/${currentUnit.id}`} className="inline-flex min-h-12 w-fit items-center gap-4 rounded-full bg-[var(--sumi)] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 active:scale-[.98]">Empezar <Icon name="arrow" className="size-4" /></Link>
      </div>
    </section>

    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between px-1"><h2 className="text-lg font-extrabold tracking-[-.035em]">Explorar caracteres</h2><Link href="/hiragana" className="text-xs font-medium text-[var(--nazumo-purple)]">Ver todos</Link></div>
      <div className="grid grid-cols-3 gap-2.5">
        <CharacterCover href="/hiragana" title="Hiragana" subtitle={learned ? `${learned} aprendidos` : "Empieza aquí"} tone="pink" image="/brand/nazumo-hero.png" imagePosition="68% center" />
        <CharacterCover title="Katakana" subtitle="Próximamente" tone="lavender" image="/brand/nazumo-katakana.png" />
        <CharacterCover title="Kanji" subtitle="Más adelante" tone="cream" image="/brand/nazumo-kanji.png" />
      </div>
    </section>

    <Link href={reviewCount ? "/practice" : `/hiragana/unit/${currentUnit.id}`} className="relative mt-4 flex min-h-[5.25rem] items-center justify-between overflow-hidden rounded-[1.4rem] bg-[var(--nazumo-purple)] px-5 text-white transition active:scale-[.99]"><span className="relative z-10 max-w-48 text-xl font-extrabold leading-tight tracking-[-.035em]">{reviewCount ? `${reviewCount} caracteres te esperan.` : "Pequeños trazos, grandes logros."}</span><span className="relative z-10 flex size-11 items-center justify-center rounded-full bg-white/20"><Icon name="arrow" className="size-5" /></span><span className="absolute -bottom-8 right-16 size-20 rounded-full border-[9px] border-[var(--nazumo-lime)] opacity-80" /></Link>
  </div>;
}

function CharacterCover({ href, title, subtitle, tone, image, imagePosition = "center" }: { href?: string; title: string; subtitle: string; tone: "pink" | "lavender" | "cream"; image: string; imagePosition?: string }) {
  const tones = { pink: "bg-[var(--nazumo-pink)]", lavender: "bg-[var(--nazumo-lavender)]", cream: "bg-white" };
  const content = <><div className="relative h-[5.35rem] overflow-hidden rounded-[1rem] bg-white/35 min-[375px]:h-[6.3rem]"><Image src={image} alt="" fill loading="eager" sizes="33vw" className="object-cover" style={{ objectPosition: imagePosition }} /></div><div className="mt-2"><h3 className="text-xs font-extrabold min-[375px]:text-sm">{title}</h3><p className="mt-0.5 truncate text-[10px] leading-tight text-[var(--muted)] min-[375px]:text-[11px]">{subtitle}</p></div></>;
  const classes = `min-w-0 rounded-[1.25rem] p-2.5 transition ${tones[tone]} ${href ? "active:scale-[.98]" : "opacity-90"}`;
  return href ? <Link href={href} className={classes}>{content}</Link> : <article className={classes}>{content}</article>;
}
