import { StatusProducao } from '@/lib/types';

const statusStyles: Record<StatusProducao, string> = {
  'Aprovado': 'status-badge status-approved',
  'Em Teste': 'status-badge status-testing',
  'Em Manutenção': 'status-badge status-maintenance',
  'Em Produção': 'status-badge status-production',
  'Reprovado': 'status-badge status-maintenance',
};

export default function StatusBadge({ status }: { status: StatusProducao }) {
  return <span className={statusStyles[status]}>{status}</span>;
}
