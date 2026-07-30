export type DeviceCategory = 'lighting' | 'climate' | 'security' | 'appliances' | 'entertainment' | 'outdoors';

export interface SmartDevice {
  id: string;
  name: string;
  category: DeviceCategory;
  type: 'light' | 'fan' | 'ac' | 'door_lock' | 'garage_door' | 'curtain' | 'water_pump' | 'smart_plug' | 'garden_light' | 'tv' | 'music_system' | 'coffee_machine' | 'air_purifier' | 'alarm' | 'sprinkler';
  room: string;
  isOn: boolean;
  powerWatts: number; // Consumption when active
  value?: number; // e.g. brightness (0-100), fan speed (1-5), AC temp (16-30°C), volume (0-100)
  mode?: string; // e.g. AC mode ('cool'|'heat'|'fan'|'auto'), TV source, Coffee recipe
  color?: string; // for RGB lights
  mqttTopic: string;
  lastUpdated: string;
}

export interface SensorReading {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'gas' | 'smoke' | 'motion' | 'ir' | 'ultrasonic' | 'light' | 'water_level' | 'soil_moisture' | 'flame' | 'door' | 'window' | 'rain' | 'air_quality' | 'co2';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  location: string;
  history: { time: string; value: number }[];
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  sensorId: string;
  sensorName: string;
  condition: '>' | '<' | '==' | '!=';
  threshold: number;
  targetDeviceId: string;
  targetDeviceName: string;
  action: 'turn_on' | 'turn_off' | 'set_value' | 'trigger_alarm' | 'notify';
  actionValue?: number | string;
  lastTriggered?: string;
}

export interface EnergyData {
  time: string;
  kwh: number;
  cost: number;
  solarGenerated?: number;
}

export interface SecurityCamera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  motionDetected: boolean;
  recording: boolean;
  streamUrl?: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: string;
  read: boolean;
  source: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'family' | 'guest';
  avatar: string;
  pinAuthEnabled: boolean;
  biometricAuthEnabled: boolean;
}

export interface WeatherData {
  city: string;
  tempC: number;
  condition: string;
  humidity: number;
  windKmH: number;
  rainProbability: number;
  uvIndex: number;
  airQuality: string;
  forecast: { day: string; tempC: number; condition: string }[];
}

export interface MqttMessage {
  id: string;
  topic: string;
  payload: string;
  qos: number;
  retain: boolean;
  timestamp: string;
  direction: 'inbound' | 'outbound';
}
