import './App.css';
import Home from './components/Home';
import { MantineProvider } from '@mantine/core';

export default function App() {

  return (
    <MantineProvider>
      <div className="App">
        <Home />
      </div>
    </MantineProvider>
  );
}
