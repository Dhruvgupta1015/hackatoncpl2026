import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h2>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8">
        <DashboardPreview />
      </div>
    </div>
  );
}
