"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import React from "react";

async function fetchHealth(){ const {data}=await api.get("/api/health"); return data; }
async function fetchSensors(){ const {data}=await api.get("/api/sensors"); return data as any[]; }
async function fetchWeatherUsage(){
  const {data}=await api.get("/api/ext/weather-usage"); return data as any;
}

export default function DashboardPage(){
  // 간단한 로그인 가드 (데모용)
  React.useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("ems_token")) {
      window.location.href = "/login";
    }
  }, []);

  const {data:health} = useQuery({queryKey:["health"], queryFn:fetchHealth});
  const {data:sensors=[]} = useQuery({queryKey:["sensors"], queryFn:fetchSensors});
  const {data:wu} = useQuery({queryKey:["weather-usage"], queryFn:fetchWeatherUsage});

  const temp = wu?.weather?.current_weather?.temperature;
  const wind = wu?.weather?.current_weather?.windspeed;
  const u24  = wu?.usageLast24h;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI title="백엔드 연결" value={health? "UP":"DOWN"} />
        <KPI title="등록 센서" value={`${sensors.length} 개`} />
        <KPI title="현재 기온" value={temp ? `${temp}°C` : "로딩중"} />
        <KPI title="최근 24h 사용량" value={Number(u24||0).toFixed(1)} />
      </div>
      
      {/* 외부 API × 사용량 */}
      <section className="p-4 border rounded-xl bg-white">
        <div className="mb-3 font-semibold">외부 API 연동 (Open‑Meteo)</div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            {temp===undefined ? (
              <div className="text-sm text-red-500">{!wu? "로딩중..." : "데이터 없음"}</div>
            ) : (
              <ul className="text-sm space-y-1">
                <li>📍 서울 기상 정보</li>
                <li>🌡️ 현재 기온: <b>{temp} °C</b></li>
                <li>💨 풍속: <b>{wind} m/s</b></li>
                <li>⚡ 최근 24h 사용량 합: <b>{Number(u24||0).toFixed(1)}</b></li>
              </ul>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">외부 API 연동 상태</div>
              <div className="text-xs text-gray-600 mt-1">
                {wu?.weather?.error ? (
                  <span className="text-red-600">❌ API 호출 실패: {wu.weather.error}</span>
                ) : temp ? (
                  <span className="text-green-600">✅ Open-Meteo API 연결 성공</span>
                ) : (
                  <span className="text-yellow-600">🔄 API 호출 중...</span>
                )}
              </div>
              {temp && (
                <div className="mt-2 text-xs text-gray-500">
                  실시간 서울 날씨 데이터와 최근 24시간 에너지 사용량을 통합 제공
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* 시스템 상태 */}
      <section className="p-4 border rounded-xl bg-white">
        <div className="mb-3 font-semibold">시스템 상태</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 font-medium">✅ 백엔드 서비스</div>
            <div className="text-xs text-green-700">Spring Boot 3.3.5 실행 중</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">🗄️ 데이터베이스</div>
            <div className="text-xs text-blue-700">H2 인메모리 DB 연결됨</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">🌐 프론트엔드</div>
            <div className="text-xs text-purple-700">Next.js 14 + React Query</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-sm text-orange-600 font-medium">📊 기능</div>
            <div className="text-xs text-orange-700">센서 관리, 측정값, 리포트</div>
          </div>
        </div>
      </section>
      
      {/* 빠른 실행 */}
      <section className="p-4 border rounded-xl bg-white">
        <div className="mb-3 font-semibold">빠른 실행</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/sensors" className="p-3 text-center border rounded-lg hover:bg-gray-50">
            <div className="text-sm font-medium">센서 관리</div>
            <div className="text-xs text-gray-500">CRUD</div>
          </a>
          <a href="/measurements/new" className="p-3 text-center border rounded-lg hover:bg-gray-50">
            <div className="text-sm font-medium">측정치 입력</div>
            <div className="text-xs text-gray-500">데이터 추가</div>
          </a>
          <a href="/upload" className="p-3 text-center border rounded-lg hover:bg-gray-50">
            <div className="text-sm font-medium">CSV 업로드</div>
            <div className="text-xs text-gray-500">일괄 등록</div>
          </a>
          <a href="/reports" className="p-3 text-center border rounded-lg hover:bg-gray-50">
            <div className="text-sm font-medium">리포트</div>
            <div className="text-xs text-gray-500">데이터 분석</div>
          </a>
        </div>
      </section>
    </div>
  );
}

function KPI({title,value}:{title:string;value:string}){
  return (
    <div className="p-4 border rounded-xl bg-white">
      <div className="text-xs text-neutral-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
