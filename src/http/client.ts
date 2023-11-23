import { QUERY_STUDIO_CLIENT_URL } from "./constants";

export function client(path: string): string {
    return `${QUERY_STUDIO_CLIENT_URL}${path}`;
}
