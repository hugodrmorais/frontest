import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-zinc-900">
        {settings?.siteTitle ?? "Home"}
      </h1>

    </div>
  );
}
