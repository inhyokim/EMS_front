export default function NotFound(){
  return (
    <main className="max-w-xl mx-auto p-12 text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold mb-3">페이지를 찾을 수 없습니다</h1>
        <p className="text-neutral-500 mb-6">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <a href="/dashboard" className="btn bg-black text-white inline-block">
            대시보드로 이동
          </a>
        </div>
        <div className="text-sm text-gray-500">
          또는 사이드바 메뉴를 이용해주세요
        </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-400">
        <p>자주 방문하는 페이지:</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/sensors" className="hover:underline">센서 관리</a>
          <a href="/measurements/new" className="hover:underline">측정치 입력</a>
          <a href="/upload" className="hover:underline">CSV 업로드</a>
          <a href="/reports" className="hover:underline">리포트</a>
        </div>
      </div>
    </main>
  );
}
