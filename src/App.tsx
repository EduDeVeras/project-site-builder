import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import AppLayout from "@/components/AppLayout";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Transformadores from "./pages/Transformadores";
import CadastrarTransformador from "./pages/CadastrarTransformador";
import Logs from "./pages/Logs";
import Sensores from "./pages/Sensores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/transformadores" element={<Transformadores />} />
              <Route path="/cadastrar" element={<CadastrarTransformador />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/sensores" element={<Sensores />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
