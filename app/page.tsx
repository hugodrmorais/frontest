import { getSiteSettings } from "@/lib/site-settings";
import { getHomePage } from "@/lib/home-page";
import { HomeBuilder } from "@/components/home-builder";

export default async function Home() {
  const settings = await getSiteSettings();
  const homePage = await getHomePage();

  return (
    <div className="bg-white">
      <HomeBuilder blocks={homePage?.builder ?? []} />
    </div>
  );
}
