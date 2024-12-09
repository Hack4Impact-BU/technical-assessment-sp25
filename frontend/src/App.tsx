import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import './App.css'

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  return session ? (
    <div>
      <h1>Welcome!</h1>
      <button onClick={() => supabase.auth.signOut()}>Logout</button>
    </div>
  ) : (
    <Auth />
  );
};

export default App;