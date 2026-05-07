import { Search, User } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#d9d4ca] text-[#383532] hover:bg-[#383532] hover:text-[#FDFBF7] transition-all">
              <User className="w-4 h-4" />
            </button>
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
