import '@mantine/core/styles.css';
import { useState, useEffect } from 'react';
import { MantineProvider, Tabs } from '@mantine/core';
import MapReact from './MapReact';
import DrawerReact from './DrawerReact';
import Gantt from './Gantt';
import Welcome from './Welcome';
import { getSheetsData } from '../helper';

export default function Home() {
  const [hasCode, setHasCode] = useState(false);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => { if (hasCode) setData(await getSheetsData(code)) })();
  }, [code, hasCode]);

  return (
    <MantineProvider>
      <div className="App">
        <Welcome setHasCode={setHasCode} setCode={setCode} />
        {!hasCode ? <></> :
          <>
            <DrawerReact data={data} />
            <Tabs variant="pills" value={activeTab} onChange={setActiveTab} >
              <Tabs.List style={{ 'marginLeft': '5.25em' }}>
                <Tabs.Tab value="calendar" style={{ 'paddingLeft': '1.5em', 'paddingRight': '2em', 'zIndex': 101 }}>Calendar</Tabs.Tab>
                <Tabs.Tab value="map" style={{ 'paddingLeft': '1.5em', 'paddingRight': '2em', 'zIndex': 101 }}>Map</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="calendar">
                <Gantt data={data} />
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
