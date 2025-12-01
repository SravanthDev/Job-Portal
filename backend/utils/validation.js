
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateRequired = (fields, data) => {
    const missing = [];

    for (const field of fields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            missing.push(field);
        }
    }

    return missing;
};

export const validateRole = (role) => {
    return ['JOB_SEEKER', 'RECRUITER'].includes(role);
};

export const validateApplicationStatus = (status) => {
    return ['PENDING', 'SHORTLISTED', 'REJECTED'].includes(status);
};
