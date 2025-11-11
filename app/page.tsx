import Link from "next/link";

import { getLinkTarget, isExternalLink, resolveLinkHref } from "@/lib/link-resolver";
import { getSiteSettings } from "@/lib/site-settings";
import type { FooterLink } from "@/types/sanity";

export default async function Home() {
  const settings = await getSiteSettings();

  if (!settings) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-start justify-center px-6 py-16 text-zinc-700 dark:text-zinc-200">
        <h1 className="mb-4 text-3xl font-semibold">Site settings not found</h1>
        <p>Add a `siteSettings` document in Sanity and publish it to see the content here.</p>
      </section>
    );
  }

  const footer = settings.footer;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="rounded-2xl bg-zinc-900 px-8 py-10 text-white shadow-lg dark:bg-zinc-800">
        <p className="text-sm uppercase tracking-wide text-zinc-300">
          Default language: {settings.defaultLanguage?.toUpperCase() ?? "N/A"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold">{settings.siteTitle ?? "Frontest playground"}</h1>
        <p className="mt-4 max-w-xl text-base text-zinc-200">
          This page mirrors the Sanity singleton <code>siteSettings</code>. Feel free to tweak content in Sanity and
          refresh to see it reflected here instantly.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Contact details</h2>
          <dl className="space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
            <Row label="Phone" value={settings.contact?.phone} />
            <Row label="Email" value={settings.contact?.email} />
            <Row
              label="Address"
              value={[
                settings.contact?.address?.street,
                [settings.contact?.address?.postalCode, settings.contact?.address?.city].filter(Boolean).join(" "),
                settings.contact?.address?.country,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          </dl>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Social links</h2>
          {settings.social?.length ? (
            <ul className="space-y-2 text-sm">
              {settings.social.map((item) => (
                <li key={`${item?.service}-${item?.url}`}>
                  <a
                    href={item?.url ?? "#"}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-zinc-500" />
                    {item?.service ?? "Social"} &mdash; {item?.url}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No social profiles configured yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Footer preview</h2>
        {footer?.columns?.length ? (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gridTemplateColumns: `repeat(${Math.min(footer.columns.length, 3)}, minmax(0, 1fr))` }}
          >
            {footer.columns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{column.title}</h3>
                {column.body?.map((line, index) => (
                  <p key={`${column.title}-body-${index}`} className="text-sm text-zinc-400 dark:text-zinc-300">
                    {line}
                  </p>
                ))}
                <ul className="space-y-3">
                  {column.links?.map((item, index) => (
                    <FooterLinkItem key={`${column.title}-${index}`} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Footer columns are empty. Assign a footer to siteSettings in Sanity.</p>
        )}
        {footer?.legal?.length ? (
          <div className="mt-6 border-t border-zinc-200 pt-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
            <h4 className="mb-2 font-semibold uppercase tracking-wide text-zinc-500">Legal</h4>
            <div className="flex flex-wrap gap-3">
              {footer.legal.map((link, index) => (
                <FooterLegalLink key={`legal-${index}`} link={link} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) {
    return (
      <div>
        <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
        <dd className="text-sm text-zinc-500">Not provided</dd>
      </div>
    );
  }

  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="text-sm text-zinc-700 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

function FooterLinkItem({ item }: { item: FooterLink }) {
  if (!item?.link?.label) {
    return null;
  }

  const href = resolveLinkHref(item.link);
  const showIcon = item.icon && item.icon !== "dot";

  const labelNode = (
    <span className={showIcon ? "text-sm text-zinc-700 dark:text-zinc-100" : "text-sm text-zinc-300 underline"}>
      {item.link.label}
    </span>
  );

  const content = (
    <span className="flex items-center gap-3">
      {showIcon ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white dark:bg-zinc-700">
          {renderFooterIcon(item.icon!)}
        </span>
      ) : null}
      {labelNode}
    </span>
  );

  if (isExternalLink(item.link)) {
    return (
      <li>
        <a href={href} target={getLinkTarget(item.link)} rel="noreferrer noopener" className="flex items-center gap-3">
          {content}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className="flex items-center gap-3">
        {content}
      </Link>
    </li>
  );
}

function FooterLegalLink({ link }: { link: FooterLink["link"] }) {
  if (!link?.label) {
    return null;
  }

  const href = resolveLinkHref(link);
  const className =
    "text-sm text-zinc-600 underline transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white";

  if (isExternalLink(link)) {
    return (
      <a href={href} target={getLinkTarget(link)} rel="noreferrer noopener" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {link.label}
    </Link>
  );
}

function renderFooterIcon(icon: string) {
  switch (icon) {
    case "email":
      return "✉";
    case "phone":
      return "☎";
    case "linkedin":
      return "🔗";
    case "arrow":
      return "↑";
    default:
      return "•";
  }
}
