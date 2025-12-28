import { ProjectFilterDto } from "@/lib/filter-type";

const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'https://localhost:7085/api'
    : process.env.REACT_APP_API_URL || '';

interface ApiRequestOptions extends RequestInit {
    skipAuth?: boolean;
    headers?: Record<string, string>;
    timeout?: number;
}

interface ApiError extends Error {
    status?: number;
    data?: any;
}

// Add request timeout helper
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number } = {}): Promise<Response> => {
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

// Generic API request function
const apiRequest = async <T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;

    // Determine the body type and process accordingly
    const isFormData = options.body instanceof FormData;
    const isSearchParams = options.body instanceof URLSearchParams;
    const isStringBody = typeof options.body === 'string';

    // Process body based on type
    let processedBody: BodyInit | null | undefined;
    let contentType: string | undefined;

    if (isFormData) {
        // FormData - browser will set Content-Type with boundary
        processedBody = options.body as FormData;
        contentType = undefined;
    } else if (isSearchParams) {
        // URLSearchParams
        processedBody = options.body as URLSearchParams;
        contentType = 'application/x-www-form-urlencoded';
    } else if (options.body !== undefined && options.body !== null) {
        // If body exists and is not FormData/URLSearchParams, stringify it as JSON
        processedBody = JSON.stringify(options.body);
        contentType = 'application/json';
    } else {
        // No body or null/undefined
        processedBody = options.body;
        contentType = options.headers?.['Content-Type'];
    }

    // Token handling
    let token: string | null = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    }

    // Build headers
    const headers: Record<string, string> = {
        'accept': 'application/json',
        ...options.headers,
    };

    // Add Content-Type header if we determined it and it's not already set
    if (contentType && !headers['Content-Type']) {
        headers['Content-Type'] = contentType;
    }

    // Add Authorization header if needed
    if (!options.skipAuth && token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // For FormData, remove Content-Type header to let browser set it with boundary
    if (isFormData && headers['Content-Type'] && headers['Content-Type'].startsWith('application/json')) {
        delete headers['Content-Type'];
    }

    const config: RequestInit = {
        method: options.method || 'GET',
        headers,
        mode: 'cors',
        credentials: options.credentials || (options.skipAuth ? 'omit' : 'include'),
        ...options,
        body: processedBody,
    };

    // Development logging
    if (process.env.NODE_ENV === 'development') {
        console.log(`%cAPI Request: ${config.method} ${url}`, 'color: #4CAF50; font-weight: bold');
        console.log('Headers:', headers);
        console.log('Body type:', typeof processedBody);

        if (processedBody instanceof FormData) {
            console.log('FormData entries:');
            for (const [key, value] of processedBody.entries()) {
                console.log(`  ${key}:`, value instanceof File ?
                    `File(${value.name}, ${value.size} bytes, ${value.type})` :
                    value);
            }
        } else if (processedBody) {
            console.log('Request body:', processedBody);
        }
    }

    try {
        const response = await fetchWithTimeout(url, {
            ...config,
            timeout: options.timeout || 30000,
        });

        if (!response.ok) {
            const errorText = await response.text();
            let parsedError: any = null;

            try {
                parsedError = JSON.parse(errorText);
            } catch {
                // Not JSON, use text as error
            }

            // Special handling for 'me' validation errors
            const isMeIdValidation = response.status === 400 &&
                parsedError?.errors?.id?.some((m: any) =>
                    typeof m === 'string' && m.includes("'me'"));

            if (isMeIdValidation) {
                console.warn("API returned validation error for 'me' id; returning null for fallback handling");
                return null as T;
            }

            // Create structured error
            const error: ApiError = new Error(
                parsedError?.title || parsedError?.message || errorText || `HTTP ${response.status}`
            );
            error.status = response.status;
            error.data = parsedError;

            throw error;
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204) {
            return undefined as T;
        }

        // Parse response based on content type
        const contentTypeHeader = response.headers.get('content-type');

        if (contentTypeHeader && contentTypeHeader.includes('application/json')) {
            try {
                const data = await response.json();

                if (process.env.NODE_ENV === 'development') {
                    console.log(`%cAPI Response: ${response.status} ${url}`, 'color: #2196F3; font-weight: bold', data);
                }

                return data;
            } catch (e) {
                console.warn('Failed to parse JSON response:', e);
                return null as T;
            }
        }

        // Handle non-JSON responses
        const text = await response.text();

        if (process.env.NODE_ENV === 'development') {
            console.log(`%cAPI Response (non-JSON): ${response.status} ${url}`, 'color: #FF9800; font-weight: bold', text);
        }

        // Try to parse as JSON anyway
        if (text && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
            try {
                return JSON.parse(text);
            } catch {
                return text as T;
            }
        }

        return text as T;

    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            const timeoutError: ApiError = new Error('Request timeout - the server took too long to respond');
            timeoutError.status = 408;
            throw timeoutError;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
            const networkError: ApiError = new Error(
                'Unable to connect to the server. Please check your internet connection and ensure the backend is running.'
            );
            networkError.status = 0;
            throw networkError;
        }

        if ((error as ApiError).status !== undefined) {
            throw error;
        }

        const apiError: ApiError = new Error('An unexpected error occurred');
        apiError.status = 500;
        apiError.data = error;
        throw apiError;
    }
}

