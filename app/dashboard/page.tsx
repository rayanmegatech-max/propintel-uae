import MorningCoffeeGrid from "@/components/dashboard/MorningCoffeeGrid";

async function getDashboardMetrics() {
  return {
    totalActiveListings: { value: "48,320", delta: "+2.4%", up: true },
    marketTurnover:      { value: "AED 9.2B", delta: "+11.7%", up: true },
    avgTDOM:             { value: "38 days",  delta: "–3 days", up: true },
  };
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Welcome back, Ahmed
        </p>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Market Intelligence Overview
        </h1>
      </div>
      <MorningCoffeeGrid metrics={metrics} />
    </div>
  );
}