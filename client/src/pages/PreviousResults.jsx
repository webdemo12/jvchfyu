import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import PreviousResultCard from "@/components/PreviousResultCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PreviousResults() {
  const [searchDate, setSearchDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  
  const { data: allResults = {}, isLoading: isLoadingAll } = useQuery({
    queryKey: ["/api/results/all"],
    queryFn: () => api.getAllResults(30),
    enabled: !selectedDate,
  });

  const { data: dateResults = [], isLoading: isLoadingDate } = useQuery({
    queryKey: ["/api/results/date", selectedDate],
    queryFn: () => api.getResultsByDate(selectedDate),
    enabled: !!selectedDate,
  });

  const handleSearch = () => {
    if (!searchDate) {
      setSelectedDate(null);
      return;
    }
    
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const parts = searchDate.split('-');
    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
    setSelectedDate(formatted);
  };

  const handleClearSearch = () => {
    setSearchDate("");
    setSelectedDate(null);
  };

  const isLoading = selectedDate ? isLoadingDate : isLoadingAll;

  // Prepare display data
  let displayData = [];
  if (selectedDate && dateResults.length > 0) {
    displayData = [{ date: selectedDate, results: dateResults }];
  } else if (!selectedDate) {
    displayData = Object.entries(allResults).map(([date, results]) => ({
      date,
      results,
    }));
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8" data-testid="text-page-title">
          Game Results in Last 30 Days
        </h1>

        <Card className="max-w-2xl mx-auto p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                placeholder="Select date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10"
                data-testid="input-search-date"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="gap-2" data-testid="button-search">
                <Search className="h-4 w-4" />
                Search
              </Button>
              {selectedDate && (
                <Button variant="outline" onClick={handleClearSearch} data-testid="button-clear">
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-lg">Loading results...</p>
          </div>
        ) : displayData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">
              {selectedDate ? "No results found for selected date" : "No results available"}
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-6xl mx-auto">
            {displayData.map((dayResult, index) => (
              <PreviousResultCard
                key={index}
                date={dayResult.date}
                results={dayResult.results}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="bg-primary/5 mt-12 py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Big Deal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
