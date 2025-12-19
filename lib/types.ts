// Data types for the volunteer platform

export interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "volunteer" | "organization" | "admin";
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  domesticDescription?: string;
  internationalDescription?: string;
  isInternational: boolean;
  organizationId: string;
  organizationName: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  duration?: string; // Thời lượng hoạt động
  schedule?: string[]; // Ngày hoạt động cụ thể
  timeSlots?: string; // Khung giờ hoạt động
  volunteersNeeded: number;
  volunteersJoined: number;
  image?: string;
  status: "active" | "completed" | "cancelled";
}

export interface VolunteerRegistration {
  id: string;
  volunteerId: string;
  volunteerName: string;
  programId: string;
  programName: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedDate?: string;
  hoursContributed?: number;
}

export interface Certificate {
  id: string;
  volunteerId: string;
  volunteerName: string;
  programId: string;
  programName: string;
  hoursContributed: number;
  issuedDate: string;
  certificateNumber: string;
}

export interface ChatMessage {
  id: string;
  programId: string;
  userId: string;
  userName: string;
  userRole: "volunteer" | "organization" | "admin";
  message: string;
  timestamp: string;
}

export interface OrganizationRegistration {
  id: string;
  organizationName: string;
  email: string;
  phone: string;
  bio: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedDate?: string;
}
