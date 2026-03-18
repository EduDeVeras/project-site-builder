import { useState } from 'react';
import { transformadores as initialData } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function Transformadores() {
  const [search, setSearch] = useState('');
  const filtered = initialData.filter(t =>
    t.numero_serie.toLowerCase().includes(search.toLowerCase()) ||
    t.modelo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Transformadores</h2>
          <p className="text-sm text-muted-foreground mt-1">{initialData.length} equipamentos cadastrados</p>
        </div>
        <Input
          placeholder="Buscar por série ou modelo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs h-10"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border bg-card overflow-hidden"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">Série</th>
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">Modelo</th>
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">Potência</th>
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">Tensão</th>
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">Temp.</th>
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">Data Teste</th>
              <th className="text-left text-xs font-mono uppercase tracking-wider text-muted-foreground px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-mono font-medium">{t.numero_serie}</td>
                <td className="px-4 py-3 text-sm">{t.modelo}</td>
                <td className="px-4 py-3 text-sm font-mono">{t.potencia_kva} kVA</td>
                <td className="px-4 py-3 text-sm font-mono">{t.tensao_nominal.toLocaleString()} V</td>
                <td className={`px-4 py-3 text-sm font-mono ${t.temperatura_teste > 85 ? 'text-destructive font-semibold' : ''}`}>
                  {t.temperatura_teste}°C
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(t.data_teste).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3"><StatusBadge status={t.status_producao} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">Nenhum transformador encontrado.</div>
        )}
      </motion.div>
    </div>
  );
}
