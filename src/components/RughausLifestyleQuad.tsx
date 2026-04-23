import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';
import type { RughausLifestyleCardData } from '@/src/lib/lifestyleQuad';

export type { RughausLifestyleCardData } from '@/src/lib/lifestyleQuad';

type RughausLifestyleQuadProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cards: readonly RughausLifestyleCardData[];
};

/**
 * Rughaus.jp–style “choose by lifestyle” quad: accent + kicker, hero shot,
 * centered bold title, hairline rule, thumbnail + three bullets.
 */
export const RughausLifestyleQuad: React.FC<RughausLifestyleQuadProps> = ({
  eyebrow = 'Shop the edit',
  title,
  subtitle,
  cards,
}) => {
  return (
    <section className="border-b border-bisat-black/[0.06] bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 max-w-2xl">
          {eyebrow ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">{eyebrow}</p>
          ) : null}
          <h2 className="mt-3 font-sans text-2xl font-normal leading-tight tracking-[-0.02em] text-bisat-black sm:text-3xl lg:text-[2rem]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-bisat-black/48">{subtitle}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-4">
          {cards.map((card, index) => (
            <ScrollReveal key={card.href + card.kicker} delay={index * 70}>
              <Link
                href={card.href}
                className="group flex h-full flex-col outline-none transition-[opacity,transform] duration-300 hover:opacity-[0.97]"
              >
                {/* Kicker — bar + label (sits above the framed card, flush top) */}
                <div className="mb-2.5 flex items-start gap-2.5 px-0.5">
                  <span className="mt-0.5 h-[14px] w-[3px] shrink-0 bg-bisat-black" aria-hidden />
                  <span className="text-left text-[11px] font-medium leading-snug tracking-wide text-bisat-black sm:text-[12px]">
                    {card.kicker}
                  </span>
                </div>

                {/* Card frame: square top corners, rounded bottom (Rughaus reference) */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-b-2xl border border-bisat-black bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                  <div className="relative aspect-[4/5] w-full bg-neutral-100">
                    <Image
                      src={card.heroSrc}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[1.05s] ease-out group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="px-3 pt-5 sm:px-4">
                    <h3 className="text-center text-[14px] font-bold leading-snug tracking-tight text-bisat-black sm:text-[15px]">
                      {card.title}
                    </h3>
                  </div>

                  <div className="mx-3 mt-4 border-t border-bisat-black sm:mx-4" />

                  <div className="grid flex-1 grid-cols-[4.5rem_1fr] gap-3 px-3 py-4 sm:grid-cols-[4.75rem_1fr] sm:px-4 sm:py-5">
                    <div className="relative aspect-square w-full shrink-0 overflow-hidden border border-bisat-black/12 bg-neutral-50">
                      <Image
                        src={card.thumbSrc}
                        alt=""
                        fill
                        sizes="76px"
                        className="object-cover"
                      />
                    </div>
                    <ul className="list-disc space-y-1.5 pl-4 text-[11px] font-normal leading-relaxed text-bisat-black/88 marker:text-bisat-black sm:text-[12px]">
                      <li className="pl-0.5">{card.bullets[0]}</li>
                      <li className="pl-0.5">{card.bullets[1]}</li>
                      <li className="pl-0.5">{card.bullets[2]}</li>
                    </ul>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
