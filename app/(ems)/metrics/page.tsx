import DailyAverageChart from "@/src/components/DailyAverageChart";

export default function MetricsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">일 평균 에너지 지표</h1>
      <DailyAverageChart />
    </div>
  );
}
