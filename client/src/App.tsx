import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme/ThemeProvider';
import { useEffect } from 'react';
import { AuthService } from './api/auth.service';
import { CelebrationQueueProvider } from './components/animations/CelebrationQueueProvider';

function App() {
  useEffect(() => {
    AuthService.checkSession().catch(() => {
      // Ignore error, just means user is not logged in
    });
  }, []);

  return (
    <ThemeProvider>
      <CelebrationQueueProvider>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
        <Toaster position="top-right" />
      </CelebrationQueueProvider>
    </ThemeProvider>
  );
}

export default App;
