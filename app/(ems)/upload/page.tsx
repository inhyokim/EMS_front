"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api, err } from "@/src/lib/api";

type UploadRes = {
  batchId: number;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: { row: number; error: string }[];
};

export default function UploadPage(){
  const [file, setFile] = useState<File| null>(null);
  const [res, setRes] = useState<UploadRes | null>(null);
  const uploadMut = useMutation({
    mutationFn: async (f: File) => {
      const fd = new FormData();
      fd.append("file", f);
      const { data } = await api.post("/api/readings/upload", fd, {
        headers: {
          "Content-Type": undefined
        }
      });
      return data as UploadRes;
    },
    onSuccess: setRes
  });

  const deleteMut = useMutation({
    mutationFn: async (batchId: number) => api.delete(`/api/readings/uploads/${batchId}`)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">데이터 업로드</h1>

      <div className="border rounded-xl p-4 space-y-3 bg-white">
        <input type="file" accept=".csv,text/csv" onChange={(e)=>setFile(e.target.files?.[0]??null)} />
        <p className="text-sm text-gray-600">CSV 헤더: building_name, zone_name, meter_no, timestamp(ISO-8601), value</p>

        <div className="flex gap-2">
          <button className="btn" disabled={!file || uploadMut.isPending}
            onClick={async ()=> {
              if (!file) return;
              try { const r = await uploadMut.mutateAsync(file); setRes(r); }
              catch(e){ alert(err(e)); }
            }}>업로드 & 검증/저장</button>

          {res?.batchId && (
            <button className="btn-danger" onClick={async ()=>{
              if (!confirm(`업로드 배치 #${res.batchId} 삭제할까요?`)) return;
              try { await deleteMut.mutateAsync(res.batchId); alert("삭제 완료"); setRes(null); }
              catch(e){ alert(err(e)); }
            }}>업로드 배치 삭제</button>
          )}
        </div>
      </div>

      {res && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">결과</h2>
          <div className="p-3 border rounded-lg bg-white">
            <div>Batch ID: <b>{res.batchId}</b></div>
            <div>총 행: {res.totalRows} / 유효: {res.validRows} / 오류: <span className="text-red-500">{res.invalidRows}</span></div>
          </div>
          {res.invalidRows > 0 && (
            <div className="p-3 border rounded-lg bg-white">
              <h3 className="font-medium mb-2">오류 행</h3>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-100"><th className="p-2">Row</th><th className="p-2">Error</th></tr></thead>
                <tbody>
                {res.errors.map(e=>(
                  <tr key={e.row} className="border-b">
                    <td className="p-2">{e.row}</td><td className="p-2">{e.error}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
