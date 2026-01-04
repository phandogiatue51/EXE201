import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  organizationAPI, 
  projectAPI, 
  applicationAPI 
} from "@/services/api";
import { Organization as APIOrganization, Project, VolunteerApplication } from "@/lib/type";

// Dashboard types (compatible with existing components)
interface Registration {
  id: string;
  programId: string;
  volunteerId: string;
  volunteerName: string;
  programName: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedDate?: string;
}

interface Program {
  id: string;
  organizationId: string;
  name: string;
  title?: string;
  location: string;
  status: 'active' | 'completed' | 'draft';
  volunteersJoined?: number;
  volunteersNeeded?: number;
  [key: string]: any;
}

interface Organization {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  bio?: string;
  description?: string;
  [key: string]: any;
}

interface DashboardStats {
  programs: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  activePrograms: number;
  totalRegistrations: number;
}

// Helper functions to map API data to dashboard format
const mapProjectToProgram = (project: Project & { isActive?: boolean }): Program => {
  // Map status based on ProjectStatus enum:
  // 0 = Draft, 1 = Planning, 2 = Recruiting, 3 = Active, 4 = Completed, 5 = Cancelled
  // For dashboard, we only need: active (status 3), completed (status 4), draft (others)
  // Also check isActive field if it exists
  let status: 'active' | 'completed' | 'draft' = 'draft';
  
  // Check if project has isActive field (some APIs might use this)
  if ((project as any).isActive === true) {
    status = 'active';
  } else if (project.status === 3) {
    status = 'active';      // Đang triển khai - đây là "đang hoạt động"
  } else if (project.status === 4) {
    status = 'completed';
  } else {
    status = 'draft';
  }

  return {
    id: project.id.toString(),
    organizationId: project.organizationId.toString(),
    name: project.title,
    title: project.title,
    location: project.location,
    status: status,
    volunteersJoined: project.currentVolunteers || 0,
    volunteersNeeded: project.requiredVolunteers || 0,
  };
};

const mapApplicationToRegistration = (app: VolunteerApplication, programName: string): Registration => {
  // Map status: 0 = pending, 1 = approved, 2 = rejected
  const statusMap: Record<number, 'pending' | 'approved' | 'rejected'> = {
    0: 'pending',
    1: 'approved',
    2: 'rejected'
  };

  return {
    id: app.id.toString(),
    programId: app.projectId.toString(),
    volunteerId: app.volunteerId.toString(),
    volunteerName: app.volunteerName,
    programName: programName,
    status: statusMap[app.status] || 'pending',
    appliedDate: new Date(app.appliedAt).toISOString().split('T')[0],
    approvedDate: app.reviewedAt ? new Date(app.reviewedAt).toISOString().split('T')[0] : undefined,
  };
};

const mapOrganization = (org: APIOrganization): Organization => {
  return {
    ...org,
    id: org.id.toString(),
    name: org.name,
    email: org.email || undefined,
    phone: org.phoneNumber || undefined,
    phoneNumber: org.phoneNumber || undefined,
    bio: org.description || undefined,
    description: org.description || undefined,
  };
};

