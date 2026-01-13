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
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approvedDate?: string;
}

interface Program {
  id: string;
  organizationId: string;
  title: string;
  status: "active" | "completed" | "draft";
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

interface ProjectFormProps {
  formData: {
    title: string;
    description: string;
    challenges: string;
    goals: string;
    activities: string;
    impacts: string;
    benefits: string;
    requirements: string;
    type: number;
    location: string;
    startDate: string;
    endDate: string;
    requiredVolunteers: number;
    categories: number[];
    status?: number;
  };
  imagePreview: string | null;
  categories: any[];
  loadingCategories: boolean;
  projectTypes: Array<{ value: number; label: string }>;
  statusOptions?: Array<{ value: number; label: string; color: string }>;
  isEdit?: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onCategoryToggle: (categoryId: number, checked: boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitText?: string;
}

interface StaffFormProps {
  formData: {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber: string;
    dateOfBirth: string;
    isFemale: boolean;
    role: number;
    bio?: string;
    isActive?: boolean;
  };
  imagePreview: string | null;
  isEdit: boolean;
  showPassword: boolean;
  loading: boolean;
  staffRoles: Array<{ value: number; label: string; description: string }>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onGenderChange: (isFemale: boolean) => void;
  onRoleChange: (role: number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onPasswordToggle: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
}

  interface ViewRecordDto {
    recordId: number;
    volunteerApplicationId: number;
    volunteer?: {
      id: number;
      name: string;
      email: string;
      phoneNumber: string
      profileImageUrl: string;
    };
    checkIn: string | null;
    checkOut: string | null;
    hours: number;
  }
