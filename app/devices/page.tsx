import { Metadata } from 'next'
import DeviceTable from '@/components/DeviceTable'

export const metadata: Metadata = {
  title: 'Devices - EMS',
  description: '등록된 에너지 관리 장치 목록 및 상태 모니터링',
}

/**
 * Devices Page
 * 장치 목록 페이지
 */
export default function DevicesPage() {
  return (
    <div className="container py-8 page-enter">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-balance">
              장치 관리
            </h1>
            <p className="text-gray-600 mt-2">
              등록된 에너지 관리 장치들의 상태를 확인하고 관리하세요.
            </p>
          </div>
          
          {/* 향후 확장용 액션 버튼 */}
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              내보내기
            </button>
            <button className="btn-primary">
              장치 추가
            </button>
          </div>
        </div>
      </div>

      {/* 장치 테이블 */}
      <DeviceTable />
    </div>
  )
}