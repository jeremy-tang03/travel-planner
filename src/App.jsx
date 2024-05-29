import './App.css';
import '@mantine/core/styles.css';
import { useState } from 'react';
import { MantineProvider, Tabs } from '@mantine/core';
import MapReact from './components/MapReact';
import DrawerReact from './components/DrawerReact';
import Gantt from './components/Gantt';
import Welcome from './components/Welcome';

export default function App() {
  const [hasCode, setHasCode] = useState(false);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <MantineProvider>
      <div className="App">
        {!hasCode ? <Welcome setHasCode={setHasCode} setCode={setCode} /> :
          <>
            <DrawerReact />
            <Tabs variant="pills" value={activeTab} onChange={setActiveTab} >
              <Tabs.List style={{ 'marginLeft': '5.25em', 'zIndex': 999 }}>
                <Tabs.Tab value="calendar" style={{ 'paddingLeft': '1.5em', 'paddingRight': '2em', 'zIndex': 995 }}>Calendar</Tabs.Tab>
                <Tabs.Tab value="map" style={{ 'paddingLeft': '1.5em', 'paddingRight': '2em', 'zIndex': 995 }}>Map</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="calendar">
                <Gantt />
              </Tabs.Panel>
              <Tabs.Panel value="map">
                <MapReact pw={code} />
              </Tabs.Panel>
            </Tabs>
          </>}
      </div>
    </MantineProvider>
  );
}
