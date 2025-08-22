"use client";

export default function GlobalError({ error, reset }: { error: any; reset: () => void }) {
  return (
    <html>
      <body>
        <main className="max-w-xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">문제가 발생했어요 ⚠️</h1>
          <div className="p-4 border rounded-lg bg-red-50 mb-4">
            <div className="text-sm font-medium text-red-800 mb-2">오류 상세:</div>
            <pre className="p-3 border rounded bg-neutral-50 text-xs overflow-auto text-red-700">
              {String(error?.message || error)}
            </pre>
          </div>
          <div className="flex gap-3">
            <button 
              className="btn bg-blue-500 text-white" 
              onClick={() => reset()}
            >
              다시 시도
            </button>
            <button 
              className="btn bg-gray-500 text-white" 
              onClick={() => window.location.href = '/dashboard'}
            >
              대시보드로 이동
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
