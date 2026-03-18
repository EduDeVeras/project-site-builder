import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, detail, accent }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-lg border p-5 ${accent ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}
    >
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-card-foreground">{value}</p>
      {detail && <p className="text-xs text-muted-foreground mt-1">{detail}</p>}
    </motion.div>
  );
}
