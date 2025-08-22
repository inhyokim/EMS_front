"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { useState } from "react";
import { format } from "date-fns";

async function fetchMeasurements(from: string, to: string) {
  const { data } = await api.get("/api/measurements", { params: { from, to } });
  return data;
}

export default function DailyAverageChart() {
  const today = format(new Date(), "yyyy-MM-dd");
  const weekAgo = format(new Date(Date.now() - 6 * 24 * 3600 * 1000), "yyyy-MM-dd");
  
  const [from, setFrom] = useState(weekAgo);
  const [to, setTo] = useState(today);
  
  const { data = [], refetch, isFetching, error } = useQuery({
    queryKey: ["measurements-simple", from, to],
    queryFn: () => fetchMeasurements(from, to),
  });

  // 간단한 통계 계산
  const totalMeasurements = data.length;
  const avgValue = data.length > 0 ? (data.reduce((sum: number, m: any) => sum + Number(m.value || 0), 0) / data.length).toFixed(2) : "0";
  const minValue = data.length > 0 ? Math.min(...data.map((m: any) => Number(m.value || 0))).toFixed(2) : "0";
  const maxValue = data.length > 0 ? Math.max(...data.map((m: any) => Number(m.value || 0))).toFixed(2) : "0";

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end p-4 border rounded-xl bg-white">
        <label className="grid text-sm">From<input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
        <label className="grid text-sm">To<input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
        <button className="btn" onClick={()=>refetch()} disabled={isFetching}>조회</button>
      </div>
      
      {error ? (
        <div className="p-4 border rounded-xl bg-red-50 text-red-700">
          ⚠️ 데이터를 불러올 수 없습니다. 백엔드 API 연결을 확인해주세요.
        </div>
      ) : (
        <>
          {/* 통계 요약 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg bg-white text-center">
              <div className="text-xs text-gray-500">측정 개수</div>
              <div className="text-lg font-bold">{totalMeasurements}</div>
            </div>
            <div className="p-3 border rounded-lg bg-white text-center">
              <div className="text-xs text-gray-500">평균값</div>
              <div className="text-lg font-bold">{avgValue}</div>
            </div>
            <div className="p-3 border rounded-lg bg-white text-center">
              <div className="text-xs text-gray-500">최솟값</div>
              <div className="text-lg font-bold">{minValue}</div>
            </div>
            <div className="p-3 border rounded-lg bg-white text-center">
              <div className="text-xs text-gray-500">최댓값</div>
              <div className="text-lg font-bold">{maxValue}</div>
            </div>
          </div>

          {/* 측정 데이터 테이블 */}
          <div className="border rounded-xl bg-white overflow-hidden">
            <div className="p-3 bg-gray-50 font-medium">측정 데이터 목록</div>
            {data.length === 0 ? (
              <div className="p-6 text-center text-gray-500">선택한 기간에 데이터가 없습니다.</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">시간</th>
                      <th className="p-2 text-left">센서</th>
                      <th className="p-2 text-right">값</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 50).map((m: any, idx: number) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{m.measuredAt?.substring(0, 19) || '-'}</td>
                        <td className="p-2">{m.sensor?.sensorName || m.sensor?.id || '-'}</td>
                        <td className="p-2 text-right font-mono">{Number(m.value || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 50 && (
                  <div className="p-2 text-center text-xs text-gray-500 bg-gray-50">
                    상위 50개 항목만 표시됨 (전체: {data.length}개)
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}