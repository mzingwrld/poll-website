import { useCallback } from 'react';

/**
 * M.toast from materializecss
 * @returns function that provides functionality of UI notifications
 */
export const useMessage = () => useCallback((text: string) => {
    if (window.M && text) {
        window.M.toast({ html: text })
    }
}, []);
