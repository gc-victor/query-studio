import { QUERY_STUDIO_CLIENT_URL } from "./http.constants";

export function client(path: string): string {
    return `${QUERY_STUDIO_CLIENT_URL}${path}`;
}
