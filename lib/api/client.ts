
export async function apiFetch<T>(path : string, options : RequestInit = {}): Promise<T> {

    const response = await fetch(path, {
        ...options,
        headers: {
            "Content-Type":"application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        let message = `${response.status}`;
        try {
            const errorMessage = await response.json();
            message = errorMessage.Message ?? message;
            
        } catch (error) {
            
        }

        throw new Error(message);
    }

    return response.json();
    
}
