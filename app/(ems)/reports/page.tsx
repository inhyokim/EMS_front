"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Row = { bucket:string; usage:number };

async function fetchSummary(period:"weekly"|"monthly", from:string, to:string): Promise<Row[]> {
  const { data } = await api.get("/api/reports/summary", { params: { period, from, to }});
  return data;
}

export default function ReportsPage(){
  const today = format(new Date(), "yyyy-MM-dd");
  const monthAgo = format(new Date(Date.now()-29*24*3600*1000), "yyyy-MM-dd");
  const [period, setPeriod] = useState<"weekly"|"monthly">("weekly");
  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(today);

  const { data = [], refetch, isFetching } = useQuery({
    queryKey: ["report", period, from, to],
    queryFn: () => fetchSummary(period, from, to),
  });

  const csvUrl = useMemo(() => {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
    const params = new URLSearchParams({ period, from, to }).toString();
    return `${base}/api/reports/summary.csv?${params}`;
  }, [period, from, to]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">요약 리포트</h1>

      <div className="flex gap-3 items-end p-4 border rounded-xl bg-white">
        <label className="grid text-sm">
          Period
          <select className="input" value={period} onChange={e=>setPeriod(e.target.value as any)}>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
          </select>
        </label>
        <label className="grid text-sm">From<input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
        <label className="grid text-sm">To<input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
        <button className="btn" onClick={()=>refetch()} disabled={isFetching}>조회</button>
        <a className="btn" href={csvUrl}>CSV 다운로드</a>
      </div>

      <div className="h-[360px] w-full border rounded-xl p-2 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="bucket" /><YAxis /><Tooltip /><Legend />
            <Line type="monotone" dataKey="usage" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-100 text-left"><th className="p-2">Bucket</th><th className="p-2">Usage</th></tr></thead>
          <tbody>{data.map((r)=>(
            <tr key={r.bucket} className="border-b"><td className="p-2">{r.bucket}</td><td className="p-2">{r.usage}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
