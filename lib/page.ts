import { cache } from "react";

import { client } from "./sanity.client";
import { pageBySlugQuery } from "./sanity.queries";
import type { Page } from "@/types/sanity";

type PageResult = Page | null;

export const getPageBySlug = cache(
  async (slug: string, language: string): Promise<PageResult> => {
    const data = await client.fetch<PageResult>(
      pageBySlugQuery,
      { slug, language },
      {
        perspective: process.env.SANITY_READ_TOKEN ? "previewDrafts" : "published",
        next: { revalidate: 60 },
      },
    );

    return data;
  },
);



