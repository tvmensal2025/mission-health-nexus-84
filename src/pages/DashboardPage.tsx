import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, LogOut, Trophy, Target, Calendar, Activity, Smartphone, Bell } from "lucide-react";
import { BioimpedanceAnalysis } from "@/components/advanced/BioimpedanceAnalysis";
import { GoogleFitIntegration } from "@/components/advanced/GoogleFitIntegration";
import { SmartNotifications } from "@/components/advanced/SmartNotifications";

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    // Listen for auth changes
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário";

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsivo */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Instituto dos Sonhos</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-base">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground text-sm sm:text-base hidden sm:block">{userName}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="text-xs sm:text-sm">
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Responsivo */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Bem-vindo à sua jornada de transformação!</p>
        </div>

        {/* Welcome Card - Responsivo */}
        <Card className="health-card mb-6 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">🎉 Bem-vindo ao Instituto dos Sonhos!</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                Sua jornada de transformação começa agora. Estamos aqui para apoiá-lo em cada passo do caminho.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base">
                  Começar Primeira Missão
                </Button>
                <Button variant="outline" className="text-sm sm:text-base">
                  Ver Meu Progresso
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats - Grid Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Dias no Instituto</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                +1 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Missões Concluídas</CardTitle>
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Primeira missão aguardando
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card sm:col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Posição no Ranking</CardTitle>
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Complete missões para ranquear
              </p>
            </CardContent>
          </Card>
        </div>

        {/* New Features Tabs - Responsivo */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm p-2 sm:p-3">Visão Geral</TabsTrigger>
            <TabsTrigger value="bioimpedance" className="text-xs sm:text-sm p-2 sm:p-3">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Bioimpedância</span>
              <span className="sm:hidden">Bio</span>
            </TabsTrigger>
            <TabsTrigger value="googlefit" className="text-xs sm:text-sm p-2 sm:p-3">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Google Fit</span>
              <span className="sm:hidden">Fit</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm p-2 sm:p-3">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notificações</span>
              <span className="sm:hidden">Notif</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Quick Actions - Grid Responsivo */}
            <Card className="health-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Target className="h-4 w-4 sm:h-6 sm:w-6" />
                    <span>Missões</span>
                  </Button>
                  
                  <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Trophy className="h-4 w-4 sm:h-6 sm:w-6" />
                    <span>Ranking</span>
                  </Button>
                  
                  <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Calendar className="h-4 w-4 sm:h-6 sm:w-6" />
                    <span>Progresso</span>
                  </Button>
                  
                  <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Heart className="h-4 w-4 sm:h-6 sm:w-6" />
                    <span>Cursos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bioimpedance">
            <BioimpedanceAnalysis />
          </TabsContent>

          <TabsContent value="googlefit">
            <GoogleFitIntegration />
          </TabsContent>

          <TabsContent value="notifications">
            <SmartNotifications />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardPage;