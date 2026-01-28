import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = (userData, userToken) => {
        console.log('[AuthContext] Login called with:', {
            userId: userData?.id,
            userName: userData?.name,
            userRole: userData?.role,
            hasToken: !!userToken,
            tokenLength: userToken?.length
        });

        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('[AuthContext] User and token saved to state and localStorage');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const isAuthenticated = !!token;
    const isJobSeeker = user?.role === 'JOB_SEEKER';
    const isRecruiter = user?.role === 'RECRUITER';

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isJobSeeker,
        isRecruiter
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
