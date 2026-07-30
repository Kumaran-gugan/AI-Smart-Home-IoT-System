import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DeviceControlView } from './components/DeviceControlView';
import { SensorsView } from './components/SensorsView';
import { EnergyView } from './components/EnergyView';
import { AutomationsView } from './components/AutomationsView';
import { SecurityView } from './components/SecurityView';
import { GeminiAiView } from './components/GeminiAiView';
import { VoiceControlView } from './components/VoiceControlView';
import { WeatherView } from './components/WeatherView';
import { ReportsView } from './components/ReportsView';
import { AdminMqttView } from './components/AdminMqttView';
import { SosModal } from './components/SosModal';

import { 
  INITIAL_DEVICES, 
  INITIAL_SENSORS, 
  INITIAL_AUTOMATIONS, 
  INITIAL_ALERTS, 
  INITIAL_CAMERAS, 
  INITIAL_WEATHER, 
  MOCK_USERS 
} from './mockData';
import { SmartDevice, SensorReading, AutomationRule, SystemAlert, UserProfile, WeatherData } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeUser, setActiveUser] = useState<UserProfile>(MOCK_USERS[0]);

  const [devices, setDevices] = useState<SmartDevice[]>(INITIAL_DEVICES);
  const [sensors, setSensors] = useState<SensorReading[]>(INITIAL_SENSORS);
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  
  const [sosModalOpen, setSosModalOpen] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');

  // Fetch initial telemetry from backend server
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000); // Polling telemetry updates
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [devRes, sensRes, autoRes, altRes] = await Promise.all([
        fetch('/api/devices'),
        fetch('/api/sensors'),
        fetch('/api/automations'),
        fetch('/api/alerts')
      ]);

      if (devRes.ok) { const d = await devRes.json(); setDevices(d.devices); }
      if (sensRes.ok) { const s = await sensRes.json(); setSensors(s.sensors); }
      if (autoRes.ok) { const a = await autoRes.json(); setAutomations(a.automations); }
      if (altRes.ok) { const al = await altRes.json(); setAlerts(al.alerts); }
    } catch (e) {
      console.log('Using initial client data offline');
    }
  };

  const handleToggleDevice = async (id: string) => {
    // Optimistic UI update
    setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: !d.isOn, lastUpdated: new Date().toLocaleTimeString() } : d));
    try {
      await fetch(`/api/devices/${id}/toggle`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetDevice = async (id: string, updates: Partial<SmartDevice>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates, lastUpdated: new Date().toLocaleTimeString() } : d));
    try {
      await fetch(`/api/devices/${id}/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDevice = async (devData: Partial<SmartDevice>) => {
    try {
      const res = await fetch('/api/devices/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(devData)
      });
      const data = await res.json();
      if (data.success) {
        setDevices(prev => [...prev, data.device]);
      }
    } catch (e) {
      const newDev: SmartDevice = {
        id: `dev-${Date.now()}`,
        name: devData.name || 'New Device',
        category: devData.category || 'appliances',
        type: 'smart_plug',
        room: devData.room || 'Living Room',
        isOn: false,
        powerWatts: devData.powerWatts || 25,
        mqttTopic: devData.mqttTopic || 'home/custom',
        lastUpdated: new Date().toLocaleTimeString()
      };
      setDevices(prev => [...prev, newDev]);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    try {
      await fetch(`/api/devices/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAutomation = async (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    try {
      await fetch(`/api/automations/${id}/toggle`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAutomation = async (ruleData: Partial<AutomationRule>) => {
    try {
      const res = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
      });
      const data = await res.json();
      if (data.success) {
        setAutomations(prev => [...prev, data.rule]);
      }
    } catch (e) {
      const rule: AutomationRule = {
        id: `auto-${Date.now()}`,
        name: ruleData.name || 'New Custom Rule',
        enabled: true,
        sensorId: ruleData.sensorId || '',
        sensorName: ruleData.sensorName || 'Sensor',
        condition: ruleData.condition || '>',
        threshold: ruleData.threshold || 25,
        targetDeviceId: ruleData.targetDeviceId || '',
        targetDeviceName: ruleData.targetDeviceName || 'Device',
        action: ruleData.action || 'turn_on'
      };
      setAutomations(prev => [...prev, rule]);
    }
  };

  const handleDeleteAutomation = async (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    try {
      await fetch(`/api/automations/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setActiveTab('gemini');
  };

  const handleSosLockdown = () => {
    // Lock all door locks and turn off non-essential devices
    setDevices(prev => prev.map(d => {
      if (d.type === 'door_lock') return { ...d, isOn: true };
      if (d.type === 'alarm') return { ...d, isOn: true };
      return d;
    }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${
      darkMode ? 'bg-[#020617] text-slate-200' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeUser={activeUser}
        users={MOCK_USERS}
        setActiveUser={setActiveUser}
        alerts={alerts}
        weather={weather}
        onTriggerSos={() => setSosModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container: Sidebar + View Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
        />

        {/* View Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {activeTab === 'dashboard' && (
            <DashboardView
              devices={devices}
              sensors={sensors}
              alerts={alerts}
              weather={weather}
              darkMode={darkMode}
              onToggleDevice={handleToggleDevice}
              onNavigateTab={setActiveTab}
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === 'devices' && (
            <DeviceControlView
              devices={devices}
              darkMode={darkMode}
              onToggleDevice={handleToggleDevice}
              onSetDevice={handleSetDevice}
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === 'sensors' && (
            <SensorsView
              sensors={sensors}
              darkMode={darkMode}
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === 'energy' && (
            <EnergyView
              devices={devices}
              darkMode={darkMode}
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === 'automations' && (
            <AutomationsView
              automations={automations}
              devices={devices}
              sensors={sensors}
              darkMode={darkMode}
              onToggleAutomation={handleToggleAutomation}
              onCreateAutomation={handleCreateAutomation}
              onDeleteAutomation={handleDeleteAutomation}
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === 'security' && (
            <SecurityView
              cameras={INITIAL_CAMERAS}
              devices={devices}
              darkMode={darkMode}
              onToggleDevice={handleToggleDevice}
              onTriggerSos={() => setSosModalOpen(true)}
            />
          )}

          {activeTab === 'gemini' && (
            <GeminiAiView
              darkMode={darkMode}
              initialPrompt={aiInitialPrompt}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceControlView
              devices={devices}
              darkMode={darkMode}
              onToggleDevice={handleToggleDevice}
              onSetDevice={handleSetDevice}
            />
          )}

          {activeTab === 'weather' && (
            <WeatherView
              weather={weather}
              devices={devices}
              darkMode={darkMode}
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              devices={devices}
              sensors={sensors}
              darkMode={darkMode}
              onOpenAiWithPrompt={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === 'admin' && (
            <AdminMqttView
              devices={devices}
              users={MOCK_USERS}
              darkMode={darkMode}
              onAddDevice={handleAddDevice}
              onDeleteDevice={handleDeleteDevice}
            />
          )}
        </main>

      </div>

      {/* Emergency SOS Modal */}
      <SosModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        onLockAll={handleSosLockdown}
        onSoundSiren={() => {
          const alarm = devices.find(d => d.type === 'alarm');
          if (alarm) handleToggleDevice(alarm.id);
        }}
      />

    </div>
  );
}
