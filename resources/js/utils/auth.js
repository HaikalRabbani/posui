import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.etres.my.id/api/v1';

let userCache = null;
let pendingProfileRequest = null;

export const getAuthToken = () => localStorage.getItem('auth_token');

export const clearAuthSession = () => {
    localStorage.removeItem('auth_token');
    userCache = null;
    pendingProfileRequest = null;
};

export const requiresOutletSetup = (user) => {
    if (!user) return false;

    return user.role === 'manager' && !user.outlet_id;
};

export const resolvePostLoginRoute = (user) => (
    requiresOutletSetup(user) ? '/setup-outlet' : '/dashboard'
);

export const fetchCurrentUser = async (force = false) => {
    const token = getAuthToken();

    if (!token) {
        userCache = null;
        return null;
    }

    if (!force && userCache) {
        return userCache;
    }

    if (!force && pendingProfileRequest) {
        return pendingProfileRequest;
    }

    pendingProfileRequest = axios.get(`${API_BASE_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        const user = response.data?.user || null;
        userCache = user;
        return user;
    }).finally(() => {
        pendingProfileRequest = null;
    });

    return pendingProfileRequest;
};

export const createOutlet = async (name) => {
    const token = getAuthToken();

    return axios.post(`${API_BASE_URL}/outlets`, { name }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateOutlet = async (outletId, name) => {
    const token = getAuthToken();

    return axios.put(`${API_BASE_URL}/outlets/${outletId}`, { name }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
