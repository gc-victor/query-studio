export async function fetcher(url: string, options?: RequestInit): Promise<Response> {
    const cookie = document.cookie;

    const headers = new Headers(options?.headers);

    if (cookie) {
        headers.append('cookie', cookie);
    }

    return await fetch(url, { ...options, headers });
}

