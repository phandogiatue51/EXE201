import { ApplicationsView } from "@/components/list/application-list";

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ApplicationsView />
      </div>
    </div>
  );
}