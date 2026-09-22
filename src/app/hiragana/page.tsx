import Image from "next/image";
import { UnitList } from "@/components/curriculum/unit-list";
import { HiraganaCourseHero } from "@/components/curriculum/hiragana-course-hero";

export const metadata = { title: "Hiragana" };

export default function HiraganaPage() {
  return <div className="mx-auto max-w-4xl pb-10 pt-3 sm:pt-7 animate-page-in">
    <section className="nazumo-lavender-gradient relative -mx-4 overflow-hidden rounded-[0_0_2.25rem_2.25rem] px-4 pb-7 pt-7 min-[375px]:-mx-5 min-[375px]:px-5 sm:-mx-8 sm:px-8 sm:pb-10 lg:-mx-10 lg:px-10">
      <div className="relative z-10"><p className="text-sm font-bold text-[var(--nazumo-purple)]">La base de todo</p><h1 className="mt-2 text-5xl font-extrabold tracking-[-.065em] sm:text-7xl">Hiragana</h1><p lang="ja" className="font-japanese mt-2 text-lg text-[var(--sumi)]/55">ひらがな</p></div>
      <Image src="/brand/nazumo-hiragana.png" alt="Personaje de Nazumo" width={680} height={450} priority className="pointer-events-none absolute -right-16 top-24 h-56 w-[21rem] object-cover object-center opacity-95 sm:-right-2 sm:top-20 sm:h-64 sm:w-96" />
      <HiraganaCourseHero />
    </section>
    <section aria-labelledby="hiragana-units-title" className="mt-9"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Tu recorrido</p><h2 id="hiragana-units-title" className="mt-1 text-2xl font-extrabold tracking-[-.045em]">Diez unidades</h2></div><UnitList /></section>
  </div>;
}
