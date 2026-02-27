import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { BarChart } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  collapsed,
  setCollapsed,
}) {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    setRole(decoded.role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40 flex flex-col ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b">
        {!collapsed && (
          <h1 className="text-lg font-bold text-primary">
            Admission Admin
          </h1>
        )}

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">

        <Link
          href="/dashboard"
          className="flex items-center gap-3 hover:text-primary"
        >
          <LayoutDashboard size={20} />
          {!collapsed && "Dashboard"}
        </Link>

        <Link
          href="/applications"
          className="flex items-center gap-3 hover:text-primary"
        >
          <FileText size={20} />
          {!collapsed && "Applications"}
        </Link>

        {role === 0 && (
          <>
            <Link
              href="/users"
              className="flex items-center gap-3 hover:text-primary"
            >
              <Users size={20} />
              {!collapsed && "Users"}
            </Link>

            <Link
              href="/cohort-config"
              className="flex items-center gap-3 hover:text-primary"
            >
              <Settings size={20} />
              {!collapsed && "Cohort Config"}
            </Link>
            <Link
              href="/reports"
              className="flex items-center gap-3 hover:text-primary"
            >
              <BarChart size={20} />
              {!collapsed && "Reports"}
            </Link>
          </>
        )}
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 p-3 rounded-xl transition"
        >
          <LogOut size={20} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}