interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  token: string;
  role: string;
  message: string;
}

interface UserData {
  accountId: string;
  email: string;
  role: string;
  staffId?: string;
  organizationId?: string;
  staffRole?: string;
  isStaff: boolean;
  isAdmin: boolean;
  exp?: number;
}

interface DecodedJWT {
  AccountId: string;
  Email: string;
  Role: string;
  StaffId?: string;
  OrganizationId?: string;
  StaffRole?: string;
  exp: number;
  iss: string;
  aud: string;
  [key: string]: any;
}

interface Registration {
  id: string;
  programId: string;
  volunteerId: string;
  volunteerName: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedDate?: string;
}

interface Program {
  id: string;
  organizationId: string;
  title: string;
  status: 'active' | 'completed' | 'draft';
  volunteersJoined?: number;
  [key: string]: any;
}

interface Organization {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

interface DashboardStats {
  programs: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  activePrograms: number;
  totalRegistrations: number;
}