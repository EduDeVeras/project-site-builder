-- Tighten INSERT policies for log_eventos and dados_sensores
-- Only allow inserts for users with tecnico or engenheiro roles
DROP POLICY "Authenticated users can insert log_eventos" ON public.log_eventos;
CREATE POLICY "Tecnico/Engenheiro can insert log_eventos" ON public.log_eventos 
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'tecnico') OR public.has_role(auth.uid(), 'engenheiro'));

DROP POLICY "Authenticated users can insert dados_sensores" ON public.dados_sensores;
CREATE POLICY "Tecnico/Engenheiro can insert dados_sensores" ON public.dados_sensores 
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'tecnico') OR public.has_role(auth.uid(), 'engenheiro'));