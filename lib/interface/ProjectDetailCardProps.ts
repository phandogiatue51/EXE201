interface ProjectDetailCardProps {
  project: {
    id: number;
    title: string;
    imageUrl?: string;
    typeName: string;
    status: number;
    organizationName: string;
    organizationId: number;
    description: string;
    challenges: string;
    goals: string;
    activities: string;
    impacts: string;
    benefits: string;
    requirements: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    currentVolunteers: number;
    requiredVolunteers: number;
    categories?: Array<{
      categoryId: number;
      categoryName: string;
      categoryColor: string;
      categoryIcon?: string;
    }>;
  };
  showBackButton?: boolean;
  backHref?: string;
  showOrganizationLink?: boolean;
  className?: string;
}