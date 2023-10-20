import { Fragment, h } from "h";

export function Input({
    description,
    error,
    id,
    label,
    value,
    ...rest
}: {
    id: string;
    label: string;
    description?: string;
    value?: string;
    error?: string;
    [key: string]: unknown;
}) {
    return (
        <>
            <label for={id} class="sr-only">
                {label}
            </label>
            <input
                id={id}
                class={`
                  bg-transparent
                    border
                    border-slate-500
                    h-8
                    px-2
                    placeholder-slate-500
                    rounded-sm
                    text-xs
                    w-full
                `}
                name={id}
                key={id}
                onClick={(e: Event) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                }
                value={value || ""}
                {...rest}
            />
        </>
    );
}
