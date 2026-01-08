import { CheckCircle } from "lucide-react";

type SuccessPageProps = {
  action: "checkin" | "checkout";  
  projectName: string;
  hoursWorked?: number;              
  timestamp: string | number | Date;  
};

function SuccessPage({ action, projectName, hoursWorked, timestamp }: SuccessPageProps) {
  const isCheckIn = action === "checkin";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <CheckCircle className="text-green-600 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-green-700 mb-2">
        {isCheckIn
          ? `Successfully checked in to ${projectName}!`
          : `Successfully checked out from ${projectName}!`}
      </h1>
      <p className="text-gray-700 mb-2">
        {new Date(timestamp).toLocaleString()}
      </p>
      {!isCheckIn && hoursWorked !== undefined && (
        <p className="text-gray-700 mb-4">
          Hours worked: {hoursWorked.toFixed(2)}
        </p>
      )}
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded">
          Back to Dashboard
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded">
          View Project
        </button>
      </div>
    </div>
  );
}