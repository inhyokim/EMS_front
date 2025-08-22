/**
 * API Client
 * 백엔드 API와 통신하는 클라이언트
 */

import { 
  ApiResponse, 
  Device, 
  EnergyReading, 
  DeviceCreateRequest, 
  EnergyReadingCreateRequest,
  ApiError 
} from './types'

// 환경변수에서 API 베이스 URL 가져오기
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081'

/**
 * API 에러 클래스
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

/**
 * HTTP 요청 헬퍼
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.message || errorMessage
      } catch {
        // JSON 파싱 실패시 기본 메시지 사용
      }
      
      throw new ApiClientError(
        errorMessage,
        response.status,
        response.status.toString()
      )
    }

    const data = await response.json()
    return data as ApiResponse<T>
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    
    // 네트워크 에러 등
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    )
  }
}

/**
 * API Client 객체
 */
export const apiClient = {
  // Health Check
  health: () => request<{ status: string }>('/api/health'),

  // Device APIs
  devices: {
    // 모든 장치 조회
    getAll: (params?: { active?: boolean; type?: string }) => {
      const searchParams = new URLSearchParams()
      if (params?.active !== undefined) {
        searchParams.append('active', params.active.toString())
      }
      if (params?.type) {
        searchParams.append('type', params.type)
      }
      
      const query = searchParams.toString()
      return request<Device[]>(`/api/devices${query ? `?${query}` : ''}`)
    },

    // 특정 장치 조회
    getById: (id: number) => request<Device>(`/api/devices/${id}`),

    // 장치 생성
    create: (device: DeviceCreateRequest) =>
      request<Device>('/api/devices', {
        method: 'POST',
        body: JSON.stringify(device),
      }),

    // 장치 수정
    update: (id: number, device: Partial<DeviceCreateRequest>) =>
      request<Device>(`/api/devices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(device),
      }),

    // 장치 삭제
    delete: (id: number) =>
      request<void>(`/api/devices/${id}`, {
        method: 'DELETE',
      }),
  },

  // Energy Reading APIs
  readings: {
    // 기간별 에너지 사용량 조회
    getByDateRange: (params: {
      deviceId: number
      from: string // ISO-8601
      to: string // ISO-8601
      limit?: number
    }) => {
      const searchParams = new URLSearchParams({
        deviceId: params.deviceId.toString(),
        from: params.from,
        to: params.to,
      })
      
      if (params.limit) {
        searchParams.append('limit', params.limit.toString())
      }
      
      return request<EnergyReading[]>(`/api/readings?${searchParams.toString()}`)
    },

    // 장치별 에너지 사용량 조회
    getByDevice: (deviceId: number, limit = 100) =>
      request<EnergyReading[]>(`/api/readings/device/${deviceId}?limit=${limit}`),

    // 전체 에너지 사용량 조회
    getAll: (params: { from: string; to: string }) => {
      const searchParams = new URLSearchParams({
        from: params.from,
        to: params.to,
      })
      return request<EnergyReading[]>(`/api/readings/all?${searchParams.toString()}`)
    },

    // 에너지 사용량 기록
    create: (reading: EnergyReadingCreateRequest) =>
      request<EnergyReading>('/api/readings', {
        method: 'POST',
        body: JSON.stringify(reading),
      }),
  },
}

/**
 * API 응답에서 데이터 추출 헬퍼
 */
export async function extractData<T>(
  apiCall: Promise<ApiResponse<T>>
): Promise<T> {
  try {
    const response = await apiCall
    if (response.success) {
      return response.data
    } else {
      throw new ApiClientError(response.error || 'API call failed')
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

/**
 * 타입 안전한 API 호출 헬퍼
 */
export function createApiHook<T>(
  apiCall: () => Promise<ApiResponse<T>>
) {
  return async (): Promise<T> => {
    return extractData(apiCall())
  }
}