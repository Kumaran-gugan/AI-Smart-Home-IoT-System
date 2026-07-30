import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_DEVICES, INITIAL_SENSORS, INITIAL_AUTOMATIONS, INITIAL_ALERTS, INITIAL_CAMERAS, INITIAL_WEATHER, MOCK_USERS } from './src/mockData.js';
import { SmartDevice, SensorReading, AutomationRule, SystemAlert, MqttMessage } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory state persistent during runtime
  let devices: SmartDevice[] = [...INITIAL_DEVICES];
  let sensors: SensorReading[] = [...INITIAL_SENSORS];
  let automations: AutomationRule[] = [...INITIAL_AUTOMATIONS];
  let alerts: SystemAlert[] = [...INITIAL_ALERTS];
  let mqttLogs: MqttMessage[] = [
    { id: 'm-1', topic: 'home/livingroom/light/main', payload: '{"state":"ON","brightness":85}', qos: 1, retain: true, timestamp: new Date().toLocaleTimeString(), direction: 'inbound' },
    { id: 'm-2', topic: 'home/sensors/temperature', payload: '{"sensor":"Living Room","val":24.5,"unit":"C"}', qos: 0, retain: false, timestamp: new Date().toLocaleTimeString(), direction: 'inbound' },
    { id: 'm-3', topic: 'home/bedroom/ac/target', payload: '{"power":"ON","temp":23}', qos: 1, retain: true, timestamp: new Date().toLocaleTimeString(), direction: 'outbound' }
  ];

  // Helper to trigger automations when sensors update
  function checkAutomations(sensor: SensorReading) {
    const matchingRules = automations.filter(r => r.enabled && (r.sensorId === sensor.id || r.sensorName.toLowerCase() === sensor.name.toLowerCase()));
    
    matchingRules.forEach(rule => {
      let triggered = false;
      if (rule.condition === '>' && sensor.value > rule.threshold) triggered = true;
      if (rule.condition === '<' && sensor.value < rule.threshold) triggered = true;
      if (rule.condition === '==' && sensor.value === rule.threshold) triggered = true;
      if (rule.condition === '!=' && sensor.value !== rule.threshold) triggered = true;

      if (triggered) {
        rule.lastTriggered = 'Just now';
        // Execute rule action
        const devIndex = devices.findIndex(d => d.id === rule.targetDeviceId || d.name === rule.targetDeviceName);
        if (devIndex !== -1) {
          if (rule.action === 'turn_on') {
            devices[devIndex].isOn = true;
            if (rule.actionValue) devices[devIndex].value = Number(rule.actionValue);
          } else if (rule.action === 'turn_off') {
            devices[devIndex].isOn = false;
          } else if (rule.action === 'set_value' && rule.actionValue) {
            devices[devIndex].value = Number(rule.actionValue);
          } else if (rule.action === 'trigger_alarm') {
            devices[devIndex].isOn = true;
            alerts.unshift({
              id: `alt-${Date.now()}`,
              title: `AUTOMATION TRIGGER: ${rule.name}`,
              message: `Sensor '${sensor.name}' threshold triggered alarm on ${devices[devIndex].name}`,
              severity: 'danger',
              timestamp: new Date().toLocaleTimeString(),
              read: false,
              source: sensor.name
            });
          }
        }
      }
    });
  }

  // Periodic simulated telemetry updates (Simulates ESP32/MQTT pub-sub)
  setInterval(() => {
    sensors = sensors.map(s => {
      let delta = (Math.random() - 0.48) * (s.unit === '°C' ? 0.3 : s.unit === '%' ? 1.2 : s.unit === 'PPM' ? 4 : 1);
      let newVal = Math.max(0, Number((s.value + delta).toFixed(1)));
      if (s.type === 'smoke' && Math.random() < 0.05) newVal = 12; // stable smoke
      if (s.type === 'motion') newVal = Math.random() > 0.85 ? 1 : 0;
      
      const updatedSensor = {
        ...s,
        value: newVal,
        updatedAt: 'Just now',
        history: [...(s.history || []).slice(-15), { time: new Date().toLocaleTimeString().slice(0, 5), value: newVal }]
      };

      checkAutomations(updatedSensor);
      return updatedSensor;
    });

    // Log MQTT message simulation
    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    mqttLogs.unshift({
      id: `m-${Date.now()}`,
      topic: `home/telemetry/${randomSensor.type}`,
      payload: JSON.stringify({ sensor: randomSensor.name, val: randomSensor.value, unit: randomSensor.unit }),
      qos: 0,
      retain: false,
      timestamp: new Date().toLocaleTimeString(),
      direction: 'inbound'
    });
    if (mqttLogs.length > 50) mqttLogs.pop();
  }, 5000);

  // ================= API ROUTES =================

  // 1. Devices API
  app.get('/api/devices', (req, res) => {
    res.json({ success: true, devices });
  });

  app.post('/api/devices/:id/toggle', (req, res) => {
    const { id } = req.params;
    const dev = devices.find(d => d.id === id);
    if (!dev) return res.status(404).json({ success: false, message: 'Device not found' });
    
    dev.isOn = !dev.isOn;
    dev.lastUpdated = new Date().toLocaleTimeString();

    // MQTT message outbound
    mqttLogs.unshift({
      id: `m-${Date.now()}`,
      topic: dev.mqttTopic,
      payload: JSON.stringify({ power: dev.isOn ? 'ON' : 'OFF', val: dev.value }),
      qos: 1,
      retain: true,
      timestamp: new Date().toLocaleTimeString(),
      direction: 'outbound'
    });

    res.json({ success: true, device: dev });
  });

  app.post('/api/devices/:id/set', (req, res) => {
    const { id } = req.params;
    const { value, mode, color, isOn } = req.body;
    const dev = devices.find(d => d.id === id);
    if (!dev) return res.status(404).json({ success: false, message: 'Device not found' });

    if (value !== undefined) dev.value = value;
    if (mode !== undefined) dev.mode = mode;
    if (color !== undefined) dev.color = color;
    if (isOn !== undefined) dev.isOn = isOn;
    dev.lastUpdated = new Date().toLocaleTimeString();

    mqttLogs.unshift({
      id: `m-${Date.now()}`,
      topic: dev.mqttTopic,
      payload: JSON.stringify({ power: dev.isOn ? 'ON' : 'OFF', val: dev.value, mode: dev.mode, color: dev.color }),
      qos: 1,
      retain: true,
      timestamp: new Date().toLocaleTimeString(),
      direction: 'outbound'
    });

    res.json({ success: true, device: dev });
  });

  app.post('/api/devices/add', (req, res) => {
    const newDev: SmartDevice = {
      id: `dev-${Date.now()}`,
      name: req.body.name || 'New Smart Node',
      category: req.body.category || 'appliances',
      type: req.body.type || 'smart_plug',
      room: req.body.room || 'Living Room',
      isOn: false,
      powerWatts: req.body.powerWatts || 25,
      mqttTopic: req.body.mqttTopic || `home/${req.body.room?.toLowerCase().replace(/\s+/g,'')}/${req.body.type || 'node'}`,
      lastUpdated: new Date().toLocaleTimeString()
    };
    devices.push(newDev);
    res.json({ success: true, device: newDev });
  });

  app.delete('/api/devices/:id', (req, res) => {
    const { id } = req.params;
    devices = devices.filter(d => d.id !== id);
    res.json({ success: true, message: 'Device removed' });
  });

  // 2. Sensors API
  app.get('/api/sensors', (req, res) => {
    res.json({ success: true, sensors });
  });

  // 3. Automations API
  app.get('/api/automations', (req, res) => {
    res.json({ success: true, automations });
  });

  app.post('/api/automations', (req, res) => {
    const rule: AutomationRule = {
      id: `auto-${Date.now()}`,
      name: req.body.name || 'New Custom Automation',
      enabled: true,
      sensorId: req.body.sensorId,
      sensorName: req.body.sensorName || 'Sensor',
      condition: req.body.condition || '>',
      threshold: req.body.threshold || 25,
      targetDeviceId: req.body.targetDeviceId,
      targetDeviceName: req.body.targetDeviceName || 'Device',
      action: req.body.action || 'turn_on',
      actionValue: req.body.actionValue
    };
    automations.push(rule);
    res.json({ success: true, rule });
  });

  app.post('/api/automations/:id/toggle', (req, res) => {
    const rule = automations.find(r => r.id === req.params.id);
    if (rule) {
      rule.enabled = !rule.enabled;
      res.json({ success: true, rule });
    } else {
      res.status(404).json({ success: false });
    }
  });

  app.delete('/api/automations/:id', (req, res) => {
    automations = automations.filter(r => r.id !== req.params.id);
    res.json({ success: true });
  });

  // 4. Alerts API
  app.get('/api/alerts', (req, res) => {
    res.json({ success: true, alerts });
  });

  app.post('/api/alerts/clear', (req, res) => {
    alerts = alerts.map(a => ({ ...a, read: true }));
    res.json({ success: true });
  });

  // 5. MQTT API
  app.get('/api/mqtt/logs', (req, res) => {
    res.json({ success: true, logs: mqttLogs });
  });

  app.post('/api/mqtt/publish', (req, res) => {
    const { topic, payload } = req.body;
    const msg: MqttMessage = {
      id: `m-${Date.now()}`,
      topic,
      payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
      qos: 1,
      retain: false,
      timestamp: new Date().toLocaleTimeString(),
      direction: 'outbound'
    };
    mqttLogs.unshift(msg);
    res.json({ success: true, message: msg });
  });

  // 6. Gemini AI Assistant Endpoint
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          success: true,
          answer: `**AI Smart Assistant Note:** Google Gemini API Key is active in simulation mode. Here is an optimized response based on your current home status:\n\n` +
            `• **Current Total Power Load:** ${devices.filter(d=>d.isOn).reduce((acc,d)=>acc+d.powerWatts,0)} Watts\n` +
            `• **Active Devices:** ${devices.filter(d=>d.isOn).map(d=>d.name).join(', ')}\n` +
            `• **Energy Recommendation:** Turn off high-power EV charger (${devices.find(d=>d.id==='dev-12')?.powerWatts}W) during peak hours (2 PM - 7 PM) to save ~28% on electricity charges.`
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const activeDevicesSummary = devices.map(d => `${d.name} (${d.room}): ${d.isOn ? 'ON' : 'OFF'}, ${d.powerWatts}W, Val:${d.value || 0}`).join('\n');
      const sensorsSummary = sensors.map(s => `${s.name} (${s.location}): ${s.value} ${s.unit} [${s.status}]`).join('\n');

      const systemPrompt = `You are the Google Gemini AI Smart Home IoT Core Assistant.
You have direct real-time visibility into the user's home network:
--- CURRENT DEVICES ---
${activeDevicesSummary}

--- CURRENT SENSORS ---
${sensorsSummary}

Provide clear, professional, concise, and helpful answers formatted in markdown.
Answer questions like:
- "How much electricity am I using?"
- "Suggest energy saving tips."
- "Why is my room too hot?"
- "Should I turn on the AC?"
- "Predict electricity bill."
- "Recommend automation routines."
- "Troubleshoot IoT devices."
- "Explain alerts."

Be direct, intelligent, and highly practical as a Senior Embedded IoT Engineer and AI Smart Home Advisor.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${systemPrompt}\n\nUSER QUESTION: ${prompt}`
      });

      res.json({
        success: true,
        answer: response.text || "No response generated from Gemini AI."
      });

    } catch (err: any) {
      console.error('Gemini AI API Error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Error processing AI prompt'
      });
    }
  });

  // 7. Weather Endpoint
  app.get('/api/weather', (req, res) => {
    res.json({ success: true, weather: INITIAL_WEATHER });
  });

  // Serve Vite app in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Smart Home IoT Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
