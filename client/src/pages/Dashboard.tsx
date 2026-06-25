import { useAuthStore } from '../store/authStore';
import { AuthService } from '../api/auth.service';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await AuthService.logout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-thin mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome, {user?.name || 'User'}!</p>
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
