import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: transformadores = [] } = useQuery({
    queryKey: ['transformadores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('transformadores').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: logEventos = [] } = useQuery({
    queryKey: ['log_eventos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('log_eventos').select('*').order('data_hora', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalTransformadores = transformadores.length;
  const emTeste = transformadores.filter(t => t.status_producao === 'Em Teste').length;
  const alertas = logEventos.filter(l => l.tipo_evento === 'ALERTA TEMPERATURA').length;
  const mediaTemp = totalTransformadores > 0
    ? (transformadores.reduce((s, t) => s + Number(t.temperatura_teste), 0) / totalTransformadores).toFixed(1)
    : '0';
  const recentLogs = logEventos.slice(0, 5);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Painel de Controle</h2>
        <p className="text-sm text-muted-foreground mt-1">Visão geral da produção</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={totalTransformadores} detail="Transformadores cadastrados" />
        <StatCard label="Em Teste" value={emTeste} detail="Aguardando aprovação" accent />
        <StatCard label="Alertas" value={alertas} detail="Temperatura crítica" />
        <StatCard label="Temp. Média" value={`${mediaTemp}°C`} detail="Últimos testes" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border bg-card p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Transformadores Recentes</h3>
          <div className="space-y-3">
            {transformadores.length === 0 && <p className="text-sm text-muted-foreground">Nenhum transformador cadastrado.</p>}
            {transformadores.slice(0, 4).map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{t.numero_serie}</p>
                  <p className="text-xs text-muted-foreground font-mono">{t.modelo} · {t.potencia_kva} kVA</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{Number(t.temperatura_teste)}°C</span>
                  <StatusBadge status={t.status_producao} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border bg-card p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Últimos Eventos</h3>
          <div className="space-y-3">
            {recentLogs.length === 0 && <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>}
            {recentLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  log.tipo_evento === 'ALERTA TEMPERATURA' ? 'bg-destructive' :
                  log.tipo_evento === 'APROVAÇÃO' ? 'bg-success' :
                  log.tipo_evento === 'MANUTENÇÃO' ? 'bg-warning' : 'bg-primary'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{log.descricao}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    TRF #{log.id_transformador} · {new Date(log.data_hora).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
