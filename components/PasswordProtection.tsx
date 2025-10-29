import React, { useState, useEffect } from 'react';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'demo123';

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('ai_enhancer_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem('ai_enhancer_auth', 'authenticated');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password non corretta. Riprova.');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-blue-400 text-lg">Caricamento...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-blue-400 mb-2" style={{
                textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
              }}>
                🔒 AI Image Enhancer
              </h1>
              <p className="text-gray-400 text-sm">
                Inserisci la password per accedere
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-blue-500/50"
              >
                Accedi
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>La password verrà salvata nel tuo browser</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PasswordProtection;

