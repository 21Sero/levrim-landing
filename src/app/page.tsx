import { fetchStats } from "@/lib/api";
import { LandingPage } from "@/components/LandingPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const stats = await fetchStats();
  return <LandingPage stats={stats} />;
}
