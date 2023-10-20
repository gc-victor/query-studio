import { internal_server_error } from "./responses";

export const getter = {
    arrayBuffer: 'arrayBuffer',
    blob: 'blob',
    formData: 'formData',
    json: 'json',
    text: 'text',
} as const;

export type Getter = typeof getter[keyof typeof getter]

export async function getBody(res: Body, getter: Getter): Promise<unknown> {
    try {
        if (getter === 'arrayBuffer') {
            return await res.arrayBuffer();
        } else if (getter === 'blob') {
            return await res.blob();
        } else if (getter === 'formData') {
            return await res.formData();
        } else if (getter === 'json') {
            return await res.json();
        } else if (getter === 'text') {
            return await res.text();
        }
    } catch (error) {
        throw internal_server_error(error);
    }
}