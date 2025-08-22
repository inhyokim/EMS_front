import SensorTable from "@/src/components/SensorTable";

export default function SensorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">센서 관리</h1>
      <SensorTable />
    </div>
  );
}
