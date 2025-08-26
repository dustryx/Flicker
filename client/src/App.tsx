import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ProfileSetup from "@/pages/profile-setup";
import Matches from "@/pages/matches";
import Chat from "@/pages/chat";
import Settings from "@/pages/settings";
import Premium from "@/pages/premium";
import NotFound from "@/pages/not-found";
import TermsPrivacy from "@/pages/terms-privacy";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/terms-privacy" component={TermsPrivacy} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/profile-setup" component={ProfileSetup} />
          <Route path="/matches" component={Matches} />
          <Route path="/chat/:matchId" component={Chat} />
          <Route path="/settings" component={Settings} />
          <Route path="/premium" component={Premium} />
          <Route path="/terms-privacy" component={TermsPrivacy} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
