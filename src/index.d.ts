/// <reference lib="dom" />

declare global {
    // NOTE: To avoid editor ts error
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: unknown;
        }
    }

    // NOTE: To avoid editor ts error
    namespace React {
        function createElement(tag: string, props?: unknown, ...children: unknown[]): unknown;
    }

    interface Global {
        [key: string]: unknown;
    }

    declare module 'h/document';

    // biome-ignore lint/style/noVar: <explanation>
    var span
}

export { };