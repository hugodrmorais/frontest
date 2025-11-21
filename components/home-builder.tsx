import type {
  HomePageBlock,
  PageBlock,
  TextBlock,
  HeroBlock,
  AccordionBlock,
  BlockLayout,
} from "@/types/sanity";
import { PortableText } from "@portabletext/react";

type HomeBuilderProps = {
  blocks: (HomePageBlock | PageBlock)[] | null | undefined;
};

export function HomeBuilder({ blocks }: HomeBuilderProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-12">
      {blocks.map((block, index) => {
        if (!block || typeof block !== "object") return null;

        const key =
          (block as { _key?: string })._key ??
          // Fallback to index to keep React happy if _key is missing
          String(index);

        switch (block._type) {
          case "heroBlock":
            return <HeroBlockSection key={key} block={block as HeroBlock} />;
          case "textBlock":
            return <TextBlockSection key={key} block={block as TextBlock} />;
          case "accordionBlock":
            return <AccordionBlockSection key={key} block={block as AccordionBlock} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// Shared helpers

function getLayoutClasses(layout?: BlockLayout | null) {
  const width = layout?.width ?? "container";
  const paddingTop = layout?.paddingTop ?? "md";
  const paddingBottom = layout?.paddingBottom ?? "md";
  const background = layout?.background ?? "default";
  const align = layout?.align ?? "left";
  const theme = layout?.theme ?? "light";

  const widthClass = width === "full" ? "w-full" : "mx-auto w-full max-w-5xl";

  const paddingMap: Record<string, string> = {
    none: "pt-0 pb-0",
    sm: "pt-4 pb-4",
    md: "pt-8 pb-8",
    lg: "pt-16 pb-16",
  };

  const paddingClass = paddingMap[`${paddingTop}`] ?? paddingMap.md + " " + (paddingMap[`${paddingBottom}`] ?? "");

  const backgroundClass =
    background === "muted"
      ? theme === "dark"
        ? "bg-zinc-900 text-white"
        : "bg-zinc-50"
      : background === "brand"
        ? "bg-zinc-950 text-white"
        : "";

  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return `${widthClass} ${paddingClass} ${backgroundClass} ${alignClass}`;
}

// Hero block (optional, in case you decide to use it later)

type HeroBlockSectionProps = {
  block: HeroBlock;
};

function HeroBlockSection({ block }: HeroBlockSectionProps) {
  const layoutClasses = getLayoutClasses(block.layout);

  return (
    <section className={layoutClasses}>
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
            {block.title}
          </h1>
          {block.summary && <p className="text-lg text-zinc-700">{block.summary}</p>}
          {block.actions && block.actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {block.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href ?? "#"}
                  target={action.openInNewTab ? "_blank" : undefined}
                  rel={action.openInNewTab ? "noreferrer noopener" : undefined}
                  className="inline-flex items-center justify-center rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  {action.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Text block

type TextBlockSectionProps = {
  block: TextBlock;
};

function TextBlockSection({ block }: TextBlockSectionProps) {
  const layoutClasses = getLayoutClasses(block.layout);

  return (
    <section className={layoutClasses}>
      <div className="space-y-4">
        {block.title && (
          <h2 className="text-2xl font-semibold text-zinc-900 md:text-3xl">
            {block.title}
          </h2>
        )}
        {block.body && (
          <div className="max-w-none text-base leading-relaxed text-zinc-800 space-y-4">
            <PortableText value={block.body as any} />
          </div>
        )}
      </div>
    </section>
  );
}

// Accordion block

type AccordionBlockSectionProps = {
  block: AccordionBlock;
};

function AccordionBlockSection({ block }: AccordionBlockSectionProps) {
  const layoutClasses = getLayoutClasses(block.layout);

  return (
    <section className={layoutClasses}>
      <div className="space-y-4 w-full">
        {block.title && <h2 className="text-2xl font-semibold text-zinc-900 md:text-3xl">{block.title}</h2>}
        <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-lg bg-white/80 shadow-sm">
          {block.items.map((item) => (
            <details key={item._key} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-50">
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-xs text-zinc-700 transition group-open:rotate-180"
                >
                  ⌄
                </span>
              </summary>
              {item.content && item.content.length > 0 && (
                <div className="px-4 pb-4 pt-1 text-sm text-zinc-700">
                  <PortableText value={item.content as any} />
                </div>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}


