import { useEffect } from 'react';
import './App.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import Home from './components/Home';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { DirtyProvider, useDirtyContext } from './components/DirtyContext';

export default function App() {

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response)
      .then(data => console.log("API/HELLO", data));
  }, []);

  return (
    <MantineProvider>
      <div className="App">
        <DirtyProvider>
          <Notifications />
          <Home />
        </DirtyProvider>
      </div>
    </MantineProvider>
  );
}
