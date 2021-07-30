import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): readonly [T | undefined] {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return [ref.current] as const;
}
