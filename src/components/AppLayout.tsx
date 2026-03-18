import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import AppSidebar from './AppSidebar';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
