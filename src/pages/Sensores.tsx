import { dadosSensores, transformadores } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useState } from 'react';

export default function Sensores() {
  const [selectedId, setSelectedId] = useState(1);
  const sensorData = dadosSensores
    .filter(d => d.id_transformador === selectedId)
    .map(d => ({
      ...d,
      hora: new Date(d.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      temperatura: Number(d.temperatura.toFixed(1)),
    }));

  const transformer = transformadores.find(t => t.id === selectedId);
  const maxTemp = Math.max(...sensorData.map(d => d.temperatura));
  const minTemp = Math.min(...sensorData.map(d => d.temperatura));
  const avgTemp = (sensorData.reduce((s, d) => s + d.temperatura, 0) / sensorData.length).toFixed(1);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Dados dos Sensores</h2>
        <p className="text-sm text-muted-foreground mt-1">Monitoramento de temperatura em tempo real</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {transformadores.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedId(t.id)}
            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
              selectedId === t.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-foreground/20'
            }`}
          >
            {t.numero_serie}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Mín.</p>
          <p className="text-2xl font-semibold font-mono">{minTemp.toFixed(1)}°C</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Média</p>
          <p className="text-2xl font-semibold font-mono">{avgTemp}°C</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Máx.</p>
          <p className={`text-2xl font-semibold font-mono ${maxTemp > 85 ? 'text-destructive' : ''}`}>{maxTemp.toFixed(1)}°C</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border bg-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">
            Leituras — {transformer?.numero_serie}
          </h3>
          <span className="text-xs font-mono text-muted-foreground">{transformer?.modelo}</span>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="hora" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
            <Tooltip
              contentStyle={{
                background: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <ReferenceLine y={85} stroke="hsl(0, 72%, 51%)" strokeDasharray="4 4" label={{ value: 'Limite 85°C', position: 'right', fontSize: 10, fill: 'hsl(0, 72%, 51%)' }} />
            <Line type="monotone" dataKey="temperatura" stroke="hsl(220, 70%, 50%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
