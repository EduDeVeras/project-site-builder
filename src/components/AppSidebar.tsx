import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Painel', path: '/', icon: '◫' },
  { label: 'Transformadores', path: '/transformadores', icon: '⚡' },
  { label: 'Cadastrar', path: '/cadastrar', icon: '+' },
  { label: 'Logs', path: '/logs', icon: '☰' },
  { label: 'Sensores', path: '/sensores', icon: '◉' },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold tracking-tight">TransformerOS</h1>
        <p className="text-xs text-sidebar-foreground/50 font-mono mt-1 uppercase tracking-widest">
          Sistema Industrial
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors relative ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <span className="text-base font-mono w-5 text-center">{item.icon}</span>
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-sidebar-primary rounded-r"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center text-xs font-semibold">
            {user?.nome.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nome}</p>
            <p className="text-xs text-sidebar-foreground/50 font-mono uppercase">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full text-left text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors px-3 py-1.5"
        >
          Sair do sistema
        </button>
      </div>
    </aside>
  );
}
