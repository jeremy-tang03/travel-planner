import { useEffect } from 'react';
import './App.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import Home from './components/Home';
import { Notifications } from '@mantine/notifications';
import Providers from './Providers';

export default function App() {

  return (
    <Providers>
      <div className="App">
        <Notifications />
        <Home />
      </div>
    </Providers>
  );
}
