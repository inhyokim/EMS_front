/**
 * EMS Frontend Types
 * 백엔드 API와 일치하는 타입 정의
 */

// Device 타입
export interface Device {
  id: number
  name: string
  type: string
  location?: string
  active?: boolean
  createdAt?: string
}

// EnergyReading 타입
export interface EnergyReading {
  id: number
  deviceId: number
  deviceName?: string
  ts: string // ISO-8601 형식
  kwh: number
}

// API Response 타입
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// API 요청/응답 타입들
export interface DeviceCreateRequest {
  name: string
  type: string
  location?: string
  active?: boolean
}

export interface EnergyReadingCreateRequest {
  deviceId: number
  ts?: string
  kwh: number
}

// 테이블 관련 타입
export interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
}

// 에러 타입
export interface ApiError {
  message: string
  code?: string
  details?: string
}

// 로딩 상태 타입
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// 장치 타입 열거형
export const DEVICE_TYPES = {
  METER: 'METER',
  SENSOR: 'SENSOR',
  CONTROLLER: 'CONTROLLER',
  MONITOR: 'MONITOR',
} as const

export type DeviceType = typeof DEVICE_TYPES[keyof typeof DEVICE_TYPES]