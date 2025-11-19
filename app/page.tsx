import { PortableText } from "@portabletext/react";

import Image from "next/image";
import { getHomePage } from "@/lib/home-page";
import { getBlockLayoutClasses } from "@/lib/layout";
import type { HeroBlock, HomePageBlock, TextBlock } from "@/types/sanity";

export default async function Home() {
  const homePage = await getHomePage();
  const blocks = (homePage?.builder ?? []) as HomePageBlock[];
  const hero = blocks.find((b) => b._type === "heroBlock") as HeroBlock | undefined;
  const textBlock = blocks.find((b) => b._type === "textBlock") as TextBlock | undefined;

  if (!hero) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        {/* No hero block yet – add one in the Home Page builder in Sanity */}
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-stretch">
        <div className="flex-1 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Evaluering</p>
          <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">{hero.title}</h1>
          {hero.summary && (
            <p className="max-w-md text-sm text-zinc-700">{hero.summary}</p>
          )}
          {hero.actions && hero.actions.length > 0 && (
            <div className="mt-4">
              <a
                href={hero.actions[0].href}
                target={hero.actions[0].openInNewTab ? "_blank" : "_self"}
                rel={hero.actions[0].openInNewTab ? "noreferrer noopener" : undefined}
                className="inline-block rounded border border-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-900 hover:text-white"
              >
                {hero.actions[0].label}
              </a>
            </div>
          )}
        </div>

        <div className="flex-1">
          {hero.media?.asset?.url ? (
            <div className="h-full w-full overflow-hidden bg-zinc-300">
              <Image
                src={hero.media.asset.url}
                alt={hero.media.alt ?? hero.title}
                width={hero.media.asset.metadata?.dimensions?.width ?? 1200}
                height={hero.media.asset.metadata?.dimensions?.height ?? 600}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          ) : (
            <div className="h-full w-full bg-zinc-300" />
          )}
        </div>
      </section>

      {textBlock && textBlock.body && (
        <section className={getBlockLayoutClasses(textBlock.layout)}>
          <div className="mx-auto w-full max-w-3xl">
            {textBlock.title && (
              <h2 className="mb-4 text-xl font-semibold">{textBlock.title}</h2>
            )}
            <div className="prose max-w-none text-sm">
              <PortableText value={textBlock.body as any} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
