export function get<T>(url: string, token?: string): Promise<T> {
    const headers: HeadersInit = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch(
        url,
        {
            method: 'GET',
            headers,
        },
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json() as Promise<T>;
        });
}

export function post<T>(url: string, token: string, data: any): Promise<T> {
    const headers: HeadersInit = {};
    headers['Content-Type'] = 'application/json';
    headers.Authorization = `Bearer ${token}`;

    return fetch(
        url,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers,
        },
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json() as Promise<T>;
        });
}
