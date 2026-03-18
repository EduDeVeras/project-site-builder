import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type StatusProducao = Database['public']['Enums']['status_producao'];

export default function CadastrarTransformador() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    numero_serie: '',
    modelo: '',
    potencia_kva: '',
    tensao_nominal: '',
    temperatura_teste: '',
    data_teste: '',
  });

  const isTecnico = user?.role === 'tecnico';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTecnico) {
      toast.error('Apenas técnicos podem cadastrar transformadores.');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('transformadores').insert({
      numero_serie: form.numero_serie,
      modelo: form.modelo,
      potencia_kva: Number(form.potencia_kva),
      tensao_nominal: Number(form.tensao_nominal),
      temperatura_teste: Number(form.temperatura_teste),
      data_teste: form.data_teste,
      status_producao: 'Em Produção' as StatusProducao,
    });

    if (error) {
      toast.error('Erro ao cadastrar: ' + error.message);
    } else {
      // Log the event
      const { data: newTransformer } = await supabase
        .from('transformadores')
        .select('id')
        .eq('numero_serie', form.numero_serie)
        .single();

      if (newTransformer) {
        await supabase.from('log_eventos').insert({
          id_transformador: newTransformer.id,
          tipo_evento: 'CADASTRO',
          descricao: `Novo transformador ${form.numero_serie} cadastrado no sistema`,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['transformadores'] });
      queryClient.invalidateQueries({ queryKey: ['log_eventos'] });
      toast.success(`Transformador ${form.numero_serie} cadastrado com sucesso!`);
      navigate('/transformadores');
    }

    setSubmitting(false);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Cadastrar Transformador</h2>
        <p className="text-sm text-muted-foreground mt-1">Adicione um novo equipamento ao sistema</p>
      </div>

      {!isTecnico && (
        <div className="mb-6 p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-sm text-destructive">
          Apenas usuários com perfil de Técnico podem cadastrar transformadores.
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border bg-card p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Número de Série</label>
            <Input value={form.numero_serie} onChange={e => update('numero_serie', e.target.value)} placeholder="TRF-2026-XXX" required />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Modelo</label>
            <Input value={form.modelo} onChange={e => update('modelo', e.target.value)} placeholder="Modelo X-500" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Potência (kVA)</label>
            <Input type="number" value={form.potencia_kva} onChange={e => update('potencia_kva', e.target.value)} placeholder="1500" required />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Tensão Nominal (V)</label>
            <Input type="number" value={form.tensao_nominal} onChange={e => update('tensao_nominal', e.target.value)} placeholder="13800" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Temperatura Teste (°C)</label>
            <Input type="number" step="0.1" value={form.temperatura_teste} onChange={e => update('temperatura_teste', e.target.value)} placeholder="75.5" required />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Data do Teste</label>
            <Input type="date" value={form.data_teste} onChange={e => update('data_teste', e.target.value)} required />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={!isTecnico || submitting} className="rounded-md">
            {submitting ? 'Cadastrando...' : 'Cadastrar Transformador'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/transformadores')} className="rounded-md">Cancelar</Button>
        </div>
      </motion.form>
    </div>
  );
}
