import { useEffect } from 'react';
import './App.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import Home from './components/Home';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { DirtyProvider } from './components/DirtyContext';
import UserProvider from './UserProvider';

export default function App() {

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response)
      .then(data => console.log("API/HELLO", data));
  }, []);

  return (
    <MantineProvider>
      <div className="App">
        <UserProvider>
          <DirtyProvider>
            <Notifications />
            <Home />
          </DirtyProvider>
        </UserProvider>
      </div>
    </MantineProvider>
  );
}
