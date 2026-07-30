import { SmartDevice, SensorReading, AutomationRule, SecurityCamera, SystemAlert, UserProfile, WeatherData } from './types';

export const INITIAL_DEVICES: SmartDevice[] = [
  { id: 'dev-1', name: 'Living Room Main Light', category: 'lighting', type: 'light', room: 'Living Room', isOn: true, powerWatts: 15, value: 85, color: '#ffb703', mqttTopic: 'home/livingroom/light/main', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-2', name: 'Master Bed Ambient Light', category: 'lighting', type: 'light', room: 'Master Bedroom', isOn: false, powerWatts: 12, value: 50, color: '#8ecae6', mqttTopic: 'home/bedroom/light/ambient', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-3', name: 'Garden RGB LED Strip', category: 'lighting', type: 'garden_light', room: 'Garden', isOn: true, powerWatts: 24, value: 100, color: '#2a9d8f', mqttTopic: 'home/garden/lights', lastUpdated: new Date().toLocaleTimeString() },
  
  { id: 'dev-4', name: 'Living Room Ceiling Fan', category: 'climate', type: 'fan', room: 'Living Room', isOn: true, powerWatts: 45, value: 3, mqttTopic: 'home/livingroom/fan/speed', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-5', name: 'Master Bed Smart AC', category: 'climate', type: 'ac', room: 'Master Bedroom', isOn: true, powerWatts: 1200, value: 23, mode: 'cool', mqttTopic: 'home/bedroom/ac/target', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-6', name: 'HEPA Air Purifier Pro', category: 'climate', type: 'air_purifier', room: 'Living Room', isOn: true, powerWatts: 35, value: 2, mode: 'auto', mqttTopic: 'home/livingroom/purifier', lastUpdated: new Date().toLocaleTimeString() },

  { id: 'dev-7', name: 'Smart Front Door Lock', category: 'security', type: 'door_lock', room: 'Entrance', isOn: true, powerWatts: 5, mqttTopic: 'home/security/doorlock/main', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-8', name: 'Smart Garage Roller Door', category: 'security', type: 'garage_door', room: 'Garage', isOn: false, powerWatts: 250, mqttTopic: 'home/garage/door', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-9', name: 'Main Security Siren & Alarm', category: 'security', type: 'alarm', room: 'Whole House', isOn: false, powerWatts: 10, mode: 'armed_away', mqttTopic: 'home/security/alarm/state', lastUpdated: new Date().toLocaleTimeString() },

  { id: 'dev-10', name: 'Automatic Water Pump', category: 'appliances', type: 'water_pump', room: 'Utility Yard', isOn: false, powerWatts: 750, mqttTopic: 'home/utility/waterpump', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-11', name: 'Espresso & Coffee Machine', category: 'appliances', type: 'coffee_machine', room: 'Kitchen', isOn: false, powerWatts: 1400, mode: 'espresso', mqttTopic: 'home/kitchen/coffeemaker', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-12', name: 'EV Charger Smart Plug', category: 'appliances', type: 'smart_plug', room: 'Garage', isOn: true, powerWatts: 3200, mqttTopic: 'home/garage/plug/ev', lastUpdated: new Date().toLocaleTimeString() },

  { id: 'dev-13', name: 'OLED Smart TV 65"', category: 'entertainment', type: 'tv', room: 'Living Room', isOn: true, powerWatts: 160, value: 28, mode: 'HDMI 1 (Apple TV)', mqttTopic: 'home/livingroom/tv', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-14', name: 'Hi-Fi Spatial Audio System', category: 'entertainment', type: 'music_system', room: 'Living Room', isOn: true, powerWatts: 80, value: 45, mode: 'Lofi Beats Chillout', mqttTopic: 'home/livingroom/audio', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-15', name: 'Motorized Sun Drapery', category: 'lighting', type: 'curtain', room: 'Living Room', isOn: true, powerWatts: 15, value: 70, mqttTopic: 'home/livingroom/curtain', lastUpdated: new Date().toLocaleTimeString() },
  { id: 'dev-16', name: 'Garden Lawn Sprinkler System', category: 'outdoors', type: 'sprinkler', room: 'Front Lawn', isOn: false, powerWatts: 40, mqttTopic: 'home/garden/sprinkler', lastUpdated: new Date().toLocaleTimeString() },
];

export const INITIAL_SENSORS: SensorReading[] = [
  { id: 'sens-1', name: 'Indoor Temperature', type: 'temperature', value: 24.5, unit: '°C', status: 'normal', location: 'Living Room', updatedAt: 'Just now', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 22 + Math.random()*4 })) },
  { id: 'sens-2', name: 'Indoor Humidity', type: 'humidity', value: 52, unit: '%', status: 'normal', location: 'Living Room', updatedAt: 'Just now', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 48 + Math.random()*8 })) },
  { id: 'sens-3', name: 'Kitchen Gas Level (LPG)', type: 'gas', value: 120, unit: 'PPM', status: 'normal', location: 'Kitchen', updatedAt: 'Just now', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 100 + Math.random()*30 })) },
  { id: 'sens-4', name: 'Smoke Detector', type: 'smoke', value: 15, unit: 'PPM', status: 'normal', location: 'Kitchen', updatedAt: 'Just now', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 10 + Math.random()*10 })) },
  { id: 'sens-5', name: 'Hallway Motion Sensor', type: 'motion', value: 1, unit: 'state', status: 'warning', location: 'Hallway', updatedAt: '2 mins ago', history: [] },
  { id: 'sens-6', name: 'Ambient Light Level', type: 'light', value: 450, unit: 'Lux', status: 'normal', location: 'Living Room', updatedAt: 'Just now', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 100 + Math.random()*600 })) },
  { id: 'sens-7', name: 'Water Tank Reservoir', type: 'water_level', value: 78, unit: '%', status: 'normal', location: 'Rooftop Tank', updatedAt: '5 mins ago', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 60 + Math.random()*35 })) },
  { id: 'sens-8', name: 'Garden Soil Moisture', type: 'soil_moisture', value: 34, unit: '%', status: 'warning', location: 'Front Garden', updatedAt: 'Just now', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 30 + Math.random()*20 })) },
  { id: 'sens-9', name: 'Air Quality Index (AQI)', type: 'air_quality', value: 28, unit: 'AQI', status: 'normal', location: 'Balcony', updatedAt: 'Just now', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 20 + Math.random()*20 })) },
  { id: 'sens-10', name: 'CO2 Concentration', type: 'co2', value: 580, unit: 'PPM', status: 'normal', location: 'Master Bed', updatedAt: 'Just now', history: Array.from({length: 12}, (_, i) => ({ time: `${i*2}:00`, value: 500 + Math.random()*150 })) },
  { id: 'sens-11', name: 'Rain Drop Sensor', type: 'rain', value: 0, unit: 'mm/h', status: 'normal', location: 'Roof Terrace', updatedAt: 'Just now', history: [] },
  { id: 'sens-12', name: 'Main Entry Door Contact', type: 'door', value: 0, unit: 'Closed', status: 'normal', location: 'Front Door', updatedAt: 'Just now', history: [] },
  { id: 'sens-13', name: 'Living Room Window Contact', type: 'window', value: 0, unit: 'Closed', status: 'normal', location: 'Living Room', updatedAt: 'Just now', history: [] },
  { id: 'sens-14', name: 'Flame / Fire Sensor', type: 'flame', value: 0, unit: 'IR', status: 'normal', location: 'Kitchen', updatedAt: 'Just now', history: [] },
  { id: 'sens-15', name: 'Proximity IR Sensor', type: 'ir', value: 12, unit: 'cm', status: 'normal', location: 'Garage Entrance', updatedAt: 'Just now', history: [] },
  { id: 'sens-16', name: 'Ultrasonic Tank Gauge', type: 'ultrasonic', value: 42, unit: 'cm', status: 'normal', location: 'Water Tank', updatedAt: 'Just now', history: [] },
];

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  { id: 'auto-1', name: 'Motion Lights Auto-On', enabled: true, sensorId: 'sens-5', sensorName: 'Hallway Motion Sensor', condition: '==', threshold: 1, targetDeviceId: 'dev-1', targetDeviceName: 'Living Room Main Light', action: 'turn_on', lastTriggered: '10 mins ago' },
  { id: 'auto-2', name: 'High Temp AC Cooling', enabled: true, sensorId: 'sens-1', sensorName: 'Indoor Temperature', condition: '>', threshold: 28, targetDeviceId: 'dev-5', targetDeviceName: 'Master Bed Smart AC', action: 'turn_on', actionValue: 22, lastTriggered: 'Yesterday' },
  { id: 'auto-3', name: 'Gas Leak Emergency Shutdown', enabled: true, sensorId: 'sens-3', sensorName: 'Kitchen Gas Level (LPG)', condition: '>', threshold: 300, targetDeviceId: 'dev-9', targetDeviceName: 'Main Security Siren & Alarm', action: 'trigger_alarm', lastTriggered: 'Never' },
  { id: 'auto-4', name: 'Auto Garden Irrigation', enabled: true, sensorId: 'sens-8', sensorName: 'Garden Soil Moisture', condition: '<', threshold: 25, targetDeviceId: 'dev-16', targetDeviceName: 'Garden Lawn Sprinkler System', action: 'turn_on', lastTriggered: '3 hours ago' },
  { id: 'auto-5', name: 'Rain Window Protection', enabled: true, sensorId: 'sens-11', sensorName: 'Rain Drop Sensor', condition: '>', threshold: 1, targetDeviceId: 'dev-15', targetDeviceName: 'Motorized Sun Drapery', action: 'turn_off', lastTriggered: '2 days ago' },
];

