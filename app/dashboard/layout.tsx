import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentUserAccess } from "@/lib/auth/sessionHelper";

export default async function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userAccess = await getCurrentUserAccess();

  return (
    <DashboardLayout userAccess={userAccess}>
      {children}
    </DashboardLayout>
  );
}