export function useOrganizationDashboard() {
  const { user, getOrganizationId, isStaffMember } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  
  const [stats, setStats] = useState<DashboardStats>({
    programs: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    activePrograms: 0,
    totalRegistrations: 0,
  });

  // Get organization ID from auth
  const organizationId = getOrganizationId();

  // Load all data from API
  useEffect(() => {
    // Only load if user is staff and we have organization ID
    if (!isStaffMember() || !organizationId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const orgIdNumber = parseInt(organizationId || '0');
        if (!orgIdNumber || isNaN(orgIdNumber)) {
          console.error("Invalid organization ID:", organizationId);
          setIsLoading(false);
          return;
        }

        // Load organization data
        const loadOrganization = async () => {
          try {
            const orgData = await organizationAPI.getById(orgIdNumber);
            if (orgData) {
              setOrganization(mapOrganization(orgData));
            }
          } catch (error) {
            console.error("Error loading organization:", error);
            // Try to get from localStorage as fallback
            try {
              const storedUser = localStorage.getItem("currentUser");
              if (storedUser) {
                const parsed = JSON.parse(storedUser);
                if (parsed.organizationId === orgIdNumber) {
                  setOrganization(mapOrganization(parsed));
                }
              }
            } catch (e) {
              console.error("Error loading organization from localStorage:", e);
            }
          }
        };

        // Load programs (projects) and return the data
        const loadPrograms = async (): Promise<Project[]> => {
          try {
            const projects = await projectAPI.filter({
              organizationId: orgIdNumber
            });
            
            if (projects && Array.isArray(projects)) {
              // Debug logging - Always log to help debug
              console.log('📊 Loaded projects from API:', projects.map(p => ({
                id: p.id,
                title: p.title,
                status: p.status,
                statusName: p.statusName,
                fullProject: p // Log full object to see all fields
              })));
              
              const mappedPrograms = projects.map(mapProjectToProgram);
              
              // Debug logging for mapped programs
              console.log('🔄 Mapped programs:', mappedPrograms.map(p => ({
                id: p.id,
                name: p.name,
                status: p.status
              })));
              const activeCount = mappedPrograms.filter(p => p.status === "active").length;
              console.log('✅ Active programs count:', activeCount, 'out of', mappedPrograms.length);
              
              setPrograms(mappedPrograms);
              return projects;
            } else {
              setPrograms([]);
              return [];
            }
          } catch (error) {
            console.error("Error loading programs:", error);
            setPrograms([]);
            return [];
          }
        };

        // Load registrations (applications)
        const loadRegistrations = async (projectsData: Project[]) => {
          try {
            const applications = await applicationAPI.filter({
              organizationId: orgIdNumber
            });
            
            if (applications && Array.isArray(applications)) {
              // Create program name map from projects data
              const programNameMap = new Map(
                projectsData.map(p => [p.id.toString(), p.title])
              );
              
              const mappedRegistrations = applications.map(app => {
                const programName = programNameMap.get(app.projectId.toString()) || app.projectTitle || 'Unknown Program';
                return mapApplicationToRegistration(app, programName);
              });
              
              setRegistrations(mappedRegistrations);
            } else {
              setRegistrations([]);
            }
          } catch (error) {
            console.error("Error loading registrations:", error);
            setRegistrations([]);
          }
        };

        // Execute loads: organization and programs in parallel, then registrations
        const [, projectsData] = await Promise.all([
          loadOrganization(),
          loadPrograms()
        ]);
        
        // Load registrations after programs are loaded (needs program names)
        await loadRegistrations(projectsData);
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, organizationId, isStaffMember]);

  // Memoize derived data calculations
  const pendingRegistrations = useCallback(() => {
    return registrations.filter(r => r.status === "pending");
  }, [registrations]);

  const approvedRegistrations = useCallback(() => {
    return registrations.filter(r => r.status === "approved");
  }, [registrations]);

  // Update stats whenever relevant data changes
  useEffect(() => {
    if (!organizationId) return;

    const pending = pendingRegistrations();
    const approved = approvedRegistrations();
    const activeProgramsCount = programs.filter(p => p.status === "active").length;

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Dashboard Stats Calculation:', {
        totalPrograms: programs.length,
        activePrograms: activeProgramsCount,
        programStatuses: programs.map(p => ({ id: p.id, status: p.status, name: p.name })),
      });
    }

    setStats({
      programs: programs.length,
      pendingRegistrations: pending.length,
      approvedRegistrations: approved.length,
      activePrograms: activeProgramsCount,
      totalRegistrations: registrations.length,
    });
  }, [organizationId, programs, registrations, pendingRegistrations, approvedRegistrations]);

  // Actions
  const handleApproveRegistration = useCallback(async (id: string) => {
    try {
      const applicationId = parseInt(id);
      if (isNaN(applicationId)) {
        console.error("Invalid application ID:", id);
        return;
      }

      // Call API to approve
      await applicationAPI.review(applicationId, {
        status: 1, // 1 = approved
        reviewedByStaffId: user?.staffId ? parseInt(user.staffId) : undefined
      });

      // Update local state
      setRegistrations(prev => prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: "approved" as const,
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : r
      ));

      // Refresh data to get latest state
      const orgIdNumber = parseInt(organizationId || '0');
      if (orgIdNumber) {
        const applications = await applicationAPI.filter({
          organizationId: orgIdNumber
        });
        
        if (applications && Array.isArray(applications)) {
          const programNameMap = new Map(
            programs.map(p => [p.id, p.name])
          );
          
          const mappedRegistrations = applications.map(app => {
            const programName = programNameMap.get(app.projectId.toString()) || app.projectTitle || 'Unknown Program';
            return mapApplicationToRegistration(app, programName);
          });
          
          setRegistrations(mappedRegistrations);
        }
      }
    } catch (error) {
      console.error("Error approving registration:", error);
      throw error;
    }
  }, [organizationId, programs, user?.staffId]);

  const handleRejectRegistration = useCallback(async (id: string) => {
    try {
      const applicationId = parseInt(id);
      if (isNaN(applicationId)) {
        console.error("Invalid application ID:", id);
        return;
      }

      // Call API to reject
      await applicationAPI.review(applicationId, {
        status: 2, // 2 = rejected
        reviewedByStaffId: user?.staffId ? parseInt(user.staffId) : undefined
      });

      // Update local state
      setRegistrations(prev => prev.map(r =>
        r.id === id ? { ...r, status: "rejected" as const } : r
      ));

      // Refresh data to get latest state
      const orgIdNumber = parseInt(organizationId || '0');
      if (orgIdNumber) {
        const applications = await applicationAPI.filter({
          organizationId: orgIdNumber
        });
        
        if (applications && Array.isArray(applications)) {
          const programNameMap = new Map(
            programs.map(p => [p.id, p.name])
          );
          
          const mappedRegistrations = applications.map(app => {
            const programName = programNameMap.get(app.projectId.toString()) || app.projectTitle || 'Unknown Program';
            return mapApplicationToRegistration(app, programName);
          });
          
          setRegistrations(mappedRegistrations);
        }
      }
    } catch (error) {
      console.error("Error rejecting registration:", error);
      throw error;
    }
  }, [organizationId, programs, user?.staffId]);

  // Refresh data from API
  const refreshData = useCallback(async () => {
    if (!organizationId) return;

    setIsLoading(true);
    try {
      const orgIdNumber = parseInt(organizationId || '0');
      if (!orgIdNumber || isNaN(orgIdNumber)) {
        console.error("Invalid organization ID:", organizationId);
        return;
      }

      // Reload all data
      const [orgData, projects, applications] = await Promise.all([
        organizationAPI.getById(orgIdNumber).catch(() => null),
        projectAPI.filter({ organizationId: orgIdNumber }).catch(() => []),
        applicationAPI.filter({ organizationId: orgIdNumber }).catch(() => [])
      ]);

      if (orgData) {
        setOrganization(mapOrganization(orgData));
      }

      if (projects && Array.isArray(projects)) {
        setPrograms(projects.map(mapProjectToProgram));
      }

      if (applications && Array.isArray(applications)) {
        const programNameMap = new Map<string, string>(
          (projects || []).map((p: Project) => [p.id.toString(), p.title])
        );
        
        const mappedRegistrations = applications.map(app => {
          const programNameFromMap = programNameMap.get(app.projectId.toString());
          const programName: string = programNameFromMap || 
                                     (app.projectTitle || '') || 
                                     'Unknown Program';
          return mapApplicationToRegistration(app, programName);
        });
        
        setRegistrations(mappedRegistrations);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  // Check if user can manage this organization
  const canManageOrganization = useCallback((targetOrganizationId?: string) => {
    if (!targetOrganizationId) return true;
    return targetOrganizationId === organizationId || user?.isAdmin;
  }, [organizationId, user?.isAdmin]);

  return {
    // State
    stats,
    isLoading,
    organization,
    
    // Computed data
    pendingRegistrations: pendingRegistrations(),
    approvedRegistrations: approvedRegistrations(),
    programs: programs,
    allRegistrations: registrations,
    organizationRegistrations: registrations, // All registrations are for this organization
    
    // Actions
    handleApproveRegistration,
    handleRejectRegistration,
    refreshData,
    canManageOrganization,
    
    // Raw data (for debugging or advanced use)
    rawRegistrations: registrations,
    rawCustomPrograms: programs,
    rawCustomRegistrations: registrations,
  };
}
