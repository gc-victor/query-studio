import h from "h";

import { ID_LOGIN_FORM } from "./login.constants";

type LoginFormProps = {
    disabled?: boolean;
    email?: string;
    error?: string;
    onInput?: (e: Event) => void;
    onSubmit?: (e: Event) => void;
    password?: string;
};

export function LoginForm({
    disabled,
    email,
    error,
    onInput,
    onSubmit,
    password,
}: LoginFormProps) {
    return (
        <form
            id={ID_LOGIN_FORM}
            class="mt-6 px-6"
            onInput={onInput}
            onSubmit={onSubmit}
        >
            <Input
                id="email"
                label="Email"
                autocomplete="email"
                description="Use the same email as on your server."
                error={error || ""}
                placeholder="Your email address"
                value={email || ""}
            />
            <Input
                id="password"
                label="Password"
                autocomplete="password"
                description="Use the same password as on your server."
                error={error || ""}
                placeholder="********"
                type="password"
                value={password || ""}
            />
            <button
                class={`
                    bg-slate-600
                    hover:bg-slate-700
                    focus:bg-slate-700
                    disabled:bg-slate-400
                    disabled:cursor-not-allowed
                    block
                    border
                    border-slate-700
                    h-12
                    mt-2
                    rounded-lg
                    text-white
                    w-full
                `}
                type="submit"
                {...(disabled ? { disabled } : {})}
            >
                Login
            </button>
            <p class="mt-4 text-sm">
                Welcome to Query Studio! Your online Query editor.
            </p>
            <p class="mt-2 text-sm">
                The emails and passwords are the same as those you use on your
                server. Please note that you must be an admin to use all the
                available features.
            </p>
        </form>
    );
}

function Input({
    description,
    error,
    id,
    label,
    value,
    ...rest
}: {
    description: string;
    error: string;
    id: string;
    label: string;
    value: string;
    [key: string]: unknown;
}) {
    return (
        <p class="pb-6 relative">
            <label for={id} class="block font-bold w-full">
                {label}
            </label>
            <input
                id={id}
                class={`
                required:[&:placeholder-shown]:bg-white
                invalid:bg-red-100
                    border
                    border-slate-700
                    h-12
                    mt-2
                    px-4
                    rounded-lg
                    text-slate-600
                    w-full
                `}
                name={id}
                key={id}
                onClick={(e: Event) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                }
                value={value || ""}
                {...(error
                    ? { "aria-invalid": true, "aria-errormessage": `err-${id}` }
                    : {})}
                {...rest}
            />
            <span
                id={`err-${id}`}
                class={`
                absolute
                block
                bottom-0
                text-sm
                ${error ? "text-red-400" : "text-slate-400"}
            `}
            >
                {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                <span
                    class={`
                    w-2
                    h-2
                    bg-red-400
                    rounded-full
                    mr-1
                    inline-block
                    ${!error ? "hidden" : ""}
                `}
                ></span>
                {error || description}
            </span>
        </p>
    );
}
