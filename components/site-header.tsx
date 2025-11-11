"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getLinkTarget, isExternalLink, resolveLinkHref } from "@/lib/link-resolver";
import type { MenuItem, SiteSettings } from "@/types/sanity";

type SiteHeaderProps = {
  settings: SiteSettings | null;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const logo = settings?.logo;
  const menuItems = useMemo(
    () => (settings?.menu?.items?.filter(Boolean) as MenuItem[] | undefined) ?? [],
    [settings?.menu?.items]
  );

  return (
    <header className="border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-6">
        <Brand logo={logo} siteTitle={settings?.siteTitle} />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 text-sm font-medium lg:flex"
        >
          {menuItems.map((item) => (
            <MenuItemDesktop key={item.title} item={item} />
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus:ring-zinc-600 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <span aria-hidden="true" className="text-lg">
            ☰
          </span>
          Menu
        </button>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        settings={settings}
        items={menuItems}
      />
    </header>
  );
}

type BrandProps = {
  logo: SiteSettings["logo"];
  siteTitle?: string | null;
};

function Brand({ logo, siteTitle }: BrandProps) {
  return (
    <Link href="/" className="flex items-center gap-3">
      {logo?.asset?.url ? (
        <Image
          src={logo.asset.url}
          alt={logo.alt ?? siteTitle ?? "Site logo"}
          width={logo.asset.metadata?.dimensions?.width ?? 160}
          height={logo.asset.metadata?.dimensions?.height ?? 60}
          className="h-10 w-auto"
          priority
        />
      ) : (
        <span className="text-lg font-semibold">{siteTitle ?? "Frontest"}</span>
      )}
    </Link>
  );
}

type MenuItemDesktopProps = {
  item: MenuItem;
};

function MenuItemDesktop({ item }: MenuItemDesktopProps) {
  if (item.itemType === "parent" && item.childItems?.length) {
    return (
      <div className="group relative">
        <button
          type="button"
          className="cursor-pointer whitespace-nowrap rounded px-2 py-1 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:hover:bg-zinc-900 dark:focus:ring-zinc-700"
        >
          {item.title}
        </button>
        <div className="invisible absolute right-0 top-full z-20 mt-2 min-w-[13rem] translate-y-1 rounded-md border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900">
          <ul className="space-y-1 text-sm">
            {item.childItems.map((child) =>
              child.itemType === "link" && child.link ? (
                <li key={child.title}>
                  <MenuLink linkItem={child} className="block rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800" />
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    );
  }

  if (item.itemType === "link" && item.link) {
    return (
      <MenuLink
        linkItem={item}
        className="rounded px-2 py-1 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
      />
    );
  }

  return <span className="text-zinc-500">{item.title}</span>;
}

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  settings: SiteSettings | null;
  items: MenuItem[];
};

function MobileMenu({ open, onClose, settings, items }: MobileMenuProps) {
  if (!open) return null;

  const languageLabel = getLanguageLabel(settings?.defaultLanguage);
  const searchPlaceholder = getSearchPlaceholder(settings?.defaultLanguage);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" role="dialog">
      <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-xl dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <Brand logo={settings?.logo} siteTitle={settings?.siteTitle} />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus:ring-zinc-600"
          >
            <span aria-hidden="true" className="text-lg">
              ×
            </span>
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <nav aria-label="Mobile navigation">
            <ul className="space-y-4 text-lg font-medium text-zinc-800 dark:text-zinc-100">
              {items.map((item) => (
                <li key={item.title}>
                  <MenuItemMobile item={item} onNavigate={onClose} />
                </li>
              ))}
            </ul>
          </nav>

          {languageLabel && (
            <div className="mt-8 text-sm text-zinc-600 dark:text-zinc-300">
              <p className="font-medium">{languageLabel}</p>
            </div>
          )}

          <form className="mt-6">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <div className="flex items-center gap-2 rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-700 focus-within:ring-2 focus-within:ring-zinc-400 dark:border-zinc-700 dark:text-zinc-100 dark:focus-within:ring-zinc-600">
              <span aria-hidden="true">🔍</span>
              <input
                id="mobile-search"
                type="search"
                placeholder={searchPlaceholder}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

type MenuItemMobileProps = {
  item: MenuItem;
  onNavigate: () => void;
};

function MenuItemMobile({ item, onNavigate }: MenuItemMobileProps) {
  const [open, setOpen] = useState(false);

  if (item.itemType === "parent" && item.childItems?.length) {
    return (
      <div>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-lg font-medium hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:hover:bg-zinc-900 dark:focus:ring-zinc-700"
          onClick={() => setOpen((prev) => !prev)}
        >
          {item.title}
          <span aria-hidden="true" className="text-base">
            {open ? "−" : "+"}
          </span>
        </button>
        {open && (
          <ul className="mt-2 space-y-2 pl-4 text-base">
            {item.childItems.map((child) =>
              child.itemType === "link" && child.link ? (
                <li key={child.title}>
                  <MenuLink
                    linkItem={child}
                    className="block rounded px-2 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
                    onNavigate={onNavigate}
                  />
                </li>
              ) : null
            )}
          </ul>
        )}
      </div>
    );
  }

  if (item.itemType === "link" && item.link) {
    return (
      <MenuLink
        linkItem={item}
        className="block rounded px-2 py-1 text-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
        onNavigate={onNavigate}
      />
    );
  }

  return <span className="text-zinc-500">{item.title}</span>;
}

type MenuLinkProps = {
  linkItem: MenuItem;
  className?: string;
  onNavigate?: () => void;
};

function MenuLink({ linkItem, className, onNavigate }: MenuLinkProps) {
  const link = linkItem.link!;
  const href = resolveLinkHref(link);
  const label = link.label ?? linkItem.title;

  const handleClick = () => {
    onNavigate?.();
  };

  if (isExternalLink(link)) {
    return (
      <a
        href={href}
        target={getLinkTarget(link)}
        rel="noreferrer noopener"
        className={className}
        onClick={handleClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {label}
    </Link>
  );
}

const LANGUAGE_LABELS: Record<string, string> = {
  nb: "Norwegian (Bokmål)",
  nn: "Norwegian (Nynorsk)",
  en: "English",
};

const SEARCH_PLACEHOLDERS: Record<string, string> = {
  nb: "Søk",
  nn: "Søk",
  en: "Search",
};

function getLanguageLabel(code?: string | null) {
  if (!code) return null;
  return LANGUAGE_LABELS[code.toLowerCase()] ?? code;
}

function getSearchPlaceholder(code?: string | null) {
  if (!code) return "Search";
  return SEARCH_PLACEHOLDERS[code.toLowerCase()] ?? "Search";
}
