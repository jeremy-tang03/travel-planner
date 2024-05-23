import './App.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import MapReact from './components/MapReact';
import DrawerReact from './components/DrawerReact';

export default function App() {

  return (
    <MantineProvider>
      <div className="App">
        <DrawerReact />
        <MapReact />
      </div>
    </MantineProvider>
  );
}
