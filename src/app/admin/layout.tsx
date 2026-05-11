import { Search } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-[#383532]">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-24 px-12 flex items-center justify-between border-b border-transparent">
          <h1 className="font-semibold text-xs tracking-[0.2em] uppercase text-[#383532]">
            Tropical Line Design Admin
          </h1>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a5a098]" />
              <input 
                type="text" 
                placeholder="Search terminal..." 
                className="pl-10 pr-4 py-2 w-64 bg-transparent border border-[#d9d4ca] rounded text-sm outline-none focus:border-[#d97706] transition-colors placeholder:text-[#a5a098]"
              />
            </div>
            <AdminUserMenu email={user.email ?? "admin"} />
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
