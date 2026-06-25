import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
