const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'https://localhost:7230/api'
    : process.env.REACT_APP_API_URL || '';

const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const isFormData = options.body instanceof FormData;

    const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
    const config = {
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'accept': '*/*',
            ...(!options.skipAuth && token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
        mode: 'cors',
        credentials: 'omit',
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
            console.log('Content-Type header:', config.headers['Content-Type']);
        }

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorText = await response.text();
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

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Unable to connect to the server. Please check if the backend is running and accessible.');
        }

        throw error;
    }
};

export const accountAPI = {
    login: (loginData) => apiRequest('/Account/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
    }),

    signUp: (userData) => apiRequest('/Account/sign-up', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    getAll: () => apiRequest('/Account'),

    getById: (id) => apiRequest(`/Account/${id}`),

    update: (id, userData) => apiRequest(`/Account/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),

    delete: (id) => apiRequest(`/Account/${id}`, {
        method: 'DELETE',
    }),

    changePassword: (id, passwordData) => apiRequest(`/Account/change-password/${id}`, {
        method: 'PUT',
        body: JSON.stringify(passwordData),
    }),
};

export const applicationAPI = {
    getAll: () => apiRequest('/Application'),

    getById: (id) => apiRequest(`/Application/${id}`),

    create: (appData) => apiRequest('/Application', {
        method: 'POST',
        body: JSON.stringify(appData),
    }),

    update: (id, appData) => apiRequest(`/Application/${id}`, {
        method: 'PUT',
        body: JSON.stringify(appData),
    }),

    review: (id, reviewData) => apiRequest(`/Application/review/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData),
    }),

    delete: (id) => apiRequest(`/Application/${id}`, {
        method: 'DELETE',
    }),

    filter: (filterData) => apiRequest('/Application/filter', {
        method: 'GET',
        body: JSON.stringify(filterData),
    }),
};

export const blogAPI = {
    getAll: () => apiRequest('/Blog'),

    getById: (id) => apiRequest(`/Blog/${id}`),

    create: (blogData) => {
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

    update: (id, blogData, accountId) => {
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

    delete: (id, accountId) => apiRequest(`/Blog/${id}?accountId=${accountId}`, {
        method: 'DELETE',
    }),
};

export const categoryAPI = {
    getAll: () => apiRequest('/Category'),
};

export const certificateAPI = {
    getAll: () => apiRequest('/Certificate'),

    getById: (id) => apiRequest(`/Certificate/${id}`),

    getByAccountId: (accountId) => apiRequest(`/Certificate/account/${accountId}`),

    create: (certificateData) => {
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

    update: (id, certificateData) => {
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

    delete: (id) => apiRequest(`/Certificate/${id}`, {
        method: 'DELETE',
    }),

    verify: (id, verifyData) => apiRequest(`/Certificate/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify(verifyData),
    }),

    filter: (filterDto) => {
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
    getAll: () => apiRequest('/Organ'),

    getById: (id) => apiRequest(`/Organ/${id}`),

    create: (organData) => {
        const formData = new FormData();

        Object.keys(organData).forEach(key => {
            if (key !== 'imageFile' && organData[key] !== undefined) {
                formData.append(key, organData[key]);
            }
        });

        if (organData.imageFile) {
            formData.append('imageFile', organData.imageFile);
        }

        return apiRequest('/Organ', {
            method: 'POST',
            body: formData,
        });
    },

    createWithManager: (organData) => {
        const formData = new FormData();

        Object.keys(organData).forEach(key => {
            if (key !== 'imageFile' && organData[key] !== undefined) {
                formData.append(key, organData[key]);
            }
        });

        if (organData.imageFile) {
            formData.append('imageFile', organData.imageFile);
        }

        return apiRequest('/Organ/create-with-manager', {
            method: 'POST',
            body: formData,
        });
    },

    update: (id, organData) => {
        const formData = new FormData();

        Object.keys(organData).forEach(key => {
            if (key !== 'imageFile' && organData[key] !== undefined) {
                formData.append(key, organData[key]);
            }
        });

        if (organData.imageFile) {
            formData.append('imageFile', organData.imageFile);
        }

        return apiRequest(`/Organ/${id}`, {
            method: 'PUT',
            body: formData,
        });
    },

    delete: (id) => apiRequest(`/Organ/${id}`, {
        method: 'DELETE',
    }),

    verify: (id, formData) => apiRequest(`/Organ/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
    }),
};

export const projectAPI = {
    getAll: () => apiRequest('/Projects'),

    getById: (id) => apiRequest(`/Projects/${id}`),

    create: (projectData) => {
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

    update: (id, projectData) => {
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

    delete: (id) => apiRequest(`/Projects/${id}`, {
        method: 'DELETE',
    }),
};

export const staffAPI = {
    getAll: () => apiRequest('/Staff'),

    getById: (id) => apiRequest(`/Staff/${id}`),

    getByOrganId: (organId) => apiRequest(`/Staff/organization/${organId}`),

    create: (staffData) => apiRequest('/Staff', {
        method: 'POST',
        body: JSON.stringify(staffData),
    }),

    update: (id, staffData) => apiRequest(`/Staff/${id}`, {
        method: 'PUT',
        body: JSON.stringify(staffData),
    }),

    delete: (staffId) => {
        return apiRequest(`/Staff/${staffId}?staffId=${staffId}`, {
            method: 'DELETE',
        });
    },
};


export default apiRequest;