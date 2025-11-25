import { useEffect, useState } from 'react';
import Landing from './components/Landing.jsx';
import Auth from './components/Auth.jsx';
import './App.css';

function useRouter() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  function navigate(to) {
    if (to !== window.location.pathname) {
      window.history.pushState({}, '', to);
      setPath(to);
    }
  }
  return { path, navigate };
}

export default function App() {
  const [user, setUser] = useState(null);
  const { path, navigate } = useRouter();

  if (path === '/login') return <Auth initialMode="login" onSuccess={setUser} navigate={navigate} />;
  if (path === '/signup') return <Auth initialMode="register" onSuccess={setUser} navigate={navigate} />;

  return <Landing navigate={navigate} user={user} />;
}
