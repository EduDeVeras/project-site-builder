import { logEventos, transformadores } from '@/lib/mock-data';
import { motion } from 'framer-motion';

const tipoColors: Record<string, string> = {
  'ALERTA TEMPERATURA': 'bg-destructive',
  'MANUTENÇÃO': 'bg-warning',
  'APROVAÇÃO': 'bg-success',
  'CADASTRO': 'bg-primary',
  'STATUS': 'bg-muted-foreground',
};

export default function Logs() {
  const sorted = [...logEventos].sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime());

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Registro de Logs</h2>
        <p className="text-sm text-muted-foreground mt-1">{logEventos.length} eventos registrados</p>
      </div>

      <div className="space-y-3">
        {sorted.map((log, i) => {
          const transformer = transformadores.find(t => t.id === log.id_transformador);
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card"
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${tipoColors[log.tipo_evento] || 'bg-muted-foreground'}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {log.tipo_evento}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {transformer?.numero_serie}
                  </span>
                </div>
                <p className="text-sm">{log.descricao}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {new Date(log.data_hora).toLocaleString('pt-BR')}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
