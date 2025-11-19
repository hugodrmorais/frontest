import { getSiteSettings } from "@/lib/site-settings";
import type { MenuItem, SiteSettings } from "@/types/sanity";

export default async function PreviewPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">CMS Data Preview</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Site Settings Card */}
        <SchemaCard title="Site Settings" data={settings} />

        {/* Menu Card */}
        {settings?.menu && <MenuCard menu={settings.menu} />}
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

