import { Button } from "./ui/button";

export function ErrorState({ 
  message = "Không tìm thấy chương trình",
  onRetry 
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12">
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Thử lại
          </Button>
        )}
      </main>
    </div>
  );
}