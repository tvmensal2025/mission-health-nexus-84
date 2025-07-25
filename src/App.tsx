import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import CompleteDashboardPage from "./pages/CompleteDashboardPage";
import AdminPage from "./pages/AdminPage";
import { CoursePlatform } from "./components/CoursePlatform";
import MissionSystem from "./components/MissionSystem";
import ProgressPage from "./pages/ProgressPage";
import NotFound from "./pages/NotFound";
import MyProgress from "./components/MyProgress";
import ColorTest from "./components/ColorTest";
import CSSDebug from "./components/CSSDebug";
import BodyChartsPage from "./pages/BodyChartsPage";
import BioimpedanciaPage from "./pages/BioimpedanciaPage";
// Páginas comentadas temporariamente - não existem
// import GraficosDemoPage from "./pages/GraficosDemoPage";
// import GraficosTestePage from "./pages/GraficosTestePage";
// import CharacterDemoPage from "./pages/CharacterDemoPage";
// import DemoVendaPage from "./pages/DemoVendaPage";
import UserSessions from "./components/UserSessions";
// import QuestionBuilderPage from "./pages/QuestionBuilderPage";
// import { SabotadoresDemo } from "./pages/SabotadoresDemo";
// import SessionDetailPage from "./pages/SessionDetailPage";
// import ToolsManagementPage from "./pages/ToolsManagementPage";
import ChallengesPage from "./pages/ChallengesPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import SaboteurTest from "./components/SaboteurTest";

// Componente para lidar com autenticação na rota de sessões
const SessionRoute = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <UserSessions user={user} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page - standalone without layout */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth page - standalone without layout */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Dashboard - standalone without layout */}
          <Route path="/dashboard" element={<CompleteDashboardPage />} />
          <Route path="/dashboard/progress" element={<MyProgress />} />
          
          {/* Admin - standalone without layout */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Challenges and app pages - standalone without complex layout */}
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
          <Route path="/app/missions" element={<MissionSystem />} />
          <Route path="/app/courses" element={<CoursePlatform viewMode="courses" />} />
          <Route path="/app/sessions" element={<SessionRoute />} />
          <Route path="/app/saboteur-test" element={<SaboteurTest />} />
          <Route path="/app/progress" element={<ProgressPage />} />
          <Route path="/app/bioimpedancia" element={<BioimpedanciaPage />} />
          
          {/* Standalone pages */}
          <Route path="/index" element={<Index />} />
          <Route path="/dashboard-page" element={<DashboardPage />} />
          <Route path="/progress-page" element={<ProgressPage />} />
          <Route path="/color-test" element={<ColorTest />} />
          <Route path="/css-debug" element={<CSSDebug />} />
          <Route path="/body-charts" element={<BodyChartsPage />} />
          <Route path="/bioimpedancia-page" element={<BioimpedanciaPage />} />
          {/* Rotas comentadas - páginas não existem */}
          {/* <Route path="/graficos-demo" element={<GraficosDemoPage />} /> */}
          {/* <Route path="/graficos-teste" element={<GraficosTestePage />} /> */}
          {/* <Route path="/character-demo" element={<CharacterDemoPage />} /> */}
          {/* <Route path="/demo-venda" element={<DemoVendaPage />} /> */}
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
