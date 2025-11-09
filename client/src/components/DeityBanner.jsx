export default function DeityBanner() {
  const deities = [
    { emoji: "", name: "" },
    { emoji: "", name: "" },
    { emoji: "", name: "" },
    { emoji: "", name: "" },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 py-6 border-y-2 border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          {deities.map((deity, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border-2 border-primary/10 shadow-sm hover-elevate"
              data-testid={`deity-${index}`}
            >
              <div className="text-5xl mb-2">{deity.emoji}</div>
              <div className="text-xs font-medium text-muted-foreground">{deity.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
