export type UserRole = 'tecnico' | 'engenheiro' | 'operador';

export interface User {
  id: string;
  nome: string;
  usuario: string;
  role: UserRole;
}

export type StatusProducao = 'Em Teste' | 'Aprovado' | 'Em Manutenção' | 'Em Produção' | 'Reprovado';

export interface Transformador {
  id: number;
  numero_serie: string;
  modelo: string;
  potencia_kva: number;
  tensao_nominal: number;
  status_producao: StatusProducao;
  temperatura_teste: number;
  data_teste: string;
}

export interface LogEvento {
  id: number;
  id_transformador: number;
  tipo_evento: 'ALERTA TEMPERATURA' | 'MANUTENÇÃO' | 'APROVAÇÃO' | 'CADASTRO' | 'STATUS';
  descricao: string;
  data_hora: string;
}

export interface DadoSensor {
  id: number;
  id_transformador: number;
  temperatura: number;
  timestamp: string;
}
