-- Enum for user roles
CREATE TYPE public.app_role AS ENUM ('tecnico', 'engenheiro', 'operador');

-- Enum for production status
CREATE TYPE public.status_producao AS ENUM ('Em Teste', 'Aprovado', 'Em Manutenção', 'Em Produção', 'Reprovado');

-- Enum for event types
CREATE TYPE public.tipo_evento AS ENUM ('ALERTA TEMPERATURA', 'MANUTENÇÃO', 'APROVAÇÃO', 'CADASTRO', 'STATUS');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  usuario TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'operador',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (true);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Transformadores table
CREATE TABLE public.transformadores (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  numero_serie TEXT NOT NULL UNIQUE,
  modelo TEXT NOT NULL,
  potencia_kva INTEGER NOT NULL,
  tensao_nominal INTEGER NOT NULL,
  status_producao status_producao NOT NULL DEFAULT 'Em Produção',
  temperatura_teste NUMERIC(5,1) NOT NULL DEFAULT 0,
  data_teste DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transformadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view transformadores" ON public.transformadores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tecnicos can insert transformadores" ON public.transformadores FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'tecnico'));
CREATE POLICY "Tecnicos can update transformadores" ON public.transformadores FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'tecnico'));
CREATE POLICY "Tecnicos can delete transformadores" ON public.transformadores FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'tecnico'));

-- Log eventos table
CREATE TABLE public.log_eventos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_transformador BIGINT NOT NULL REFERENCES public.transformadores(id) ON DELETE CASCADE,
  tipo_evento tipo_evento NOT NULL,
  descricao TEXT NOT NULL,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.log_eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view log_eventos" ON public.log_eventos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert log_eventos" ON public.log_eventos FOR INSERT TO authenticated WITH CHECK (true);

-- Dados sensores table
CREATE TABLE public.dados_sensores (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_transformador BIGINT NOT NULL REFERENCES public.transformadores(id) ON DELETE CASCADE,
  temperatura NUMERIC(5,1) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dados_sensores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view dados_sensores" ON public.dados_sensores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert dados_sensores" ON public.dados_sensores FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transformadores_updated_at BEFORE UPDATE ON public.transformadores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, usuario)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'usuario', split_part(NEW.email, '@', 1))
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'operador')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();