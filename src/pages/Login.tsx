import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { UserRole } from '@/lib/auth-context';

export default function Login() {
  const { user, loading, login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [role, setRole] = useState<UserRole>('operador');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Carregando...</div>;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (isSignup) {
      const ok = await signup(email, senha, nome, usuario, role);
      if (ok) {
        toast.success('Conta criada! Verifique seu e-mail ou faça login.');
        setIsSignup(false);
      } else {
        setError('Erro ao criar conta. Verifique os dados.');
      }
    } else {
      const ok = await login(email, senha);
      if (ok) {
        navigate('/');
      } else {
        setError('E-mail ou senha inválidos');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">TransformerOS</h1>
            <p className="text-sm text-muted-foreground mt-1">Sistema de Gestão de Transformadores Industriais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Nome Completo</label>
                  <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Carlos Silva" className="h-11" required />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Usuário</label>
                  <Input value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="carlos.tecnico" className="h-11" required />
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">E-mail</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@empresa.com" className="h-11" required />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Senha</label>
              <Input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" className="h-11" required />
            </div>

            {isSignup && (
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Perfil</label>
                <div className="flex gap-2">
                  {(['tecnico', 'engenheiro', 'operador'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                        role === r
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-muted-foreground border-border hover:border-foreground/20'
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" className="w-full h-11 rounded-md" disabled={submitting}>
              {submitting ? 'Aguarde...' : isSignup ? 'Criar Conta' : 'Entrar'}
            </Button>

            <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              {isSignup ? 'Já tem conta? Entrar' : 'Criar nova conta'}
            </button>
          </form>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-sidebar items-center justify-center p-12">
        <div className="max-w-md text-sidebar-foreground">
          <p className="text-4xl font-semibold tracking-tight leading-tight">
            Controle total da linha de produção.
          </p>
          <p className="text-sidebar-foreground/50 mt-4 text-sm leading-relaxed">
            Monitore temperaturas, gerencie transformadores e rastreie eventos em tempo real com precisão industrial.
          </p>
        </div>
      </div>
    </div>
  );
}
