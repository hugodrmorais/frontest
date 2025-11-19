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
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (mobileOpen || desktopMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, desktopMenuOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopMenuOpen(false);
  }, [pathname]);

  const logo = settings?.logo;
  const menuItems = useMemo(
    () => (settings?.menu?.items?.filter(Boolean) as MenuItem[] | undefined) ?? [],
    [settings?.menu?.items]
  );
  const hasMenuItems = menuItems.length > 0;
  const menuTitle = settings?.menu?.title;

  return (
    <header className="relative bg-white text-zinc-900">
      {/* Optional Top Bar with Language and Search */}
      <TopBar settings={settings} />

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-6">
        <Brand logo={logo} siteTitle={settings?.siteTitle} />

        {/* Desktop: Menu button */}
        <div className="hidden items-center gap-6 lg:flex">
          {hasMenuItems && (
            <button
              type="button"
              onClick={() => setDesktopMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
            >
              <span aria-hidden="true" className="text-base">
                {desktopMenuOpen ? "×" : "☰"}
              </span>
              {desktopMenuOpen ? "Close" : menuTitle ?? "Menu"}
            </button>
          )}
        </div>

        {/* Mobile: Menu button */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <span aria-hidden="true" className="text-base">
            ☰
          </span>
          {menuTitle ?? "Menu"}
        </button>

      </div>

      {/* Desktop Menu Dropdown */}
      {desktopMenuOpen && hasMenuItems && (
        <DesktopMenuDropdown items={menuItems} onClose={() => setDesktopMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
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
      {logo?.asset?.url && (
        <Image
          src={logo.asset.url}
          alt={logo.alt ?? siteTitle ?? "Site logo"}
          width={logo.asset.metadata?.dimensions?.width ?? 120}
          height={logo.asset.metadata?.dimensions?.height ?? 40}
          className="h-8 w-auto md:h-10"
          priority
        />
      )}
      {siteTitle && (
        <span className="text-lg font-semibold text-zinc-900">{siteTitle}</span>
      )}
    </Link>
  );
}

type MenuItemLinkProps = {
  item: MenuItem;
  className?: string;
  onNavigate?: () => void;
};

function MenuItemLink({ item, className = "", onNavigate }: MenuItemLinkProps) {
  if (item.itemType !== "link" || !item.link) {
    return null;
  }

  const href = resolveLinkHref(item.link);
  const label = item.link.label ?? item.title;

  const handleClick = () => {
    onNavigate?.();
  };

  if (isExternalLink(item.link)) {
    return (
      <a
        href={href}
        target={getLinkTarget(item.link)}
        rel="noreferrer noopener"
        className={`text-sm font-medium text-zinc-900 transition hover:text-zinc-600 ${className}`}
        onClick={handleClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`text-sm font-medium text-zinc-900 transition hover:text-zinc-600 ${className}`}
      onClick={handleClick}
    >
      {label}
    </Link>
  );
}

type DesktopMenuDropdownProps = {
  items: MenuItem[];
  onClose: () => void;
};

function DesktopMenuDropdown({ items, onClose }: DesktopMenuDropdownProps) {
  const flatItems: MenuItem[] = [];

  for (const item of items) {
    if (item.itemType === "parent" && item.childItems?.length) {
      for (const child of item.childItems) {
        if (child.itemType === "link" && child.link) {
          flatItems.push(child);
        }
      }
    } else if (item.itemType === "link" && item.link) {
      flatItems.push(item);
    }
  }

  if (flatItems.length === 0) return null;

  const midpoint = Math.ceil(flatItems.length / 2);
  const leftColumn = flatItems.slice(0, midpoint);
  const rightColumn = flatItems.slice(midpoint);

  return (
    <div className="border-t border-zinc-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-4 md:px-6 lg:px-8">
        <div className="grid gap-x-16 md:grid-cols-2">
          <DesktopMenuColumn items={leftColumn} onNavigate={onClose} />
          <DesktopMenuColumn items={rightColumn} onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}

type DesktopMenuColumnProps = {
  items: MenuItem[];
  onNavigate: () => void;
};

function DesktopMenuColumn({ items, onNavigate }: DesktopMenuColumnProps) {
  if (!items.length) return <div />;

  return (
    <ul className="divide-y divide-zinc-200 border-b border-zinc-200">
      {items.map((item) => (
        <li key={item._key ?? item.title} className="py-2 text-sm">
          <MenuItemLink item={item} onNavigate={onNavigate} className="block w-full" />
        </li>
      ))}
    </ul>
  );
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
                <li key={item._key ?? item.title}>
                  <MobileMenuItem item={item} onNavigate={onClose} />
                </li>
              ))}
            </ul>
          </nav>

          {languageLabel && (
            <div className="mt-8 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="font-medium">{languageLabel}</span>
              <span className="text-zinc-400">|</span>
              <button
                type="button"
                className="underline hover:text-zinc-800 dark:hover:text-zinc-100"
                onClick={() => {
                  // TODO: Implement language toggle
                }}
              >
                {settings?.defaultLanguage === "en" ? "Norsk" : "English"}
              </button>
            </div>
          )}

          <form className="mt-6">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <div className="flex items-center gap-2 rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-700 focus-within:ring-2 focus-within:ring-zinc-400 dark:border-zinc-700 dark:text-zinc-100 dark:focus-within:ring-zinc-600">
              <span aria-hidden="true" className="text-base">
                🔍
              </span>
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

type MobileMenuItemProps = {
  item: MenuItem;
  onNavigate: () => void;
};

function MobileMenuItem({ item, onNavigate }: MobileMenuItemProps) {
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
                <li key={child._key ?? child.title}>
                  <MenuItemLink
                    item={child}
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
      <MenuItemLink
        item={item}
        className="block rounded px-2 py-1 text-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
        onNavigate={onNavigate}
      />
    );
  }

  return <span className="text-zinc-500">{item.title}</span>;
}

const LANGUAGE_LABELS: Record<string, string> = {
  nb: "Norwegian (Bokmål)",
  nn: "Norwegian (Nynorsk)",
  en: "English",
};

const SEARCH_PLACEHOLDERS: Record<string, string> = {
  nb: "Søk evalueringer",
  nn: "Søk evalueringer",
  en: "Search evaluations",
};

function getLanguageLabel(code?: string | null) {
  if (!code) return null;
  return LANGUAGE_LABELS[code.toLowerCase()] ?? code;
}

function getSearchPlaceholder(code?: string | null) {
  if (!code) return "Search evaluations";
  return SEARCH_PLACEHOLDERS[code.toLowerCase()] ?? "Search evaluations";
}

type TopBarProps = {
  settings: SiteSettings | null;
};

function TopBar({ settings }: TopBarProps) {
  const languageLabel = getLanguageLabel(settings?.defaultLanguage);
  const currentLang = settings?.defaultLanguage?.toLowerCase() ?? "en";

  if (!languageLabel) return null;

  return (
    <div className="bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-4 px-5 py-2 text-sm md:px-6">
        <div className="flex items-center gap-2 text-zinc-900">
          <span className={currentLang === "en" ? "underline" : ""}>English</span>
          <span className="text-zinc-400">|</span>
          <span className={currentLang !== "en" ? "underline" : ""}>Norsk</span>
          <span className="ml-4 text-zinc-600">🔍 Search</span>
        </div>
      </div>
    </div>
  );
}
