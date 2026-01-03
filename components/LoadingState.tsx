export function LoadingState({ message = "Đang tải..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12">
        <p className="text-muted-foreground">{message}</p>
      </main>
    </div>
  );
}