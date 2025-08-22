/**
 * EMS API Client
 * EMS 백엔드 API와 통신하는 클라이언트
 */

// 환경변수에서 API 베이스 URL 가져오기
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * API 에러 클래스
 */
export class EmsApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'EmsApiError'
  }
}

/**
 * 타입 정의
 */
export interface Location {
  id: number
  name: string
  description?: string
}

export interface Sensor {
  id: number
  sensorName: string
  type: string
  location: Location
}

export interface Measurement {
  id: number
  sensor: Sensor
  value: number
  measuredAt: string
}

export interface SensorCreateRequest {
  sensorName: string
  type: string
  locationId: number
}

export interface MeasurementCreateRequest {
  sensorId: number
  value: number
  measuredAt?: string
}

export interface DailyAverage {
  sensorId: number
  day: string
  avgValue: number
}

/**
 * HTTP 요청 헬퍼
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
      
      throw new EmsApiError(
        errorMessage,
        response.status,
        response.status.toString()
      )
    }

    // 204 No Content인 경우 빈 응답 반환
    if (response.status === 204) {
      return {} as T
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof EmsApiError) {
      throw error
    }
    
    // 네트워크 에러 등
    throw new EmsApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    )
  }
}

/**
 * EMS API Client 객체
 */
export const emsApiClient = {
  // Sensor APIs
  sensors: {
    // 모든 센서 조회
    getAll: () => request<Sensor[]>('/api/sensors'),

    // 특정 센서 조회
    getById: (id: number) => request<Sensor>(`/api/sensors/${id}`),

    // 센서 생성
    create: (sensor: SensorCreateRequest) =>
      request<Sensor>('/api/sensors', {
        method: 'POST',
        body: JSON.stringify(sensor),
      }),

    // 센서 수정
    update: (id: number, sensor: SensorCreateRequest) =>
      request<Sensor>(`/api/sensors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sensor),
      }),

    // 센서 삭제
    delete: (id: number) =>
      request<void>(`/api/sensors/${id}`, {
        method: 'DELETE',
      }),
  },

  // Measurement APIs
  measurements: {
    // 기간별 측정값 조회
    getByDateRange: (params: {
      from: string // YYYY-MM-DD
      to: string // YYYY-MM-DD
    }) => {
      const searchParams = new URLSearchParams({
        from: params.from,
        to: params.to,
      })
      
      return request<Measurement[]>(`/api/measurements?${searchParams.toString()}`)
    },

    // 측정값 생성
    create: (measurement: MeasurementCreateRequest) =>
      request<Measurement>('/api/measurements', {
        method: 'POST',
        body: JSON.stringify(measurement),
      }),
  },

  // Metrics APIs
  metrics: {
    // 일일 평균 조회
    getDailyAverage: (params: {
      from: string // YYYY-MM-DD
      to: string // YYYY-MM-DD
    }) => {
      const searchParams = new URLSearchParams({
        from: params.from,
        to: params.to,
      })
      
      return request<DailyAverage[]>(`/api/metrics/daily-average?${searchParams.toString()}`)
    },
  },
}
