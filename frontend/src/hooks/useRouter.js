import { useEffect, useState } from 'react';

export function useRouter() {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const onPop = () => setPath(window.location.pathname);
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    function navigate(to) {
        if (to !== window.location.pathname) {
            window.history.pushState({}, '', to);
            setPath(to);
        }
    }

    return { path, navigate };
}
