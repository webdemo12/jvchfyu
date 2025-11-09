import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import DeityBanner from "@/components/DeityBanner";
import LiveIndicator from "@/components/LiveIndicator";
import ResultsTable from "@/components/ResultsTable";

export default function Home() {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["/api/results/today"],
    queryFn: api.getTodayResults,
    refetchInterval: 60000, // Refetch every minute
  });

  const today = new Date().toLocaleDateString('en-GB');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DeityBanner />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-4">
          <LiveIndicator />
        </div>
      </div>

      {isLoading ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-lg">Loading today's results...</p>
        </div>
      ) : (
        <ResultsTable results={results} date={today} />
      )}

      <footer className="bg-primary/5 mt-12 py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Big Deal. All rights reserved. | Play responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
