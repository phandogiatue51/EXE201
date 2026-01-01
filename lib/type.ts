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
  challenges: string;
  goals: string;
  activities: string;
  impacts: string;
  benefits: string;
  requirements: string;
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
  projectTitle: string; 
  organizationId: number; 
  organizationName: string; 
  volunteerId: number;
  volunteerName: string;
  status: number;
  statusName: string;
  relevantExperience?: string; 
  appliedAt: Date;
  reviewedAt?: Date; 
  reviewedByStaffId?: number; 
  rejectionReason?: string; 
  feedback?: string; 
  notes?: string;
  selectedCertificates?: { 
    id: number;
    accountId: number;
    certificateName: string;
    categoryId: number;
    categoryName: string;
    issuingOrganization: string;
    certificateNumber: string;
    issueDate: string;
    expiryDate?: string;
    description?: string;
    imageUrl?: string;
  }[];
}

export interface Staff {
  id: number;
  organizationId: number;
  accountId: number;
  role: number;
  roleName?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  joinedDate: Date;
  leftDate?: Date;
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
  authorName?: string;
  organizationId?: number;
  organizationName?: string
  author?: Account;
  organization?: Organization;
  publishedDate: string;
  updatedDate?: string;
  status: number;
  statusName?: string;
}

export interface ProjectCategory {
  id: number;
  projectId: number;
  categoryId: number;
}

export const mapToCreateDtoField = (key: string): string => {
  const mapping: Record<string, string> = {
    title: 'Title',
    subtitle: 'Subtitle',
    excerpt: 'Excerpt',
    status: 'Status',
    authorId: 'AuthorId',
    organizationId: 'OrganizationId',
    paragraph1: 'Paragraph1',
    paragraph2: 'Paragraph2',
    paragraph3: 'Paragraph3',
    paragraph4: 'Paragraph4',
    paragraph5: 'Paragraph5',
    
    featuredImage: 'FeaturedImageUrl', 
    image1: 'ImageUrl1',
    image2: 'ImageUrl2',
    image3: 'ImageUrl3',
    image4: 'ImageUrl4',
    image5: 'ImageUrl5',
  };
  
  return mapping[key] || key;
};

export const mapToUpdateDtoField = (key: string): string => {
  const mapping: Record<string, string> = {
    title: 'Title',
    subtitle: 'Subtitle',
    excerpt: 'Excerpt',
    status: 'Status',
    authorId: 'AuthorId',
    organizationId: 'OrganizationId',
    paragraph1: 'Paragraph1',
    paragraph2: 'Paragraph2',
    paragraph3: 'Paragraph3',
    paragraph4: 'Paragraph4',
    paragraph5: 'Paragraph5',
    
    featuredImage: 'FeaturedImageFile', 
    removeFeaturedImage: 'RemoveFeaturedImage',
    image1: 'ImageFile1',
    removeImage1: 'RemoveImage1',
    image2: 'ImageFile2',
    removeImage2: 'RemoveImage2',
    image3: 'ImageFile3',
    removeImage3: 'RemoveImage3',
    image4: 'ImageFile4',
    removeImage4: 'RemoveImage4',
    image5: 'ImageFile5',
    removeImage5: 'RemoveImage5',
  };
  
  return mapping[key] || key;
};

export interface ReviewAppDto {
  status: number;
  rejectionReason?: string;
  reviewedByStaffId?: number;
}