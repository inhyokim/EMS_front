import { MeasurementForm } from "@/src/components/MeasurementForm";
import MeasurementRange from "@/src/components/MeasurementRange";

export default function NewMeasurementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">측정치 입력 / 조회</h1>
      <MeasurementForm />
      <MeasurementRange />
    </div>
  );
}
