import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { mockAccounts, mockPrograms, mockRegistrations } from "@/lib/mock-data";

export function useOrganizationDashboard() {
  const { user, getOrganizationId, isStaffMember } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [customPrograms, setCustomPrograms] = useState<Program[]>([]);
  const [customRegistrations, setCustomRegistrations] = useState<Registration[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  
  const [stats, setStats] = useState<DashboardStats>({
    programs: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    activePrograms: 0,
    totalRegistrations: 0,
  });

  // Get organization ID from auth or fallback to user ID
  const organizationId = getOrganizationId() || user?.accountId;

  // Load all data
  useEffect(() => {
    // Only load if user is staff and we have organization ID
    if (!isStaffMember() || !organizationId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load organization data
        const loadOrganization = () => {
          try {
            // Try to get from localStorage first
            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
              const parsed = JSON.parse(storedUser);
              if (parsed.id === organizationId || parsed.accountId === organizationId) {
                setOrganization(parsed);
                return;
              }
            }
            
            // Check approved accounts
            const approvedStr = localStorage.getItem("approvedAccounts");
            if (approvedStr) {
              const approved: Organization[] = JSON.parse(approvedStr);
              const found = approved.find(a => 
                a.id === organizationId || 
                a.accountId === organizationId ||
                a.email === user?.email
              );
              if (found) {
                setOrganization(found);
                return;
              }
            }
            
            // Fallback to mock data
            const mockOrg = mockAccounts.find(a => 
              a.id === organizationId || 
              a.accountId === organizationId
            );
            if (mockOrg) {
              setOrganization(mockOrg);
            }
          } catch (error) {
            console.error("Error loading organization:", error);
          }
        };

        // Load programs
        const loadPrograms = () => {
          try {
            const storedPrograms = localStorage.getItem("customPrograms");
            if (storedPrograms) {
              const parsed = JSON.parse(storedPrograms) as Program[];
              // Filter programs for this organization
              const orgPrograms = parsed.filter(p => p.organizationId === organizationId);
              setCustomPrograms(orgPrograms);
            }
          } catch (error) {
            console.error("Error loading programs:", error);
          }
        };

        // Load registrations
        const loadRegistrations = () => {
          try {
            // Load custom registrations
            const storedCustomRegistrations = localStorage.getItem("programRegistrations");
            if (storedCustomRegistrations) {
              const parsed = JSON.parse(storedCustomRegistrations) as Registration[];
              setCustomRegistrations(parsed);
            }
            
            // Load additional registrations
            const storedRegistrations = localStorage.getItem("registrations");
            if (storedRegistrations) {
              const parsed = JSON.parse(storedRegistrations) as Registration[];
              setRegistrations([...mockRegistrations, ...parsed]);
            }
          } catch (error) {
            console.error("Error loading registrations:", error);
          }
        };

        // Execute all loads
        loadOrganization();
        loadPrograms();
        loadRegistrations();
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, organizationId, isStaffMember]);

  // Memoize derived data calculations
  const allPrograms = useCallback(() => {
    if (!organizationId) return [];
    
    const mockOrgPrograms = mockPrograms.filter(p => p.organizationId === organizationId);
    const customOrgPrograms = customPrograms.filter(p => p.organizationId === organizationId);
    
    return [...mockOrgPrograms, ...customOrgPrograms];
  }, [organizationId, customPrograms]);

  const allRegistrations = useCallback(() => {
    return [...registrations, ...customRegistrations];
  }, [registrations, customRegistrations]);

  const organizationRegistrations = useCallback(() => {
    const programs = allPrograms();
    const registrationsList = allRegistrations();
    
    return registrationsList.filter(r => 
      programs.some(p => p.id === r.programId)
    );
  }, [allPrograms, allRegistrations]);

  const pendingRegistrations = useCallback(() => {
    return organizationRegistrations().filter(r => r.status === "pending");
  }, [organizationRegistrations]);

  const approvedRegistrations = useCallback(() => {
    return organizationRegistrations().filter(r => r.status === "approved");
  }, [organizationRegistrations]);

  // Update stats whenever relevant data changes
  useEffect(() => {
    if (!organizationId) return;

    const programs = allPrograms();
    const pending = pendingRegistrations();
    const approved = approvedRegistrations();
    const orgRegs = organizationRegistrations();

    setStats({
      programs: programs.length,
      pendingRegistrations: pending.length,
      approvedRegistrations: approved.length,
      activePrograms: programs.filter(p => p.status === "active").length,
      totalRegistrations: orgRegs.length,
    });
  }, [organizationId, allPrograms, pendingRegistrations, approvedRegistrations, organizationRegistrations]);

  // Actions
  const handleApproveRegistration = useCallback((id: string) => {
    const registration = allRegistrations().find(r => r.id === id);
    
    if (!registration) return;

    // Update custom registrations
    const updatedCustom = customRegistrations.map(r =>
      r.id === id
        ? {
            ...r,
            status: "approved" as const,
            approvedDate: new Date().toISOString().split("T")[0],
          }
        : r
    );
    setCustomRegistrations(updatedCustom);
    
    // Update program volunteer count if needed
    const programToUpdate = allPrograms().find(p => p.id === registration.programId);
    if (programToUpdate) {
      const updatedPrograms = customPrograms.map(p =>
        p.id === registration.programId
          ? { 
              ...p, 
              volunteersJoined: (p.volunteersJoined || 0) + 1 
            }
          : p
      );
      setCustomPrograms(updatedPrograms);
      localStorage.setItem("customPrograms", JSON.stringify(updatedPrograms));
    }
    
    // Save to localStorage
    localStorage.setItem("programRegistrations", JSON.stringify(updatedCustom));
  }, [allRegistrations, allPrograms, customRegistrations, customPrograms]);

  const handleRejectRegistration = useCallback((id: string) => {
    const updatedCustom = customRegistrations.map(r =>
      r.id === id ? { ...r, status: "rejected" as const } : r
    );
    setCustomRegistrations(updatedCustom);
    localStorage.setItem("programRegistrations", JSON.stringify(updatedCustom));
  }, [customRegistrations]);

  // Additional useful functions
  const refreshData = useCallback(() => {
    // Force reload from localStorage
    const loadFromStorage = () => {
      try {
        const storedPrograms = localStorage.getItem("customPrograms");
        if (storedPrograms) {
          const parsed = JSON.parse(storedPrograms) as Program[];
          setCustomPrograms(parsed.filter(p => p.organizationId === organizationId));
        }

        const storedRegistrations = localStorage.getItem("programRegistrations");
        if (storedRegistrations) {
          const parsed = JSON.parse(storedRegistrations) as Registration[];
          setCustomRegistrations(parsed);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    };

    loadFromStorage();
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
    programs: allPrograms(),
    allRegistrations: allRegistrations(),
    organizationRegistrations: organizationRegistrations(),
    
    // Actions
    handleApproveRegistration,
    handleRejectRegistration,
    refreshData,
    canManageOrganization,
    
    // Raw data (for debugging or advanced use)
    rawRegistrations: registrations,
    rawCustomPrograms: customPrograms,
    rawCustomRegistrations: customRegistrations,
  };
}