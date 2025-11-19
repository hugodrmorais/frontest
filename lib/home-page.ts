import { cache } from "react";

import { client } from "./sanity.client";
import { homePageQuery } from "./sanity.queries";
import type { HomePage } from "@/types/sanity";

type HomePageResult = HomePage | null;

export const getHomePage = cache(async (): Promise<HomePageResult> => {
  const data = await client.fetch<HomePageResult>(homePageQuery, {}, {
    perspective: process.env.SANITY_READ_TOKEN ? "previewDrafts" : "published",
    next: { revalidate: 60 },
  });

  return data;
});




