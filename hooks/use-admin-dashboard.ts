import { useState, useEffect, useCallback } from "react";
import { 
  accountAPI, 
  projectAPI, 
  certificateAPI,
  organizationAPI 
} from "@/services/api";
import { Project, Account, Certificate, Organization } from "@/lib/type";

// Helper function to calculate percentage change based on items created in last 30 days
function calculateChange(total: number, items: any[], dateField: string = 'createdAt'): number {
  if (total === 0 || items.length === 0) return 0;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentCount = items.filter((item: any) => {
    const itemDate = new Date(item[dateField] || 0);
    return itemDate >= thirtyDaysAgo;
  }).length;
  
  // Calculate growth rate: compare recent (30 days) vs older (before 30 days)
  const olderCount = total - recentCount;
  
  // If all items are recent (created in last 30 days), show 100%
  if (olderCount === 0) {
    return recentCount > 0 ? 100 : 0;
  }
  
  // Growth rate: percentage of new items relative to old items
  // Formula: (recent / older) * 100
  const growthRate = (recentCount / olderCount) * 100;
  
  // Cap at 1000% to avoid extremely large numbers
  return Math.min(Math.round(growthRate * 10) / 10, 1000);
}

interface AdminDashboardStats {
  volunteers: number;
  organizations: number;
  programs: number;
  certificates: number;
  pendingApprovals: number;
  activePrograms: number;
  changes: {
    volunteers: number;
    organizations: number;
    programs: number;
    certificates: number;
  };
}

export function useAdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats>({
    volunteers: 0,
    organizations: 0,
    programs: 0,
    certificates: 0,
    pendingApprovals: 0,
    activePrograms: 0,
    changes: {
      volunteers: 0,
      organizations: 0,
      programs: 0,
      certificates: 0,
    },
  });
  
  const [recentPrograms, setRecentPrograms] = useState<Project[]>([]);
  const [pendingOrganizations, setPendingOrganizations] = useState<Organization[]>([]);

  // Load all data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load all data in parallel
        const [accounts, projects, certificates, organizations] = await Promise.all([
          accountAPI.getAll().catch(() => []),
          projectAPI.getAll().catch(() => []),
          certificateAPI.getAll().catch(() => []),
          organizationAPI.getAll().catch(() => [])
        ]);

        // Filter accounts by role
        // Role: 0 = Volunteer, 1 = Staff, 2 = Admin
        const volunteers = Array.isArray(accounts) 
          ? accounts.filter((a: Account) => a.role === 0 || a.roleName?.toLowerCase().includes('volunteer')).length
          : 0;
        
        // Count organizations from organizations API, not from accounts
        const orgCount = Array.isArray(organizations) ? organizations.length : 0;

        // Count programs
        const allPrograms = Array.isArray(projects) ? projects : [];
        const activeProgramsCount = allPrograms.filter((p: Project) => p.status === 3).length;

        // Count certificates
        const allCertificates = Array.isArray(certificates) ? certificates : [];

        // Filter pending organizations (status 0 = pending)
        const pendingOrgs = Array.isArray(organizations)
          ? organizations.filter((org: Organization) => org.status === 0)
          : [];

        // Get recent programs (last 3, sorted by createdAt)
        const sortedPrograms = [...allPrograms].sort((a: Project, b: Project) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        setRecentPrograms(sortedPrograms.slice(0, 3));

        // Set pending organizations
        setPendingOrganizations(pendingOrgs.slice(0, 3));

        // Calculate percentage changes based on items created in last 30 days
        const volunteerAccounts = Array.isArray(accounts) 
          ? accounts.filter((a: Account) => a.role === 0 || a.roleName?.toLowerCase().includes('volunteer'))
          : [];
        
        const changes = {
          volunteers: calculateChange(volunteers, volunteerAccounts, 'createdAt'),
          organizations: calculateChange(orgCount, organizations, 'createAt'),
          programs: calculateChange(allPrograms.length, allPrograms, 'createdAt'),
          certificates: calculateChange(allCertificates.length, allCertificates, 'issueDate'),
        };

        // Update stats
        setStats({
          volunteers,
          organizations: orgCount,
          programs: allPrograms.length,
          certificates: allCertificates.length,
          pendingApprovals: pendingOrgs.length,
          activePrograms: activeProgramsCount,
          changes,
        });

        // Debug logging
        console.log('📊 Admin Dashboard Stats:', {
          volunteers,
          organizations: orgCount,
          programs: allPrograms.length,
          certificates: allCertificates.length,
          pendingApprovals: pendingOrgs.length,
          activePrograms: activeProgramsCount,
        });

      } catch (error) {
        console.error("Error loading admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [accounts, projects, certificates, organizations] = await Promise.all([
        accountAPI.getAll().catch(() => []),
        projectAPI.getAll().catch(() => []),
        certificateAPI.getAll().catch(() => []),
        organizationAPI.getAll().catch(() => [])
      ]);

      // Role: 0 = Volunteer, 1 = Staff, 2 = Admin
      const volunteers = Array.isArray(accounts) 
        ? accounts.filter((a: Account) => a.role === 0 || a.roleName?.toLowerCase().includes('volunteer')).length
        : 0;
      
      const orgCount = Array.isArray(organizations) ? organizations.length : 0;

      const allPrograms = Array.isArray(projects) ? projects : [];
      const activeProgramsCount = allPrograms.filter((p: Project) => p.status === 3).length;
      const allCertificates = Array.isArray(certificates) ? certificates : [];
      const pendingOrgs = Array.isArray(organizations)
        ? organizations.filter((org: Organization) => org.status === 0)
        : [];

      const sortedPrograms = [...allPrograms].sort((a: Project, b: Project) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      setRecentPrograms(sortedPrograms.slice(0, 3));
      setPendingOrganizations(pendingOrgs.slice(0, 3));

      // Calculate percentage changes
      const volunteerAccounts = Array.isArray(accounts) 
        ? accounts.filter((a: Account) => a.role === 0 || a.roleName?.toLowerCase().includes('volunteer'))
        : [];
      
      const changes = {
        volunteers: calculateChange(volunteers, volunteerAccounts, 'createdAt'),
        organizations: calculateChange(orgCount, organizations, 'createAt'),
        programs: calculateChange(allPrograms.length, allPrograms, 'createdAt'),
        certificates: calculateChange(allCertificates.length, allCertificates, 'issueDate'),
      };

      setStats({
        volunteers,
        organizations: orgCount,
        programs: allPrograms.length,
        certificates: allCertificates.length,
        pendingApprovals: pendingOrgs.length,
        activePrograms: activeProgramsCount,
        changes,
      });
    } catch (error) {
      console.error("Error refreshing admin dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    isLoading,
    recentPrograms,
    pendingOrganizations,
    refreshData,
  };
}

