import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(usuario, senha)) {
      navigate('/');
    } else {
      setError('Usuário ou senha inválidos');
    }
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
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Usuário
              </label>
              <Input
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="ex: carlos.tecnico"
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Senha
              </label>
              <Input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Qualquer senha"
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 rounded-md">
              Entrar
            </Button>

            <div className="mt-6 p-4 rounded-lg bg-muted">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Usuários de teste</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="font-mono">carlos.tecnico</span> — Técnico</p>
                <p><span className="font-mono">ana.engenheira</span> — Engenheiro</p>
                <p><span className="font-mono">pedro.operador</span> — Operador</p>
              </div>
            </div>
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
