import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function PreviousResultCard({ date, results }) {
  return (
    <Card className="hover-elevate" data-testid={`card-result-${date}`}>
      <CardHeader className="bg-primary/5 border-b">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-primary" data-testid={`text-date-${date}`}>{date}</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-3 bg-muted/30 rounded-md border"
              data-testid={`result-${date}-${index}`}
            >
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                <span>{result.time}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="text-xl font-mono font-bold text-primary">
                  {result.number}
                </div>
                {result.bottomNumber && (
                  <div className="text-lg font-mono font-bold text-primary/80">
                    {result.bottomNumber}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
