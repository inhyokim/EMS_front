"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, errMessage } from "@/src/lib/api";
import { Sensor, SensorCreateDto, SensorUpdateDto } from "@/src/types";
import { SensorForm } from "./SensorForm";
import { useState } from "react";

async function fetchSensors(): Promise<Sensor[]> {
  const { data } = await api.get("/api/sensors");
  return data;
}

export default function SensorTable() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["sensors"], queryFn: fetchSensors });

  const [editing, setEditing] = useState<Sensor | null>(null);

  const createMut = useMutation({
    mutationFn: (body: SensorCreateDto) => api.post("/api/sensors", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sensors"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: SensorUpdateDto }) =>
      api.put(`/api/sensors/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sensors"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/api/sensors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sensors"] }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div className="text-red-500 p-4 border rounded-lg bg-red-50">
      <div className="font-medium">센서 목록 불러오기 실패</div>
      <div className="text-sm mt-1">{errMessage(error)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SensorForm
        submitText="센서 추가"
        onSubmit={async (v) => {
          try { 
            await createMut.mutateAsync(v); 
          } catch (e) { 
            console.error("센서 생성 오류:", e);
            alert(`센서 생성 실패: ${errMessage(e)}`); 
          }
        }}
      />

      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Location</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2">{s.id}</td>
                <td className="p-2">{s.sensorName}</td>
                <td className="p-2">{s.type}</td>
                <td className="p-2">{s.location?.name ?? s.location?.id}</td>
                <td className="p-2 space-x-2">
                  <button className="btn-secondary" onClick={() => setEditing(s)}>수정</button>
                  <button
                    className="btn-danger"
                    onClick={async () => {
                      if (!confirm(`삭제할까요? #${s.id}`)) return;
                      try { await deleteMut.mutateAsync(s.id); } catch (e) { alert(errMessage(e)); }
                    }}
                  >삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="p-4 border rounded-xl bg-white">
          <h3 className="font-medium mb-2">센서 수정: #{editing.id}</h3>
          <SensorForm
            defaultValues={{
              sensorName: editing.sensorName,
              type: editing.type,
              locationId: editing.location?.id ?? editing.locationId!,
            }}
            submitText="수정 저장"
            onSubmit={async (v) => {
              try { await updateMut.mutateAsync({ id: editing.id, body: v }); setEditing(null); }
              catch (e) { alert(errMessage(e)); }
            }}
          />
          <button className="btn mt-2" onClick={() => setEditing(null)}>닫기</button>
        </div>
      )}
    </div>
  );
}
