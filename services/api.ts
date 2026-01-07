import { ProjectFilterDto } from "@/lib/filter-type";
import {
  mapToCreateDtoField,
  mapToUpdateDtoField,
  VolunteerApplication,
} from "@/lib/type";
import { Category } from "@/lib/type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://localhost:7085/api"
    : process.env.REACT_APP_API_URL || "";

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  headers?: Record<string, string>;
  timeout?: number;
}

const fetchWithTimeout = async (
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> => {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    accept: "application/json",
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  let token: string | null = null;
  if (typeof window !== "undefined" && !options.skipAuth) {
    token =
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers,
    ...options,
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetchWithTimeout(url, {
      ...config,
      timeout: options.timeout || 30000,
    });

    if (!response.ok) {
      const errorText = await response.text();

      let errorMessage = `Error ${response.status}`;

      if (errorText) {
        try {
          const data = JSON.parse(errorText);
          errorMessage = data.message;
        } catch {
          errorMessage = errorText;
        }
      }

      console.log("DEBUG: About to throw error:", errorMessage);
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    try {
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn("Failed to parse JSON response:", e);
      return null as T;
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const accountAPI = {
  login: (loginData: any) =>
    apiRequest("/Account/login", {
      method: "POST",
      body: loginData,
    }),

  signUp: (userData: any) =>
    apiRequest("/Account/sign-up", {
      method: "POST",
      body: userData,
    }),

  getAll: () => apiRequest("/Account"),

  getById: (id: any) => apiRequest(`/Account/${id}`),

  update: (id: any, userData: any) =>
    apiRequest(`/Account/${id}`, {
      method: "PUT",
      body: userData,
    }),

  delete: (id: any) =>
    apiRequest(`/Account/${id}`, {
      method: "DELETE",
    }),

  changePassword: (id: any, passwordData: any) =>
    apiRequest(`/Account/change-password/${id}`, {
      method: "PUT",
      body: passwordData,
    }),

  filter: (UserFilterDto: any) => {
    const queryParams = new URLSearchParams();
    Object.keys(UserFilterDto).forEach((key) => {
      if (UserFilterDto[key] !== undefined && UserFilterDto[key] !== null) {
        queryParams.append(key, UserFilterDto[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Account/filter?${queryString}`
      : "/Account/filter";

    return apiRequest(url);
  },
};

export const applicationAPI = {
  getAll: () => apiRequest("/Application"),

  getById: (id: any) => apiRequest(`/Application/${id}`),

  create: (appData: any) =>
    apiRequest("/Application", {
      method: "POST",
      body: appData,
    }),

  update: (id: any, appData: any) =>
    apiRequest(`/Application/${id}`, {
      method: "PUT",
      body: appData,
    }),

  review: (id: number, appData: any) =>
    apiRequest(`/Application/review/${id}`, {
      method: "PUT",
      body: appData,
    }),

  delete: (id: any) =>
    apiRequest(`/Application/${id}`, {
      method: "DELETE",
    }),

  filter: (ApplicationFilterDto: any) => {
    const queryParams = new URLSearchParams();
    Object.keys(ApplicationFilterDto).forEach((key) => {
      if (
        ApplicationFilterDto[key] !== undefined &&
        ApplicationFilterDto[key] !== null
      ) {
        queryParams.append(key, ApplicationFilterDto[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Application/filter?${queryString}`
      : "/Application/filter";

    return apiRequest<VolunteerApplication[]>(url);
  },
};

export const blogAPI = {
  getAll: () => apiRequest("/Blog"),

  getById: (id: any) => apiRequest(`/Blog/${id}`),

  create: (blogData: any) => {
    const formData = new FormData();

    Object.keys(blogData).forEach((key) => {
      if (blogData[key] !== null && blogData[key] !== undefined) {
        const formDataKey = mapToCreateDtoField(key);
        if (blogData[key] instanceof File) {
          formData.append(formDataKey, blogData[key]);
        } else if (typeof blogData[key] === "string") {
          formData.append(formDataKey, blogData[key]);
        } else if (typeof blogData[key] === "number") {
          formData.append(formDataKey, blogData[key].toString());
        }
      }
    });

    return apiRequest("/Blog", {
      method: "POST",
      body: formData,
    });
  },

  update: (id: any, blogData: any) => {
    const formData = new FormData();

    Object.keys(blogData).forEach((key) => {
      if (blogData[key] !== null && blogData[key] !== undefined) {
        const formDataKey = mapToUpdateDtoField(key);

        if (blogData[key] instanceof File) {
          formData.append(formDataKey, blogData[key]);
        } else if (typeof blogData[key] === "string") {
          formData.append(formDataKey, blogData[key]);
        } else if (typeof blogData[key] === "number") {
          formData.append(formDataKey, blogData[key].toString());
        } else if (typeof blogData[key] === "boolean") {
          formData.append(formDataKey, blogData[key].toString());
        }
      }
    });

    return apiRequest(`/Blog/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: (id: any) =>
    apiRequest(`/Blog/${id}`, {
      method: "DELETE",
    }),

  updateStatus: (id: any, statusData: any) =>
    apiRequest(`/Blog/${id}/status`, {
      method: "PUT",
      body: statusData,
    }),

  filter: (BlogFilterDto: any) => {
    const queryParams = new URLSearchParams();
    Object.keys(BlogFilterDto).forEach((key) => {
      if (BlogFilterDto[key] !== undefined && BlogFilterDto[key] !== null) {
        queryParams.append(key, BlogFilterDto[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/Blog/filter?${queryString}` : "/Blog/filter";

    return apiRequest(url);
  },
};

export const categoryAPI = {
  getAll: (): Promise<Category[]> => apiRequest("/Category"),
};

export const certificateAPI = {
  getAll: () => apiRequest("/Certificate"),

  getById: (id: any) => apiRequest(`/Certificate/${id}`),

  getByAccountId: (accountId: any) =>
    apiRequest(`/Certificate/account/${accountId}`),

  create: (formData: FormData) => {
    return apiRequest("/Certificate", {
      method: "POST",
      body: formData,
    });
  },

  update: (id: any, certificateData: any) => {
    const formData = new FormData();

    Object.keys(certificateData).forEach((key) => {
      if (key !== "imageUrl" && certificateData[key] !== undefined) {
        formData.append(key, certificateData[key]);
      }
    });

    if (certificateData.imageUrl instanceof File) {
      formData.append("imageUrl", certificateData.imageUrl);
    }

    return apiRequest(`/Certificate/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: (id: any) =>
    apiRequest(`/Certificate/${id}`, {
      method: "DELETE",
    }),

  verify: (id: any, verifyData: any) =>
    apiRequest(`/Certificate/${id}/verify`, {
      method: "POST",
      body: verifyData,
    }),

  filter: (CertificateFilterDto: any) => {
    const queryParams = new URLSearchParams();
    Object.keys(CertificateFilterDto).forEach((key) => {
      if (
        CertificateFilterDto[key] !== undefined &&
        CertificateFilterDto[key] !== null
      ) {
        queryParams.append(key, CertificateFilterDto[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Certificate/filter?${queryString}`
      : "/Certificate/filter";

    return apiRequest(url);
  },
};

export const organizationAPI = {
  getAll: () => apiRequest("/Organization"),

  getById: (id: any) => apiRequest(`/Organization/${id}`),

  create: (organData: any) => {
    if (organData instanceof FormData) {
      return apiRequest("/Organization", {
        method: "POST",
        body: organData,
      });
    }

    const formData = new FormData();

    Object.keys(organData).forEach((key) => {
      if (key !== "imageFile" && organData[key] !== undefined) {
        formData.append(key, organData[key]);
      }
    });

    if (organData.imageFile) {
      formData.append("imageFile", organData.imageFile);
    }

    return apiRequest("/Organization", {
      method: "POST",
      body: formData,
    });
  },

  createWithManager: (organData: any) => {
    if (organData instanceof FormData) {
      return apiRequest("/Organization/create-with-manager", {
        method: "POST",
        body: organData,
      });
    }

    const formData = new FormData();

    Object.keys(organData).forEach((key) => {
      if (key !== "imageFile" && organData[key] !== undefined) {
        formData.append(key, organData[key]);
      }
    });

    if (organData.imageFile) {
      formData.append("imageFile", organData.imageFile);
    }

    return apiRequest("/Organization/create-with-manager", {
      method: "POST",
      body: formData,
    });
  },

  update: (id: any, organData: any) => {
    if (organData instanceof FormData) {
      return apiRequest(`/Organization/${id}`, {
        method: "PUT",
        body: organData,
      });
    }

    const formData = new FormData();

    Object.keys(organData).forEach((key) => {
      if (key !== "imageFile" && organData[key] !== undefined) {
        formData.append(key, organData[key]);
      }
    });

    if (organData.imageFile) {
      formData.append("imageFile", organData.imageFile);
    }

    return apiRequest(`/Organization/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: (id: any) =>
    apiRequest(`/Organization/${id}`, {
      method: "DELETE",
    }),

  filter: (OrganizationFilterDto: any) => {
    const queryParams = new URLSearchParams();
    Object.keys(OrganizationFilterDto).forEach((key) => {
      if (
        OrganizationFilterDto[key] !== undefined &&
        OrganizationFilterDto[key] !== null
      ) {
        queryParams.append(key, OrganizationFilterDto[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Organization/filter?${queryString}`
      : "/Organization/filter";

    return apiRequest(url);
  },

  verify: (id: any, organData: any) => {
    return apiRequest(`/Organization/verify/${id}`, {
      method: "PUT",
      body: organData,
    });
  },
};

export const projectAPI = {
  getAll: () => apiRequest("/Projects"),
  getHomePageProject: () => apiRequest("Projects/homepage-project"),

  getById: (id: any) => apiRequest(`/Projects/${id}`),

  create: (projectData: any) => {
    const formData = new FormData();

    if (projectData.categoryIds && Array.isArray(projectData.categoryIds)) {
      projectData.categoryIds.forEach((id: number) => {
        formData.append("CategoryIds", id.toString());
      });
    }

    Object.keys(projectData).forEach((key) => {
      if (
        key !== "imageUrl" &&
        key !== "categoryIds" &&
        projectData[key] !== undefined
      ) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        const value = projectData[key];

        if (value !== null && value !== undefined) {
          formData.append(capitalizedKey, value.toString());
        }
      }
    });

    if (projectData.imageUrl instanceof File) {
      formData.append("ImageUrl", projectData.imageUrl);
    }

    return apiRequest("/Projects", {
      method: "POST",
      body: formData,
    });
  },

  update: (id: any, projectData: any) => {
    const formData = new FormData();

    if (projectData.categoryIds && Array.isArray(projectData.categoryIds)) {
      projectData.categoryIds.forEach((id: number) => {
        formData.append("CategoryIds", id.toString());
      });
    }

    Object.keys(projectData).forEach((key) => {
      if (
        key !== "imageUrl" &&
        key !== "categoryIds" &&
        projectData[key] !== undefined
      ) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        const value = projectData[key];

        if (value !== null && value !== undefined) {
          if (key.toLowerCase().includes("date") && value) {
            const dateValue = new Date(value);
            if (!isNaN(dateValue.getTime())) {
              formData.append(capitalizedKey, dateValue.toISOString());
            }
          } else {
            formData.append(capitalizedKey, value.toString());
          }
        }
      }
    });

    if (projectData.imageUrl instanceof File) {
      formData.append("ImageUrl", projectData.imageUrl);
    }
    return apiRequest(`/Projects/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: (id: any) =>
    apiRequest(`/Projects/${id}`, {
      method: "DELETE",
    }),

  filter: async (filter: ProjectFilterDto & { categoryIds?: number[] }) => {
    const queryParams = new URLSearchParams();

    Object.keys(filter).forEach((key) => {
      const value = filter[key as keyof typeof filter];

      if (value !== undefined && value !== null) {
        if (key === "categoryIds" && Array.isArray(value)) {
          value.forEach((id) => {
            queryParams.append("categoryIds", id.toString());
          });
        } else if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          queryParams.append(key, value.toString());
        } else if (value instanceof Date) {
          queryParams.append(key, value.toISOString());
        }
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `/Projects/filter?${queryString}`
      : "/Projects/filter";

    return apiRequest(url);
  },
};

export const staffAPI = {
  getAll: () => apiRequest("/Staff"),

  getById: (id: any) => apiRequest(`/Staff/${id}`),

  getByOrganId: (organId: any) => apiRequest(`/Staff/organization/${organId}`),

  create: (formData: FormData) => {
    return apiRequest("/Staff", {
      method: "POST",
      body: formData,
    });
  },

  update: (id: number, formData: FormData) => {
    return apiRequest(`/Staff/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: (staffId: any) => {
    return apiRequest(`/Staff/${staffId}?staffId=${staffId}`, {
      method: "DELETE",
    });
  },

  changeStatus: (staffId: any) => {
    return apiRequest(`/Staff/${staffId}/status`, {
      method: "PUT",
    });
  },

  filter: (StaffFilterDto: any) => {
    const queryParams = new URLSearchParams();
    Object.keys(StaffFilterDto).forEach((key) => {
      if (StaffFilterDto[key] !== undefined && StaffFilterDto[key] !== null) {
        queryParams.append(key, StaffFilterDto[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/Staff/filter?${queryString}` : "/Staff/filter";

    return apiRequest(url);
  },
};

export default apiRequest;
