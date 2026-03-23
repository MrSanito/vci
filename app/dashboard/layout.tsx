import DashboardSidebar from "../components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      <DashboardSidebar />
      {/* PC uses standard Navbar (pt-24), Mobile uses Sidebar Header (pt-16) */}
      <main className="flex-1 pt-16 lg:pt-24 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
