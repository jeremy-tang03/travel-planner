import '@mantine/core/styles.css';
import { useState, useEffect } from 'react';
import { Tabs } from '@mantine/core';
import MapReact from './MapReact';
import DrawerReact from './DrawerReact';
import Gantt from './Gantt';
import Welcome from './Welcome';
import { getSheetsData } from '../helper';
import { default as Calendar } from './Calendar';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WS_URL = 'ws://127.0.0.1:3001';

export default function Home() {
  const [hasCode, setHasCode] = useState(false);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');
  const [data, setData] = useState(null);
  const [isPC, setIsPC] = useState(true);
  const [mousePos, setMousePos] = useState({ 'x': 0, 'y': 0 });
  const [username, setUsername] = useState('');
  
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true
  });

  useEffect(() => {
    if (username && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username,
        type: 'userevent'
      });
    }
  }, [username, sendJsonMessage, readyState]);

  useEffect(() => {
    if (window.innerWidth > 768) setIsPC(true);
    else setIsPC(false);
  }, [])

  useEffect(() => {
    (async () => { if (hasCode) setData(await getSheetsData(code)) })();
  }, [code, hasCode]);

  const handleClick = (e) => {
    setMousePos({ 'x': e.clientX, 'y': e.clientY });
  }

  return (
    <>
      <Welcome setHasCode={setHasCode} setCode={setCode} setUsername={setUsername} />
      {!hasCode ? <></> :
        <>
          <DrawerReact data={data} isPC={isPC} />
          <Tabs variant="pills" value={activeTab} onChange={setActiveTab} >
            <Tabs.List style={{ 'marginLeft': '5.25em' }}>
              <Tabs.Tab value="calendar" style={{ 'paddingLeft': '1.5em', 'paddingRight': '2em', 'zIndex': 101 }}>Calendar</Tabs.Tab>
              <Tabs.Tab value="map" style={{ 'paddingLeft': '1.5em', 'paddingRight': '2em', 'zIndex': 101 }}>Map</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="calendar">
              {/* <Gantt data={data} isPC={isPC} /> */}
              <div
                style={{ 'height': '94vh', 'padding': '0.2em 0.7em 0.4em 0.7em', 'marginTop': '0.2em', 'overflow': 'auto' }}
                onClick={handleClick}
              >
                <Calendar pw={code} data={data} mousePos={mousePos} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="map">
              <MapReact pw={code} data={data} isPC={isPC} />
            </Tabs.Panel>
          </Tabs>
        </>}
    </>
  );
}
