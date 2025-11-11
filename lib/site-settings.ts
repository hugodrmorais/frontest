import { cache } from "react";

import { client } from "./sanity.client";
import { siteSettingsQuery } from "./sanity.queries";
import type { SiteSettings } from "@/types/sanity";

type SiteSettingsResult = SiteSettings | null;

export const getSiteSettings = cache(async (): Promise<SiteSettingsResult> => {
  const data = await client.fetch<SiteSettingsResult>(siteSettingsQuery, {}, {
    // Use drafts when a token is available, otherwise fall back to published content.
    perspective: process.env.SANITY_READ_TOKEN ? "previewDrafts" : "published",
    next: {
      revalidate: 60,
    },
  });

  return data;
});



