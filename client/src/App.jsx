import { useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import { MantineProvider } from '@mantine/core';

export default function App() {

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response)
      .then(data => console.log("API/HELLO", data));
  }, []);

  return (
    <MantineProvider>
      <div className="App">
        <Home />
      </div>
    </MantineProvider>
  );
}
