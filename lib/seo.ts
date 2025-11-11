import type { Metadata } from "next";

import type { SiteSettings } from "@/types/sanity";

export function buildDefaultMetadata(settings: SiteSettings | null): Metadata {
  const fallbackTitle = "Frontest";
  const title = settings?.seo?.title ?? settings?.siteTitle ?? fallbackTitle;
  const description =
    settings?.seo?.description ??
    "Frontest – playground for testing content coming from Sanity.";
  const noIndex = settings?.seo?.noIndex;
  const image = settings?.seo?.image ?? settings?.logo;
  const imageUrl = image?.asset?.url;
  const imageAlt = image?.alt ?? settings?.siteTitle ?? fallbackTitle;

  const metadata: Metadata = {
    title,
    description,
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  if (imageUrl) {
    metadata.openGraph = {
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
          width: image?.asset?.metadata?.dimensions?.width,
          height: image?.asset?.metadata?.dimensions?.height,
        },
      ],
    };

    metadata.twitter = {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    };
  }

  return metadata;
}



