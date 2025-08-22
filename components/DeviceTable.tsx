'use client'

import { useEffect, useState } from 'react'
import { apiClient, extractData, ApiClientError } from '@/lib/apiClient'
import { Device, LoadingState } from '@/lib/types'
import { AlertCircle, CheckCircle, Clock, Settings } from 'lucide-react'

/**
 * DeviceTable Component
 * 장치 목록을 테이블 형태로 표시하는 클라이언트 컴포넌트
 */
export default function DeviceTable() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  // 장치 목록 조회
  const fetchDevices = async () => {
    try {
      setLoadingState('loading')
      setError(null)
      
      const data = await extractData(apiClient.devices.getAll())
      setDevices(data)
      setLoadingState('success')
    } catch (err) {
      console.error('Failed to fetch devices:', err)
      
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError('장치 목록을 불러오는데 실패했습니다.')
      }
      setLoadingState('error')
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchDevices()
  }, [])

  // 날짜 포맷팅
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    
    try {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString))
    } catch {
      return '-'
    }
  }

  // 장치 타입 아이콘
  const getDeviceTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'METER':
        return <Settings className="w-4 h-4" />
      case 'SENSOR':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // 활성 상태 배지
  const getStatusBadge = (active?: boolean) => {
    if (active === undefined) return null
    
    return (
      <span
        className={`
          inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium
          ${
            active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }
        `}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            active ? 'bg-green-400' : 'bg-gray-400'
          }`}
        />
        <span>{active ? '활성' : '비활성'}</span>
      </span>
    )
  }

  // 로딩 상태
  if (loadingState === 'loading') {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="loading-spinner" />
          <span className="text-gray-600">장치 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (loadingState === 'error') {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center space-x-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <div className="text-center">
            <p className="font-medium">오류 발생</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
            <button
              onClick={fetchDevices}
              className="btn-primary mt-4"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 데이터가 없는 경우
  if (devices.length === 0) {
    return (
      <div className="card p-8">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            등록된 장치가 없습니다
          </h3>
          <p className="text-sm">
            새로운 장치를 등록하여 에너지 관리를 시작하세요.
          </p>
        </div>
      </div>
    )
  }

  // 테이블 렌더링
  return (
    <div className="section-enter">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">장치 목록</h2>
          <p className="text-gray-600 mt-1">
            총 {devices.length}개의 장치가 등록되어 있습니다.
          </p>
        </div>
        
        {/* 새로고침 버튼 */}
        <button
          onClick={fetchDevices}
          className="btn-secondary"
          disabled={loadingState === 'loading' as LoadingState}
        >
          새로고침
        </button>
      </div>

      {/* 테이블 */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>장치명</th>
                <th>타입</th>
                <th>위치</th>
                <th>상태</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="group">
                  {/* ID */}
                  <td>
                    <span className="font-mono text-sm font-medium text-gray-900">
                      #{device.id}
                    </span>
                  </td>

                  {/* 장치명 */}
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors duration-200">
                        {getDeviceTypeIcon(device.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {device.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 타입 */}
                  <td>
                    <span className="badge badge-info">
                      {device.type}
                    </span>
                  </td>

                  {/* 위치 */}
                  <td>
                    <span className="text-gray-600">
                      {device.location || '-'}
                    </span>
                  </td>

                  {/* 상태 */}
                  <td>
                    {getStatusBadge(device.active)}
                  </td>

                  {/* 등록일 */}
                  <td>
                    <span className="text-gray-600 text-sm">
                      {formatDate(device.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="card p-4">
          <div className="text-sm text-gray-600">전체 장치</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {devices.length}
          </div>
        </div>
        
        <div className="card p-4">
          <div className="text-sm text-gray-600">활성 장치</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {devices.filter(d => d.active).length}
          </div>
        </div>
        
        <div className="card p-4">
          <div className="text-sm text-gray-600">비활성 장치</div>
          <div className="text-2xl font-bold text-gray-400 mt-1">
            {devices.filter(d => !d.active).length}
          </div>
        </div>
      </div>
    </div>
  )
}