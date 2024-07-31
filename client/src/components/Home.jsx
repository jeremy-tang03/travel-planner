import { useState, useEffect, useContext } from 'react';
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
import { UserContext } from '../UserProvider';
import { DataContext } from '../DataProvider';

const loc = window.location.hostname;
const WS_URL = `ws://${loc}:3001`;

function isUserEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'userevent';
}

function isDocumentEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'contentchange';
}

function isDataEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'eventdata';
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
  const [activeTab, setActiveTab] = useState('calendar');
  const { data, setData } = useContext(DataContext);
  const [mousePos, setMousePos] = useState({ 'x': 0, 'y': 0 });
  const { user, setUser } = useContext(UserContext);
  const [editedEvents, setEditedEvents] = useState(null);
  const [saved, setSaved] = useState(0);

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
    if (user.name && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username: user.name,
        type: 'userevent'
      });
    }
  }, [user.name, sendJsonMessage, readyState]);

  const lastJsonMessageUser = useWebSocket(WS_URL, {
    share: true,
    filter: isUserEvent
  }).lastJsonMessage;

  useEffect(() => {
    const activities = lastJsonMessageUser?.data.userActivity || [];
    if (activities.length > 0) {
      let message = activities[activities.length - 1];
      if (message.includes('saved')) {
        setSaved((prev) => ++prev);
      }
      notifications.show({
        withBorder: true,
        message,
        autoClose: 4000
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
      events.length === 0 ? setEditedEvents([]) :
        setEditedEvents(importEvents(JSON.parse(events)));
    }
  }, [lastJsonMessage]);

  const receivedData = useWebSocket(WS_URL, {
    share: true,
    filter: isDataEvent
  }).lastJsonMessage;

  useEffect(() => {
    if (receivedData && user.requested) {
      setEditedEvents(importEvents(JSON.parse(receivedData.data.editorContent)));
      setUser({ ...user, requested: false });
    }
  }, [receivedData]);

  useEffect(() => {
    if (window.innerWidth > 768) setUser({ ...user, isPC: true });
    else setUser({ ...user, isPC: false });
  }, [])

  useEffect(() => {
    (async () => {
      if (user.code) {
        let users;
        const sheetsData = await getSheetsData(user.code);
        await fetch(`http://${loc}:3001/api/users`)
          .then(response => response.json())
          .then(data => users = data.message);
        if (Object.keys(users).length > 1) {
          console.log("requesting data from other users");
          setUser({ ...user, requested: true });
          sendJsonMessage({
            type: 'requestdata'
          });
        } else {
          console.log("getting data from sheets");
          setUser({ ...user, requested: false });
          sendJsonMessage({
            type: 'contentchange',
            content: JSON.stringify(sheetsData.calendar),
          });
        }
        setData(sheetsData);
      }
    })();
  }, [user.code]);

  const handleClick = (e) => {
    setMousePos({ 'x': e.clientX, 'y': e.clientY });
  }

  return (
    <>
      <Welcome />
      {!user.code ? <></> :
        <>
          <DrawerReact />
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
                <Calendar mousePos={mousePos} sendJsonMessage={sendJsonMessage} editedEvents={editedEvents} saved={saved} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="map">
              <MapReact />
            </Tabs.Panel>
          </Tabs>
        </>}
    </>
  );
}
