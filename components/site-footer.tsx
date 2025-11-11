import Link from "next/link";

import { getLinkTarget, isExternalLink, resolveLinkHref } from "@/lib/link-resolver";
import type {
  Footer,
  FooterColumn,
  FooterLink,
  SanityLink,
  SiteSettings,
} from "@/types/sanity";

type SiteFooterProps = {
  settings: SiteSettings | null;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const footer = settings?.footer;

  if (!footer) {
    return null;
  }

  const columns = (footer.columns ?? []).filter(Boolean) as FooterColumn[];
  const legalLinks = (footer.legal ?? []).filter(Boolean) as SanityLink[];

  if (columns.length === 0 && legalLinks.length === 0) {
    return null;
  }

  return (
    <footer className="bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        {columns.length > 0 && (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {columns.map((column) => (
              <FooterColumnBlock key={column.title} column={column} />
            ))}
          </div>
        )}

        {legalLinks.length > 0 && (
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
              {legalLinks.map((link) => (
                <FooterInlineLink key={`${link.label}-${link.href ?? link.internalPath}`} link={link} />
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

type FooterColumnBlockProps = {
  column: FooterColumn;
};

function FooterColumnBlock({ column }: FooterColumnBlockProps) {
  const links = (column.links ?? []).filter(Boolean) as FooterLink[];
  const bodyLines = (column.body ?? []).filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      {column.title && <h3 className="text-xl font-semibold text-white">{column.title}</h3>}

      {bodyLines.length > 0 && (
        <div className="space-y-1 text-sm text-white/70">
          {bodyLines.map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <ul className="list-none space-y-3 text-sm text-white/90">
          {links.map((item, index) => (
            <li
              key={`${item.link.label}-${index}`}
              className={item.icon === "arrow" ? "flex justify-end" : undefined}
            >
              <FooterLinkItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type FooterLinkItemProps = {
  item: FooterLink;
};

function FooterLinkItem({ item }: FooterLinkItemProps) {
  const { link, icon } = item;
  const href = resolveLinkHref(link);
  const isArrow = icon === "arrow";
  const isExternal = isExternalLink(link);

  const wrapperClass = [
    "group inline-flex items-center transition",
    isArrow
      ? "gap-3 rounded border border-white/40 px-4 py-2 text-sm font-medium uppercase tracking-wide hover:bg-white/10"
      : "gap-2 text-sm text-white/90",
  ].join(" ");

  const labelClass = isArrow
    ? "relative"
    : "border-b border-white/30 pb-0.5 transition group-hover:border-white";

  const node = (
    <>
      <FooterIcon variant={icon} />
      <span className={labelClass}>{link.label}</span>
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target={getLinkTarget(link)} rel="noreferrer noopener" className={wrapperClass}>
        {node}
      </a>
    );
  }

  return (
    <Link href={href} className={wrapperClass}>
      {node}
    </Link>
  );
}

type FooterInlineLinkProps = {
  link: SanityLink;
};

function FooterInlineLink({ link }: FooterInlineLinkProps) {
  const href = resolveLinkHref(link);
  const node = (
    <span className="underline decoration-white/20 underline-offset-4 transition hover:decoration-white">
      {link.label}
    </span>
  );

  if (isExternalLink(link)) {
    return (
      <a href={href} target={getLinkTarget(link)} rel="noreferrer noopener">
        {node}
      </a>
    );
  }

  return <Link href={href}>{node}</Link>;
}

type FooterIconProps = {
  variant?: string;
};

function FooterIcon({ variant }: FooterIconProps) {
  switch (variant) {
    case "email":
      return (
        <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full border border-white/40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 5 8-5" />
          </svg>
        </span>
      );
    case "phone":
      return (
        <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full border border-white/40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.5 4h2l2 4-2 1a11 11 0 0 0 6 6l1-2 4 2v2.5a2 2 0 0 1-2.2 2 17 17 0 0 1-15.3-15.3A2 2 0 0 1 6.5 4Z" />
          </svg>
        </span>
      );
    case "linkedin":
      return (
        <span
          aria-hidden="true"
          className="inline-flex h-6 w-6 items-center justify-center rounded bg-white text-sm font-semibold text-zinc-900"
        >
          in
        </span>
      );
    case "arrow":
      return (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 5v14" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      );
    case "dot":
    default:
      return null;
  }
}
