"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SensorCreateDto } from "@/src/types";

const schema = z.object({
  sensorName: z.string().min(1, "필수"),
  type: z.string().min(1, "필수"),
  locationId: z.coerce.number().int().positive("필수"),
});

type FormValues = z.infer<typeof schema>;

export function SensorForm({
  defaultValues,
  onSubmit,
  submitText = "저장",
}: {
  defaultValues?: Partial<FormValues>;
  onSubmit: (v: SensorCreateDto) => void | Promise<void>;
  submitText?: string;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  return (
    <form
      className="grid gap-3 p-3 border rounded-xl bg-white"
      onSubmit={handleSubmit(async (v) => onSubmit(v as SensorCreateDto))}
    >
      <label className="grid gap-1">
        <span className="text-sm">Sensor Name</span>
        <input className="input" {...register("sensorName")} />
        {errors.sensorName && <span className="text-red-500 text-xs">{errors.sensorName.message}</span>}
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Type</span>
        <input className="input" {...register("type")} placeholder="POWER / TEMP ..." />
        {errors.type && <span className="text-red-500 text-xs">{errors.type.message}</span>}
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Location ID</span>
        <input className="input" type="number" {...register("locationId")} />
        {errors.locationId && <span className="text-red-500 text-xs">{errors.locationId.message}</span>}
      </label>

      <button className="btn" disabled={isSubmitting}>{submitText}</button>
    </form>
  );
}
