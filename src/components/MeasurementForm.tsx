"use client";
import { useMutation } from "@tanstack/react-query";
import { api, errMessage } from "@/src/lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MeasurementCreateDto } from "@/src/types";

const schema = z.object({
  sensorId: z.coerce.number().int().positive("필수"),
  value: z.coerce.number().min(0, "0 이상"),
  measuredAt: z.string().optional(), // ISO string
});

type FormValues = z.infer<typeof schema>;

export function MeasurementForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const createMut = useMutation({
    mutationFn: async (body: MeasurementCreateDto) => {
      const response = await api.post("/api/measurements", body);
      return response.data;
    },
    onSuccess: () => { alert("저장 완료"); reset(); },
  });

  return (
    <form
      className="grid gap-3 p-3 border rounded-xl bg-white"
      onSubmit={handleSubmit(async (v) => {
        try { await createMut.mutateAsync(v); } catch (e) { alert(errMessage(e)); }
      })}
    >
      <label className="grid gap-1">
        <span className="text-sm">Sensor ID</span>
        <input className="input" type="number" {...register("sensorId")} />
        {errors.sensorId && <span className="text-red-500 text-xs">{errors.sensorId.message}</span>}
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Value</span>
        <input className="input" type="number" step="0.000001" {...register("value")} />
        {errors.value && <span className="text-red-500 text-xs">{errors.value.message}</span>}
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Measured At (옵션, ISO)</span>
        <input className="input" type="text" placeholder="2025-08-21T07:15:00Z" {...register("measuredAt")} />
      </label>

      <button className="btn" disabled={isSubmitting}>측정치 저장</button>
    </form>
  );
}
