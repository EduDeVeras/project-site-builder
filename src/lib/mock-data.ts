import { Transformador, LogEvento, DadoSensor, User } from './types';

export const users: User[] = [
  { id: '1', nome: 'Carlos Silva', usuario: 'carlos.tecnico', role: 'tecnico' },
  { id: '2', nome: 'Ana Souza', usuario: 'ana.engenheira', role: 'engenheiro' },
  { id: '3', nome: 'Pedro Lima', usuario: 'pedro.operador', role: 'operador' },
];

export const transformadores: Transformador[] = [
  { id: 1, numero_serie: 'TRF-2026-001', modelo: 'Modelo X-500', potencia_kva: 1500, tensao_nominal: 13800, status_producao: 'Em Teste', temperatura_teste: 75.5, data_teste: '2026-03-18' },
  { id: 2, numero_serie: 'TRF-2026-002', modelo: 'Modelo Y-750', potencia_kva: 2500, tensao_nominal: 34500, status_producao: 'Aprovado', temperatura_teste: 68.2, data_teste: '2026-03-15' },
  { id: 3, numero_serie: 'TRF-2026-003', modelo: 'Modelo Z-300', potencia_kva: 750, tensao_nominal: 13800, status_producao: 'Em Manutenção', temperatura_teste: 92.1, data_teste: '2026-03-10' },
  { id: 4, numero_serie: 'TRF-2026-004', modelo: 'Modelo X-500', potencia_kva: 1500, tensao_nominal: 13800, status_producao: 'Em Produção', temperatura_teste: 62.8, data_teste: '2026-03-12' },
  { id: 5, numero_serie: 'TRF-2026-005', modelo: 'Modelo W-1000', potencia_kva: 3000, tensao_nominal: 69000, status_producao: 'Em Teste', temperatura_teste: 88.3, data_teste: '2026-03-17' },
  { id: 6, numero_serie: 'TRF-2026-006', modelo: 'Modelo Y-750', potencia_kva: 2500, tensao_nominal: 34500, status_producao: 'Aprovado', temperatura_teste: 71.0, data_teste: '2026-03-14' },
];

export const logEventos: LogEvento[] = [
  { id: 1, id_transformador: 3, tipo_evento: 'ALERTA TEMPERATURA', descricao: 'Temperatura acima do limite de segurança (92.1°C)', data_hora: '2026-03-10T14:32:00' },
  { id: 2, id_transformador: 5, tipo_evento: 'ALERTA TEMPERATURA', descricao: 'Temperatura acima do limite de segurança (88.3°C)', data_hora: '2026-03-17T09:15:00' },
  { id: 3, id_transformador: 2, tipo_evento: 'APROVAÇÃO', descricao: 'Transformador aprovado nos testes de conformidade', data_hora: '2026-03-15T16:45:00' },
  { id: 4, id_transformador: 3, tipo_evento: 'MANUTENÇÃO', descricao: 'Enviado para manutenção preventiva', data_hora: '2026-03-10T15:00:00' },
  { id: 5, id_transformador: 1, tipo_evento: 'CADASTRO', descricao: 'Novo transformador cadastrado no sistema', data_hora: '2026-03-18T08:00:00' },
  { id: 6, id_transformador: 4, tipo_evento: 'STATUS', descricao: 'Status alterado para Em Produção', data_hora: '2026-03-12T11:20:00' },
  { id: 7, id_transformador: 6, tipo_evento: 'APROVAÇÃO', descricao: 'Transformador aprovado nos testes', data_hora: '2026-03-14T10:30:00' },
];

export const dadosSensores: DadoSensor[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  id_transformador: (i % 6) + 1,
  temperatura: 55 + Math.random() * 40,
  timestamp: new Date(2026, 2, 18, 0, i * 10).toISOString(),
}));
