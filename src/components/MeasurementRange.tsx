"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { Measurement } from "@/src/types";
import { useState } from "react";
import { format } from "date-fns";

async function fetchRange(from: string, to: string): Promise<Measurement[]> {
  const { data } = await api.get("/api/measurements", { params: { from, to } });
  return data;
}

export default function MeasurementRange() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["measurements", from, to],
    queryFn: () => fetchRange(from, to),
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end p-4 border rounded-xl bg-white">
        <label className="grid text-sm">From<input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
        <label className="grid text-sm">To<input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
        <button className="btn" onClick={() => refetch()} disabled={isFetching}>조회</button>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full border-separate border-spacing-0">
          <thead><tr className="bg-gray-100 text-left"><th className="p-2">Time</th><th className="p-2">Sensor</th><th className="p-2">Value</th></tr></thead>
          <tbody>
            {data?.map((m)=>(
              <tr key={m.id} className="border-b">
                <td className="p-2">{m.measuredAt}</td>
                <td className="p-2">{m.sensor?.sensorName ?? m.sensor?.id}</td>
                <td className="p-2">{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
