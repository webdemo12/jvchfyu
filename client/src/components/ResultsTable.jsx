import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ResultsTable({ results, date }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2" data-testid="text-title">
            Big Deal Today Live Result
          </h1>
          <p className="text-xl font-semibold text-foreground" data-testid="text-date">
            {date}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Big Deal - a simultaneous game genre, find out here which number came .
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-results">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-6 py-3 text-left font-semibold">Time</th>
                <th className="px-6 py-3 text-left font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={index}
                  className={`border-b hover-elevate ${index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}
                  data-testid={`row-result-${index}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{result.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl font-mono font-bold text-primary" data-testid={`text-result-${index}`}>
                        {result.number}
                      </span>
                      {result.bottomNumber && (
                        <span className="text-lg font-mono font-bold text-primary/80" data-testid={`text-bottom-result-${index}`}>
                          {result.bottomNumber}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            <strong>Disclaimer:</strong>"This game involves an element of financial risk and may be addictive. Please play responsibly and at your own risk."
          </p>
        </div>
      </Card>
    </div>
  );
}
