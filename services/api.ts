const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'https://localhost:7085/api'
    : process.env.REACT_APP_API_URL || '';

interface ApiRequestOptions extends RequestInit {
    skipAuth?: boolean; 
    headers?: Record<string, string>;
}

const apiRequest = async (endpoint: string, options: ApiRequestOptions = {}): Promise<any> => {
    const url = `${API_BASE_URL}${endpoint}`;

    const isFormData = options.body instanceof FormData;

    const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
    const config: ApiRequestOptions = {
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'accept': '*/*',
            ...(!options.skipAuth && token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        } as Record<string, string>,
        mode: 'cors',
            // include credentials by default so browser cookies (HttpOnly auth cookies)
            // will be sent to the API when present. Callers may override via options.
            credentials: (options.credentials as RequestCredentials) || 'include',
        ...options,
    };

    try {
        console.log('Making API request to:', url, 'with config:', config);

        if (config.body instanceof FormData) {
            console.log('Sending FormData with entries:');
            for (let [key, value] of config.body.entries()) {
                console.log(`${key}:`, value);
                if (value instanceof File) {
                    console.log(`  File details:`, {
                        name: value.name,
                        size: value.size,
                        type: value.type
                    });
                }
            }
            console.log('Content-Type header:', config.headers?.['Content-Type']);
        }

        const response = await fetch(url, config as RequestInit);

        if (!response.ok) {
            const errorText = await response.text();
            let parsedError: any = null;
            try {
                parsedError = JSON.parse(errorText);
            } catch (e) {
                // ignore parse errors
            }

            const isMeIdValidation = response.status === 400
                && parsedError && parsedError.errors && Array.isArray(parsedError.errors.id)
                && parsedError.errors.id.some((m: any) => typeof m === 'string' && m.includes("'me'"));

            if (isMeIdValidation) {
                console.warn("API returned validation error treating 'me' as an id; returning null so caller can fallback.");
                return null;
            }

            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            try {
                const data = await response.json();
                console.log('API Response (JSON):', data);
                return data;
            } catch (e) {
                console.warn('Warning: Response was application/json but parsing failed. Assuming success with generic message.', e);
                return { message: 'Operation successful, but response format was unexpected.', status: response.status };
            }
        } else {
            console.log('API Response (Non-JSON/Empty):', response);
            return { message: 'Operation successful', status: response.status };
        }
    } catch (error) {
        console.error('API request failed:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Unable to connect to the server. Please check if the backend is running and accessible.');
        }

        throw error;
    }
};

export const accountAPI = {
    login: (loginData: any) => apiRequest('/Account/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
    }),

    // Try to fetch the currently authenticated user from the server.
    // Works when server sets an HttpOnly auth cookie and exposes a /Account/me endpoint.
    me: () => apiRequest('/Account/me', {
        method: 'GET',
    }),

    signUp: (userData: any) => apiRequest('/Account/sign-up', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    getAll: () => apiRequest('/Account'),

    getById: (id: any) => apiRequest(`/Account/${id}`),

    update: (id: any, userData: any) => apiRequest(`/Account/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),

    delete: (id: any) => apiRequest(`/Account/${id}`, {
        method: 'DELETE',
    }),

    changePassword: (id: any, passwordData: any) => apiRequest(`/Account/change-password/${id}`, {
        method: 'PUT',
        body: JSON.stringify(passwordData),
    }),
};

export const applicationAPI = {
    getAll: () => apiRequest('/Application'),

    getById: (id: any) => apiRequest(`/Application/${id}`),

    create: (appData: any) => apiRequest('/Application', {
        method: 'POST',
        body: JSON.stringify(appData),
    }),

    update: (id: any, appData: any) => apiRequest(`/Application/${id}`, {
        method: 'PUT',
        body: JSON.stringify(appData),
    }),

    review: (id: any, reviewData: any) => apiRequest(`/Application/review/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData),
    }),

    delete: (id: any) => apiRequest(`/Application/${id}`, {
        method: 'DELETE',
    }),

    filter: (filterData: any) => apiRequest('/Application/filter', {
        method: 'POST',
        body: JSON.stringify(filterData),
    }),
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
        body: JSON.stringify(verifyData),
    }),

    filter: (filterDto: any) => {
        const queryParams = new URLSearchParams();
        Object.keys(filterDto).forEach(key => {
            if (filterDto[key] !== undefined && filterDto[key] !== null) {
                queryParams.append(key, filterDto[key]);
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

    verify: (id: number, status: number, rejectionReason?: string) => apiRequest(`/Organization/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, rejectionReason }),
    }),
};

export const projectAPI = {
    getAll: () => apiRequest('/Projects'),

    getById: (id: any) => apiRequest(`/Projects/${id}`),

    create: (projectData: any) => {
        const formData = new FormData();

        Object.keys(projectData).forEach(key => {
            if (key !== 'imageUrl' && projectData[key] !== undefined) {
                formData.append(key, projectData[key]);
            }
        });

        if (projectData.imageUrl instanceof File) {
            formData.append('imageUrl', projectData.imageUrl);
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
};

export const staffAPI = {
    getAll: () => apiRequest('/Staff'),

    getById: (id: any) => apiRequest(`/Staff/${id}`),

    getByOrganId: (organId: any) => apiRequest(`/Staff/organization/${organId}`),

    create: (staffData: any) => apiRequest('/Staff', {
        method: 'POST',
        body: JSON.stringify(staffData),
    }),

    update: (id: any, staffData: any) => apiRequest(`/Staff/${id}`, {
        method: 'PUT',
        body: JSON.stringify(staffData),
    }),

    delete: (staffId: any) => {
        return apiRequest(`/Staff/${staffId}?staffId=${staffId}`, {
            method: 'DELETE',
        });
    },
};


export default apiRequest;