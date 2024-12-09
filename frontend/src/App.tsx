// src/App.tsx

import React from 'react';
import TestSupabase from './components/TestSupabase';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Technical Assessment SP25</h1>
      <TestSupabase />
    </div>
  );
};

export default App;