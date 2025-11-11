import type { SanityLink } from "@/types/sanity";

export function resolveLinkHref(link: SanityLink): string {
  if (link.linkType === "external") {
    return link.href ?? "#";
  }

  const internalPath = link.internalPath ?? "/";
  return internalPath.startsWith("/") ? internalPath : `/${internalPath}`;
}

export function isExternalLink(link: SanityLink): boolean {
  return link.linkType === "external";
}

export function getLinkTarget(link: SanityLink): "_self" | "_blank" {
  if (!isExternalLink(link)) {
    return "_self";
  }

  return link.openInNewTab === false ? "_self" : "_blank";
}



