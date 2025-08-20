import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SettingsPage from './components/SettingsPage/SettingsPage';
import './App.css';

type UserRole = 'Administrator' | 'EventManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Administrator');

  useEffect(() => {
    const savedRole = localStorage.getItem('app_role') as UserRole | null;
    if (savedRole) setRole(savedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('app_role');
    setRole(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      localStorage.setItem('app_role', selectedRole);
      setRole(selectedRole);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App min-h-screen">
        {!role ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Sperling DU - Přihlášení
              </h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Uživatelské jméno
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Zadejte jméno"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Heslo
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Zadejte heslo"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Administrator">Administrátor</option>
                    <option value="EventManager">Event Manager</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Přihlásit se
                </button>
              </form>
            </div>
          </div>
        ) : (
          <SettingsPage userRole={role} onLogout={handleLogout} />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
