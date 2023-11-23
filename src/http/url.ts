import { QUERY_STUDIO_QUERY_SERVER } from "./constants";

export function url(path: string): string {
    return `${QUERY_STUDIO_QUERY_SERVER}${path}`;
}
