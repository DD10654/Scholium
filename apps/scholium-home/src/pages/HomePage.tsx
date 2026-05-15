import { useAuth } from "@/contexts/AuthContext";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AppGrid from "@/components/AppGrid";
import FeaturesSection from "@/components/FeaturesSection";
import SignUpSection from "@/components/SignUpSection";
import Footer from "@/components/Footer";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function HomePage() {
  const { user, loadingAuth, signOut } = useAuth();

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "hsl(var(--primary))", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav
        user={user}
        onSignInClick={() => scrollTo("signup")}
        onGetStartedClick={() => scrollTo("signup")}
        onSignOut={signOut}
      />
      <main className="flex-1">
        <Hero
          onGetStarted={() => scrollTo("signup")}
          onExploreTools={() => scrollTo("tools")}
        />
        <AppGrid />
        <FeaturesSection />
        <SignUpSection user={user} />
      </main>
      <Footer />
    </div>
  );
}
