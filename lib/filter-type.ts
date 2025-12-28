export interface StaffFilterDto {
    Name?: string;
    Email?: string;
    PhoneNumber?: string;
    OrganizationId?: number;
    Role?: number;
    JoinedAt?: string;
    LeftAt?: string;
    IsActive?: boolean;
}

export interface UserFilterDto {
    name?: string;
    email?: string;
    role?: number;
    status?: number;
}

export interface ApplicationFilterDto {
    organizationId?: number;
    projectId?: number;
    volunteerId?: number;
    status?: number;
}

export interface ProjectFilterDto {
    title?: string;
    type?: number;
    startDate?: string;
    endDate?: string;
    location?: string;
    status?: number;
    createdAt?: string;
    organizationId?: number;
    categoryIds?: number[];
}

export interface OrganizationFilterDto {
    name?: string;
    address?: string;
    type?: number;
    status?: number;
    email?: string;
    phoneNumber?: string;
}

export interface CertificateFilterDto {
    accountId?: number;
    categoryId?: number;
    certificateName?: string;
}

export interface BlogFilterDto {
    title?: string;
    authorId?: number;
    organizationId?: number;
    publishDate?: string;
    status?: number;
}

export interface UserFilterDto {
    role?: number;
    status?: number;
    name?: string;
    email?: string;
}