export const INITIAL_CAMERAS: SecurityCamera[] = [
  { id: 'cam-1', name: 'Front Porch & Entrance', location: 'Front Yard', status: 'online', motionDetected: false, recording: true, streamUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80' },
  { id: 'cam-2', name: 'Living Room Interior', location: 'Living Room', status: 'online', motionDetected: true, recording: true, streamUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'cam-3', name: 'Backyard & Patio', location: 'Backyard', status: 'online', motionDetected: false, recording: true, streamUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
  { id: 'cam-4', name: 'Garage Driveway', location: 'Garage', status: 'online', motionDetected: false, recording: false, streamUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80' },
];

export const INITIAL_ALERTS: SystemAlert[] = [
  { id: 'alt-1', title: 'Motion Detected in Hallway', message: 'Hallway motion sensor registered activity while home mode was set to Away.', severity: 'warning', timestamp: '10:14 AM', read: false, source: 'Hallway Motion Sensor' },
  { id: 'alt-2', title: 'Soil Moisture Low', message: 'Front garden soil moisture dropped below 35%. Sprinklers scheduled.', severity: 'info', timestamp: '08:30 AM', read: true, source: 'Soil Sensor' },
  { id: 'alt-3', title: 'EV Charging Completed', message: 'Garage EV Smart Plug completed 100% vehicle charge cycle (24.2 kWh).', severity: 'info', timestamp: '06:15 AM', read: true, source: 'EV Smart Plug' },
];

export const INITIAL_WEATHER: WeatherData = {
  city: 'San Francisco, CA',
  tempC: 22,
  condition: 'Partly Cloudy',
  humidity: 58,
  windKmH: 14,
  rainProbability: 10,
  uvIndex: 5,
  airQuality: 'Good (AQI 28)',
  forecast: [
    { day: 'Mon', tempC: 22, condition: 'Sunny' },
    { day: 'Tue', tempC: 24, condition: 'Clear Sky' },
    { day: 'Wed', tempC: 20, condition: 'Rain Showers' },
    { day: 'Thu', tempC: 21, condition: 'Partly Cloudy' },
    { day: 'Fri', tempC: 25, condition: 'Sunny' },
  ]
};

export const MOCK_USERS: UserProfile[] = [
  { id: 'usr-1', name: 'Alex Rivera', email: 'alex@smarthome.io', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', pinAuthEnabled: true, biometricAuthEnabled: true },
  { id: 'usr-2', name: 'Sarah Rivera', email: 'sarah@smarthome.io', role: 'family', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', pinAuthEnabled: true, biometricAuthEnabled: false },
  { id: 'usr-3', name: 'Guest Access (Housekeeper)', email: 'guest@smarthome.io', role: 'guest', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', pinAuthEnabled: false, biometricAuthEnabled: false },
];
