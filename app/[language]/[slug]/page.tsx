import { notFound } from "next/navigation";

import { getPageBySlug } from "@/lib/page";
import { HomeBuilder } from "@/components/home-builder";

const SUPPORTED_LANGUAGES = ["en", "nb", "nn"] as const;

type PageParams = {
  language: string;
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const language = params.language?.toLowerCase();
  const slug = params.slug;

  if (!SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number])) {
    notFound();
  }

  const page = await getPageBySlug(slug, language);

  if (!page) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 pb-6">
        <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">{page.title}</h1>
        {page.intro && (
          <p className="mt-4 max-w-3xl text-base text-zinc-700 leading-relaxed">{page.intro}</p>
        )}
      </div>

      <HomeBuilder blocks={page.builder ?? []} />
    </div>
  );
}



