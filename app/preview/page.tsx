import { getSiteSettings } from "@/lib/site-settings";
import { getHomePage } from "@/lib/home-page";
import type { HomePage, HomePageBlock, HeroBlock, MenuItem, SiteSettings, TextMediaBlock } from "@/types/sanity";

export default async function PreviewPage() {
  const settings = await getSiteSettings();
  const homePage = await getHomePage();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">CMS Data Preview</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Site Settings Card */}
        <SchemaCard title="Site Settings" data={settings} />

        {/* Menu Card */}
        {settings?.menu && <MenuCard menu={settings.menu} />}

        {/* Home Page Card */}
        <HomePageCard homePage={homePage} />
      </div>
    </div>
  );
}

type SchemaCardProps = {
  title: string;
  data: SiteSettings | null;
};

function SchemaCard({ title, data }: SchemaCardProps) {
  if (!data) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <p className="text-sm text-zinc-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <div className="space-y-3 text-sm">
        <DataRow label="Site Title" value={data.siteTitle} />
        <DataRow label="Default Language" value={data.defaultLanguage} />
        <DataRow label="Logo" value={data.logo?.asset?.url ? "✅ Set" : "❌ Not set"} />
        <DataRow
          label="Contact"
          value={
            data.contact
              ? `${data.contact.email ? "Email: " + data.contact.email : ""} ${data.contact.phone ? "Phone: " + data.contact.phone : ""}`.trim() || "✅ Set"
              : "❌ Not set"
          }
        />
        <DataRow
          label="Social Links"
          value={data.social && data.social.length > 0 ? `${data.social.length} link(s)` : "❌ None"}
        />
        <DataRow
          label="Footer"
          value={data.footer ? `✅ ${data.footer.columns?.length ?? 0} column(s)` : "❌ Not set"}
        />
        <DataRow label="SEO" value={data.seo ? "✅ Set" : "❌ Not set"} />
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          View Raw JSON
        </summary>
        <pre className="mt-2 max-h-96 overflow-auto rounded bg-zinc-100 p-4 text-xs dark:bg-zinc-800">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}

type MenuCardProps = {
  menu: SiteSettings["menu"];
};

function MenuCard({ menu }: MenuCardProps) {
  if (!menu) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Menu</h2>
        <p className="text-sm text-zinc-500">No menu data available</p>
      </div>
    );
  }

  const items = (menu.items ?? []).filter(Boolean) as MenuItem[];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Menu</h2>
      <div className="space-y-3 text-sm">
        <DataRow label="Menu ID" value={menu._id ?? "N/A"} />
        <DataRow label="Menu Title" value={menu.title ?? "Untitled"} />
        <DataRow label="Items Count" value={`${items.length} item(s)`} />
      </div>

      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Menu Items:</h3>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={item._key ?? index} className="rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{item.title}</span>
                  <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs font-semibold uppercase text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                    {item.itemType}
                  </span>
                </div>
                {item.itemType === "link" && item.link && (
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    → {item.link.label ?? item.title} ({item.link.linkType})
                  </p>
                )}
                {item.itemType === "parent" && item.childItems?.length && (
                  <ul className="mt-2 space-y-1 pl-4">
                    {item.childItems.map((child, childIndex) => (
                      <li key={child._key ?? childIndex} className="text-xs text-zinc-600 dark:text-zinc-400">
                        • {child.title} {child.itemType === "link" && child.link && `→ ${child.link.label ?? child.title}`}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          View Raw JSON
        </summary>
        <pre className="mt-2 max-h-96 overflow-auto rounded bg-zinc-100 p-4 text-xs dark:bg-zinc-800">
          {JSON.stringify(menu, null, 2)}
        </pre>
      </details>
    </div>
  );
}

type HomePageCardProps = {
  homePage: HomePage | null;
};

function HomePageCard({ homePage }: HomePageCardProps) {
  if (!homePage) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">Home Page</h2>
        <p className="text-sm text-zinc-500">No homePage document found.</p>
      </div>
    );
  }

  const blocks = (homePage.builder ?? []) as HomePageBlock[];
  const heroBlocks = blocks.filter((b) => b._type === "heroBlock") as HeroBlock[];
  const textBlocks = blocks.filter((b) => b._type === "textMediaBlock") as TextMediaBlock[];
  const primaryHero = heroBlocks[0];
  const primaryText = textBlocks[0];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">Home Page</h2>
      <div className="space-y-3 text-sm">
        <DataRow label="ID" value={homePage._id} />
        <DataRow label="Name" value={homePage.name} />
        <DataRow label="Blocks" value={`${blocks.length} block(s)`} />
        <DataRow label="Hero blocks" value={`${heroBlocks.length}`} />
        <DataRow label="Text/media blocks" value={`${textBlocks.length}`} />
        <DataRow label="SEO title" value={homePage.seo?.title ?? "N/A"} />
        <DataRow label="SEO description" value={homePage.seo?.description ?? "N/A"} />
        <DataRow label="SEO noIndex" value={homePage.seo?.noIndex ? "true" : "false"} />
      </div>

      {primaryHero && (
        <div className="mt-4 space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3">
          <h3 className="text-sm font-semibold text-zinc-800">Primary heroBlock</h3>
          <p className="text-sm">
            <span className="font-medium">Title:</span> {primaryHero.title}
          </p>
          {primaryHero.summary && (
            <p className="text-sm">
              <span className="font-medium">Summary:</span> {primaryHero.summary}
            </p>
          )}
          {primaryHero.actions && primaryHero.actions.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Actions:</span>
              <ul className="mt-1 list-disc pl-5 text-xs">
                {primaryHero.actions.map((action, index) => (
                  <li key={index}>
                    {action.label} — {action.href ?? "(no href)"}{" "}
                    {action.openInNewTab ? "(new tab)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {primaryText && (
        <div className="mt-4 space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3">
          <h3 className="text-sm font-semibold text-zinc-800">Primary textMediaBlock</h3>
          {primaryText.title && (
            <p className="text-sm">
              <span className="font-medium">Title:</span> {primaryText.title}
            </p>
          )}
          <p className="text-xs text-zinc-600">
            Body: {primaryText.body ? `${primaryText.body.length} block(s)` : "N/A"}
          </p>
        </div>
      )}

      {blocks.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-zinc-700">Blocks:</h3>
          <ul className="space-y-2 text-xs text-zinc-700">
            {blocks.map((block) => {
              const typedBlock = block as HomePageBlock;
              const key = (typedBlock as any)._key ?? String(typedBlock._type);
              let label = String(typedBlock._type);
              if (typedBlock._type === "heroBlock" && (typedBlock as HeroBlock).title) {
                label += ` — ${(typedBlock as HeroBlock).title}`;
              } else if (typedBlock._type === "textMediaBlock" && (typedBlock as TextMediaBlock).title) {
                label += ` — ${(typedBlock as TextMediaBlock).title}`;
              }
              return <li key={key}>{label}</li>;
            })}
          </ul>
        </div>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-900">
          View Raw JSON
        </summary>
        <pre className="mt-2 max-h-96 overflow-auto rounded bg-zinc-100 p-4 text-[11px]">
          {JSON.stringify(homePage, null, 2)}
        </pre>
      </details>
    </div>
  );
}

type DataRowProps = {
  label: string;
  value: string | null | undefined;
};

function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}:</dt>
      <dd className="text-right text-sm text-zinc-900 dark:text-zinc-100">{value ?? "N/A"}</dd>
    </div>
  );
}