export const accountAPI = {
    login: (loginData: any) => apiRequest('/Account/login', {
        method: 'POST',
        body: loginData,
    }),

    signUp: (userData: any) => apiRequest('/Account/sign-up', {
        method: 'POST',
        body: userData,
    }),

    getAll: () => apiRequest('/Account'),

    getById: (id: any) => apiRequest(`/Account/${id}`),

    update: (id: any, userData: any) => apiRequest(`/Account/${id}`, {
        method: 'PUT',
        body: userData,
    }),

    delete: (id: any) => apiRequest(`/Account/${id}`, {
        method: 'DELETE',
    }),

    changePassword: (id: any, passwordData: any) => apiRequest(`/Account/change-password/${id}`, {
        method: 'PUT',
        body: passwordData,
    }),

    filter: (UserFilterDto: any) => {
        const queryParams = new URLSearchParams();
        Object.keys(UserFilterDto).forEach(key => {
            if (UserFilterDto[key] !== undefined && UserFilterDto[key] !== null) {
                queryParams.append(key, UserFilterDto[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/Account/filter?${queryString}` : '/Account/filter';

        return apiRequest(url);
    },
};

export const applicationAPI = {
    getAll: () => apiRequest('/Application'),

    getById: (id: any) => apiRequest(`/Application/${id}`),

    create: (appData: any) => apiRequest('/Application', {
        method: 'POST',
        body: appData,
    }),

    update: (id: any, appData: any) => apiRequest(`/Application/${id}`, {
        method: 'PUT',
        body: appData,
    }),

    review: (id: any, reviewData: any) => apiRequest(`/Application/review/${id}`, {
        method: 'PUT',
        body: reviewData,
    }),

    delete: (id: any) => apiRequest(`/Application/${id}`, {
        method: 'DELETE',
    }),

    filter: (ApplicationFilterDto: any) => {
        const queryParams = new URLSearchParams();
        Object.keys(ApplicationFilterDto).forEach(key => {
            if (ApplicationFilterDto[key] !== undefined && ApplicationFilterDto[key] !== null) {
                queryParams.append(key, ApplicationFilterDto[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/Application/filter?${queryString}` : '/Application/filter';

        return apiRequest(url);
    },
};

export const blogAPI = {
    getAll: () => apiRequest('/Blog'),

    getById: (id: any) => apiRequest(`/Blog/${id}`),

    create: (blogData: any) => {
        const formData = new FormData();

        Object.keys(blogData).forEach(key => {
            if (key !== 'imageFile' && blogData[key] !== undefined) {
                formData.append(key, blogData[key]);
            }
        });

        if (blogData.imageFile) {
            formData.append('imageFile', blogData.imageFile);
        }

        return apiRequest('/Blog', {
            method: 'POST',
            body: formData,
        });
    },

    update: (id: any, blogData: any, accountId: any) => {
        const formData = new FormData();

        Object.keys(blogData).forEach(key => {
            if (key !== 'imageFile' && blogData[key] !== undefined) {
                formData.append(key, blogData[key]);
            }
        });

        if (blogData.imageFile) {
            formData.append('imageFile', blogData.imageFile);
        }

        return apiRequest(`/Blog/${id}?accountId=${accountId}`, {
            method: 'PUT',
            body: formData,
        });
    },

    delete: (id: any, accountId: any) => apiRequest(`/Blog/${id}?accountId=${accountId}`, {
        method: 'DELETE',
    }),

    filter: (BlogFilterDto: any) => {
        const queryParams = new URLSearchParams();
        Object.keys(BlogFilterDto).forEach(key => {
            if (BlogFilterDto[key] !== undefined && BlogFilterDto[key] !== null) {
                queryParams.append(key, BlogFilterDto[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/Blog/filter?${queryString}` : '/Blog/filter';

        return apiRequest(url);
    },
};

export const categoryAPI = {
    getAll: () => apiRequest('/Category'),
};

export const certificateAPI = {
    getAll: () => apiRequest('/Certificate'),

    getById: (id: any) => apiRequest(`/Certificate/${id}`),

    getByAccountId: (accountId: any) => apiRequest(`/Certificate/account/${accountId}`),

    create: (certificateData: any) => {
        const formData = new FormData();

        Object.keys(certificateData).forEach(key => {
            if (key !== 'imageUrl' && certificateData[key] !== undefined) {
                formData.append(key, certificateData[key]);
            }
        });

        if (certificateData.imageUrl instanceof File) {
            formData.append('imageUrl', certificateData.imageUrl);
        }

        return apiRequest('/Certificate', {
            method: 'POST',
            body: formData,
        });
    },

    update: (id: any, certificateData: any) => {
        const formData = new FormData();

        Object.keys(certificateData).forEach(key => {
            if (key !== 'imageUrl' && certificateData[key] !== undefined) {
                formData.append(key, certificateData[key]);
            }
        });

        if (certificateData.imageUrl instanceof File) {
            formData.append('imageUrl', certificateData.imageUrl);
        }

        return apiRequest(`/Certificate/${id}`, {
            method: 'PUT',
            body: formData,
        });
    },

    delete: (id: any) => apiRequest(`/Certificate/${id}`, {
        method: 'DELETE',
    }),

    verify: (id: any, verifyData: any) => apiRequest(`/Certificate/${id}/verify`, {
        method: 'POST',
        body: verifyData,
    }),

    filter: (CertificateFilterDto: any) => {
        const queryParams = new URLSearchParams();
        Object.keys(CertificateFilterDto).forEach(key => {
            if (CertificateFilterDto[key] !== undefined && CertificateFilterDto[key] !== null) {
                queryParams.append(key, CertificateFilterDto[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/Certificate/filter?${queryString}` : '/Certificate/filter';

        return apiRequest(url);
    },
};

export const organizationAPI = {
    getAll: () => apiRequest('/Organization'),

    getById: (id: any) => apiRequest(`/Organization/${id}`),

    create: (organData: any) => {
        // Accept either a FormData instance (when caller builds it) or a plain object
        if (organData instanceof FormData) {
            return apiRequest('/Organization', {
                method: 'POST',
                body: organData,
            });
        }

        const formData = new FormData();

        Object.keys(organData).forEach(key => {
            if (key !== 'imageFile' && organData[key] !== undefined) {
                formData.append(key, organData[key]);
            }
        });

        if (organData.imageFile) {
            formData.append('imageFile', organData.imageFile);
        }

        return apiRequest('/Organization', {
            method: 'POST',
            body: formData,
        });
    },

    createWithManager: (organData: any) => {
        if (organData instanceof FormData) {
            return apiRequest('/Organization/create-with-manager', {
                method: 'POST',
                body: organData,
            });
        }

        const formData = new FormData();

        Object.keys(organData).forEach(key => {
            if (key !== 'imageFile' && organData[key] !== undefined) {
                formData.append(key, organData[key]);
            }
        });

        if (organData.imageFile) {
            formData.append('imageFile', organData.imageFile);
        }

        return apiRequest('/Organization/create-with-manager', {
            method: 'POST',
            body: formData,
        });
    },

    update: (id: any, organData: any) => {
        if (organData instanceof FormData) {
            return apiRequest(`/Organization/${id}`, {
                method: 'PUT',
                body: organData,
            });
        }

        const formData = new FormData();

        Object.keys(organData).forEach(key => {
            if (key !== 'imageFile' && organData[key] !== undefined) {
                formData.append(key, organData[key]);
            }
        });

        if (organData.imageFile) {
            formData.append('imageFile', organData.imageFile);
        }

        return apiRequest(`/Organization/${id}`, {
            method: 'PUT',
            body: formData,
        });
    },

    delete: (id: any) => apiRequest(`/Organization/${id}`, {
        method: 'DELETE',
    }),

    filter: (OrganizationFilterDto: any) => {
        const queryParams = new URLSearchParams();
        Object.keys(OrganizationFilterDto).forEach(key => {
            if (OrganizationFilterDto[key] !== undefined && OrganizationFilterDto[key] !== null) {
                queryParams.append(key, OrganizationFilterDto[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/Organization/filter?${queryString}` : '/Organization/filter';

        return apiRequest(url);
    },
};

export const projectAPI = {
    getAll: () => apiRequest('/Projects'),

    getById: (id: any) => apiRequest(`/Projects/${id}`),

    create: (projectData: any) => {
        const formData = new FormData();

        if (projectData.categoryIds && Array.isArray(projectData.categoryIds)) {
            projectData.categoryIds.forEach((id: number) => {
                formData.append('CategoryIds', id.toString());
            });
        }

        // Handle other fields
        Object.keys(projectData).forEach(key => {
            if (key !== 'imageUrl' && key !== 'categoryIds' && projectData[key] !== undefined) {
                // Capitalize first letter for C# DTO property names
                const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                const value = projectData[key];

                if (value !== null && value !== undefined) {
                    formData.append(capitalizedKey, value.toString());
                }
            }
        });

        if (projectData.imageUrl instanceof File) {
            formData.append('ImageUrl', projectData.imageUrl);
        }

        return apiRequest('/Projects', {
            method: 'POST',
            body: formData,
        });
    },

    update: (id: any, projectData: any) => {
        const formData = new FormData();

        Object.keys(projectData).forEach(key => {
            if (key !== 'imageUrl' && projectData[key] !== undefined) {
                formData.append(key, projectData[key]);
            }
        });

        if (projectData.imageUrl instanceof File) {
            formData.append('imageUrl', projectData.imageUrl);
        }

        return apiRequest(`/Projects/${id}`, {
            method: 'PUT',
            body: formData,
        });
    },

    delete: (id: any) => apiRequest(`/Projects/${id}`, {
        method: 'DELETE',
    }),

    filter: async (filter: ProjectFilterDto & { categoryIds?: number[] }) => {
        const queryParams = new URLSearchParams();

        Object.keys(filter).forEach(key => {
            const value = filter[key as keyof typeof filter];

            if (value !== undefined && value !== null) {
                if (key === 'categoryIds' && Array.isArray(value)) {
                    value.forEach(id => {
                        queryParams.append('categoryIds', id.toString());
                    });
                } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    queryParams.append(key, value.toString());
                } else if (value instanceof Date) {
                    queryParams.append(key, value.toISOString());
                }
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/Projects/filter?${queryString}` : '/Projects/filter';

        return apiRequest(url);
    },
};

export const staffAPI = {
    getAll: () => apiRequest('/Staff'),

    getById: (id: any) => apiRequest(`/Staff/${id}`),

    getByOrganId: (organId: any) => apiRequest(`/Staff/organization/${organId}`),

    create: (staffData: any) => apiRequest('/Staff', {
        method: 'POST',
        body: staffData,
    }),

    update: (id: any, staffData: any) => apiRequest(`/Staff/${id}`, {
        method: 'PUT',
        body: staffData,
    }),

    delete: (staffId: any) => {
        return apiRequest(`/Staff/${staffId}?staffId=${staffId}`, {
            method: 'DELETE',
        });
    },

    filter: (StaffFilterDto: any) => {
        const queryParams = new URLSearchParams();
        Object.keys(StaffFilterDto).forEach(key => {
            if (StaffFilterDto[key] !== undefined && StaffFilterDto[key] !== null) {
                queryParams.append(key, StaffFilterDto[key]);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/Staff/filter?${queryString}` : '/Staff/filter';

        return apiRequest(url);
    },
};

export default apiRequest;