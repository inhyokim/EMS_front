export type Id = number;

export interface Location {
  id: Id;
  name: string;
  description?: string | null;
}

export interface Sensor {
  id: Id;
  sensorName: string;
  type: string;       // "POWER" | "TEMP" | ...
  location: Location; // when returned from backend list/get
  locationId?: Id;    // for create/update payload convenience
}

export interface SensorCreateDto {
  sensorName: string;
  type: string;
  locationId: Id;
}

export interface SensorUpdateDto extends SensorCreateDto {}

export interface MeasurementCreateDto {
  sensorId: Id;
  value: number;      // backend BigDecimal-compatible
  measuredAt?: string; // ISO-8601 (optional)
}

export interface Measurement {
  id: Id;
  sensor: Sensor;
  value: number;
  measuredAt: string; // ISO-8601
}

export interface DailyAverageRow {
  sensorId: Id;
  day: string;       // "2025-08-21 00:00:00+00" from SQL; treat as string
  avgValue: number;
}
