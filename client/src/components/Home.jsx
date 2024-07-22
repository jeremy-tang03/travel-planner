import { useState, useEffect } from 'react';
import { Tabs, Flex } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Avatar from 'react-avatar';
import MapReact from './MapReact';
import DrawerReact from './DrawerReact';
import Gantt from './Gantt';
import Welcome from './Welcome';
import { getSheetsData, importEvents } from '../helper';
import { default as Calendar } from './Calendar';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WS_URL = 'ws://127.0.0.1:3001';
function isUserEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'userevent';
}

function isDocumentEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'contentchange';
}

function Users() {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isUserEvent
  });
  const users = Object.values(lastJsonMessage?.data.users || {});
  let usernames = [];
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      usernames.push(users[i].username);
    }
  }
  const avatars = usernames.map((name) => <Avatar name={name} size="37" round={true} style={{ 'marginLeft': '3.5px' }} />);
  return <Flex
    justify="flex-start"
    align="center"
    direction="row-reverse"
    wrap="wrap"
    style={{ position: 'absolute', top: '1px', right: '90px' }}>
    {avatars ? avatars : <></>}
  </Flex>
}

export default function Home() {
  const [hasCode, setHasCode] = useState(false);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');
  const [data, setData] = useState(null);
  const [isPC, setIsPC] = useState(true);
  const [mousePos, setMousePos] = useState({ 'x': 0, 'y': 0 });
  const [username, setUsername] = useState('');
  const [editedEvents, setEditedEvents] = useState(null);

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

  const lastJsonMessageUser = useWebSocket(WS_URL, {
    share: true,
    filter: isUserEvent
  }).lastJsonMessage;

  useEffect(() => {
    const activities = lastJsonMessageUser?.data.userActivity || [];
    if (activities.length > 0) {
      let message = activities[activities.length - 1];
      notifications.show({
        withBorder: true,
        message,
        autoClose: 3000
      })
    }
  }, [lastJsonMessageUser]);

  const { lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isDocumentEvent
  });

  useEffect(() => {
    let events = lastJsonMessage?.data.editorContent || undefined;
    if (events) {
      events === [] ? setEditedEvents([]) :
        setEditedEvents(importEvents(JSON.parse(events)));
    }
  }, [lastJsonMessage]);

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
              <Users />
              <div
                style={{ 'height': '94vh', 'padding': '0.2em 0.7em 0.4em 0.7em', 'marginTop': '0.2em', 'overflow': 'auto' }}
                onClick={handleClick}
              >
                <Calendar pw={code} data={data} mousePos={mousePos} sendJsonMessage={sendJsonMessage} editedEvents={editedEvents} />
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
