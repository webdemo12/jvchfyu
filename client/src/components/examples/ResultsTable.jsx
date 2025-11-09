import ResultsTable from '../ResultsTable';

export default function ResultsTableExample() {
  //todo: remove mock functionality
  const mockResults = [
    { time: "10:30 AM", number: "268" },
    { time: "12:00 PM", number: "349" },
    { time: "1:30 PM", number: "156" },
    { time: "3:00 PM", number: "790" },
    { time: "4:30 PM", number: "234" },
    { time: "6:00 PM", number: "887" },
    { time: "7:30 PM", number: "445" },
    { time: "8:00 PM", number: "601" },
  ];

  return <ResultsTable results={mockResults} date="08/11/2025" />;
}
