import { AdminShell } from "@/components/admin/AdminShell";
import { LeadsPanel } from "@/components/admin/LeadsPanel";
import { StatsCards } from "@/components/admin/StatsCards";
import { getAllLeads, getLeadStats } from "@/lib/leads-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [leads, stats] = await Promise.all([getAllLeads(), getLeadStats()]);

  return (
    <AdminShell>
      <div className="space-y-8">
        <StatsCards stats={stats} />
        <LeadsPanel initialLeads={leads} />
      </div>
    </AdminShell>
  );
}
