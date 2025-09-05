import React from "react";

export function isDarkModeFunc(): boolean {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(mediaQuery.matches);

            const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
            mediaQuery.addEventListener('change', handler);

            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, []);

    return isDarkMode;
}