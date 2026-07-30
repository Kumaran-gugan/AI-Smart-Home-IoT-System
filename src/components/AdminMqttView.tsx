import React, { useState } from 'react';
import { 
  Settings2, 
  Cpu, 
  Wifi, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Terminal, 
  Container, 
  Users, 
  Radio, 
  Send,
  FileCode
} from 'lucide-react';
import { SmartDevice, UserProfile, MqttMessage } from '../types';

interface AdminMqttViewProps {
  devices: SmartDevice[];
  users: UserProfile[];
  darkMode: boolean;
  onAddDevice: (dev: Partial<SmartDevice>) => void;
  onDeleteDevice: (id: string) => void;
}

export const AdminMqttView: React.FC<AdminMqttViewProps> = ({
  devices,
  users,
  darkMode,
  onAddDevice,
  onDeleteDevice
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'devices' | 'mqtt' | 'esp32' | 'docker'>('devices');
  const [newDevName, setNewDevName] = useState('');
  const [newDevRoom, setNewDevRoom] = useState('Living Room');
  const [newDevWatts, setNewDevWatts] = useState(25);
  const [newDevTopic, setNewDevTopic] = useState('home/livingroom/custom_node');
  
  const [mqttPublishTopic, setMqttPublishTopic] = useState('home/livingroom/light/main');
  const [mqttPublishPayload, setMqttPublishPayload] = useState('{"state":"TOGGLE"}');
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleEsp32Code = `/* 
   ==================================================
   NEXUS AI SMART HOME - ESP32 / ARDUINO MQTT SKETCH
   ==================================================
*/

#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

const int RELAY_PIN = 18;
const int SENSOR_PIN = 34;

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Connected! IP: " + WiFi.localIP().toString());
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println("MQTT Received [" + String(topic) + "]: " + message);

  if (message.indexOf("ON") >= 0) {
    digitalWrite(RELAY_PIN, HIGH);
  } else if (message.indexOf("OFF") >= 0) {
    digitalWrite(RELAY_PIN, LOW);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT broker...");
    if (client.connect("ESP32_SmartHome_Client")) {
      Serial.println("Connected!");
      client.subscribe("home/+/+/set");
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read analog sensor and publish every 5 seconds
  static unsigned long lastMsg = 0;
  if (millis() - lastMsg > 5000) {
    lastMsg = millis();
    int sensorVal = analogRead(SENSOR_PIN);
    String payload = "{\\"sensor\\":\\"Temperature\\",\\"val\\":" + String(sensorVal/50.0) + "}";
    client.publish("home/telemetry/temperature", payload.c_str());
  }
}`;

  const sampleDockerfile = `# Dockerfile for Full-Stack AI Smart Home IoT System
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/server.cjs"]`;

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevName.trim()) return;
    onAddDevice({
      name: newDevName,
      room: newDevRoom,
      powerWatts: Number(newDevWatts),
      mqttTopic: newDevTopic
    });
    setNewDevName('');
  };

  const copyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Admin & IoT Hardware Center</h1>
        <p className="text-xs text-slate-400">Manage device nodes, inspect raw MQTT bus traffic, copy ESP32 C++ firmware, and build Docker containers</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700/50 pb-1">
        {[
          { id: 'devices', label: 'Manage Devices & Users', icon: Settings2 },
          { id: 'mqtt', label: 'MQTT Bus Inspector', icon: Radio },
          { id: 'esp32', label: 'ESP32 / Arduino C++ Code', icon: Cpu },
          { id: 'docker', label: 'Docker & Deployment', icon: Container },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : darkMode
                  ? 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Manage Devices */}
      {activeSubTab === 'devices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Device Form */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Add Custom IoT Node
            </h2>

            <form onSubmit={handleAddDeviceSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400">Node Name</label>
                <input
                  type="text"
                  value={newDevName}
                  onChange={(e) => setNewDevName(e.target.value)}
                  placeholder="e.g. Balcony UV Strip"
                  className="w-full mt-1 p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Target Room</label>
                <select
                  value={newDevRoom}
                  onChange={(e) => setNewDevRoom(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="Living Room">Living Room</option>
                  <option value="Master Bedroom">Master Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Garden">Garden</option>
                  <option value="Garage">Garage</option>
                  <option value="Balcony">Balcony</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Power Rating (Watts)</label>
                <input
                  type="number"
                  value={newDevWatts}
                  onChange={(e) => setNewDevWatts(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none font-mono focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">MQTT Channel Topic</label>
                <input
                  type="text"
                  value={newDevTopic}
                  onChange={(e) => setNewDevTopic(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none font-mono focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
              >
                Pair New Device Node
              </button>
            </form>
          </div>

          {/* Device List Table */}
          <div className={`lg:col-span-2 p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-base font-bold">Registered Hardware Devices ({devices.length})</h2>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {devices.map(d => (
                <div key={d.id} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-200">{d.name}</p>
                    <p className="text-[10px] text-slate-400">{d.room} • {d.powerWatts}W • <span className="font-mono text-cyan-400">{d.mqttTopic}</span></p>
                  </div>

                  <button
                    onClick={() => onDeleteDevice(d.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: MQTT Bus Inspector */}
      {activeSubTab === 'mqtt' && (
        <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                Live MQTT Pub-Sub Message Bus Log
              </h2>
              <p className="text-xs text-slate-400">Broker: broker.emqx.io:1883 • WebSocket SSL Port: 8084</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Bus Stream
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-400 space-y-2 max-h-80 overflow-y-auto border border-slate-800">
            {devices.map((d, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-900 pb-1">
                <span>[PUB-SUB] Topic: <span className="text-cyan-400">{d.mqttTopic}</span></span>
                <span className="text-amber-300">Payload: {JSON.stringify({ state: d.isOn ? 'ON' : 'OFF', watts: d.powerWatts })}</span>
                <span className="text-slate-600 text-[10px]">{d.lastUpdated}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: ESP32 C++ Code */}
      {activeSubTab === 'esp32' && (
        <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                ESP32 / Arduino C++ Firmware Template
              </h2>
              <p className="text-xs text-slate-400">Flash this code directly using Arduino IDE or PlatformIO</p>
            </div>

            <button
              onClick={() => copyCode(sampleEsp32Code)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-400 transition-all"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedCode ? 'Copied!' : 'Copy Sketch'}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800 max-h-96">
            {sampleEsp32Code}
          </pre>
        </div>
      )}

      {/* Tab 4: Docker Support */}
      {activeSubTab === 'docker' && (
        <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Container className="w-5 h-5 text-blue-400" />
                Production Dockerfile Deployment
              </h2>
              <p className="text-xs text-slate-400">Deploy containerized IoT server on Cloud Run, Render, or Docker Swarm</p>
            </div>

            <button
              onClick={() => copyCode(sampleDockerfile)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy Dockerfile
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-blue-300 font-mono text-xs overflow-x-auto border border-slate-800">
            {sampleDockerfile}
          </pre>
        </div>
      )}

    </div>
  );
};
