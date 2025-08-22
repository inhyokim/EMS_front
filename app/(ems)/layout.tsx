"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BarChart3, Database, FileDown, Gauge, Home, Upload, Wrench, LogOut, LogIn } from "lucide-react";
import React, { useState, useEffect } from "react";

const nav = [
  { href: "/dashboard", label: "대시보드", icon: Home },
  { href: "/upload", label: "데이터 업로드", icon: Upload },
  { href: "/sensors", label: "센서 관리", icon: Database },
  { href: "/measurements/new", label: "측정치 입력/조회", icon: Activity },
  { href: "/metrics", label: "일 평균 지표", icon: Gauge },
  { href: "/reports", label: "리포트", icon: FileDown },
  // { href: "/jobs", label: "집계 작업", icon: Wrench }, // 추후 확장 시
];

export default function EMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("ems_token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ems_token");
    setToken(null);
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="px-4 py-5 font-bold text-lg">EMS Lite</div>
        <nav className="px-2 space-y-1 flex-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm
                ${active ? "bg-black text-white" : "hover:bg-neutral-100"}`}>
                <Icon size={16} /> <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Login/Logout in Sidebar */}
        <div className="p-4 border-t">
          {token ? (
            <div className="space-y-2">
              <div className="text-xs text-neutral-500">로그인됨: {token.replace('demo-', '')}</div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
              >
                <LogOut size={14} /> 로그아웃
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <LogIn size={14} /> 로그인
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
          <div className="font-semibold">KT 스마트빌딩 EMS Lite 시스템</div>
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span>연동: {process.env.NEXT_PUBLIC_API_BASE_URL}</span>
            {token && (
              <span className="text-green-600">✓ 인증됨</span>
            )}
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </div>
    </div>
  );
}
