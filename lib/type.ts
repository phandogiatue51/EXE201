export interface Organization {
  id: number;
  name: string;
  description?: string;
  type: number;
  typeName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  rejectionReason?: string;
  status: number;
  statusName?: string;
  createAt: Date;
  updatedAt?: Date;
  projectsCount?: number;
  staffCount?: number;
  blogPostsCount?: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  type: number;
  typeName: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string;
  organizationId: number;
  organizationName: string;
  status: number;
  statusName: string;
  requiredVolunteers: number;
  currentVolunteers: number;
  createdAt: string;
  updatedAt: string;
  categories: {
    categoryId: number;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
  }[];
}

export interface VolunteerApplication {
  id: number;
  projectId: number;
  volunteerId: number;
  status: number;
  statusName: string;
  appliedAt: Date;
  notes?: string;
  volunteer?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Staff {
  id: number;
  organizationId: number;
  accountId: number;
  role: number;
  roleName?: string;
  joinedAt: Date;
  leftAt?: Date;
  isActive: boolean;
  organization?: Organization;
  account?: Account;
}

export interface Certificate {
  id: number;
  accountId: number;
  certificateName: string;
  categoryId: number;
  categoryName: string;
  issuingOrganization?: string;
  certificateNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  description?: string;
  imageUrl: string;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  bio?: string;
  profileImageUrl?: string;
  isFemale?: boolean;
  dateOfBirth?: Date;
  role: number;
  roleName?: string;
  status: number;
  statusName?: string;
  createdAt: Date;
  updatedAt?: Date;
  certificates?: Certificate[];
  volunteerApplications?: VolunteerApplication[];
  organizationStaff?: Staff[];
}

export interface Category {
  id: number;
  name: string;
  code?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  projectCategories?: ProjectCategory[];
}

export interface BlogPost {
  id: number;
  title?: string;
  subtitle?: string;
  excerpt?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  paragraph4?: string;
  paragraph5?: string;
  featuredImageUrl?: string;
  authorId?: number;
  organizationId?: number;
  author?: Account;
  organization?: Organization;
  publishedDate: Date;
  updatedDate?: Date;
  status: number;
  statusName?: string;
}

export interface ProjectCategory {
  id: number;
  projectId: number;
  categoryId: number;
}