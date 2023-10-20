import { h } from "h";

import {
    ID_SIDEBAR_ADD_DATABASE,
    ID_SIDEBAR_DATABASES,
    ID_SIDEBAR_DATABASE_CONTAINER,
} from "./home.constants";
import { Input } from "./components/input";

interface SidebarDatabasesProps {
    checked?: string;
    databases?: string[];
    onChange?: (e: InputEvent) => void;
    onRemove?: (e: Event) => void;
    onSubmit?: (e: SubmitEvent) => void;
    update?: number;
}

export function SidebarDatabases({
    databases,
    checked,
    onChange,
    onRemove,
    onSubmit,
}: SidebarDatabasesProps) {
    return (
        <div id={ID_SIDEBAR_DATABASES} class="text-xs">
            <div class="flex items-center justify-between">
                <h2>Databases</h2>
                {/* <svg className="inline" height="16" width="16">
                    <title>Add database</title>
                    <use href="#add-circle-icon" height="16" width="16" />
                </svg> */}
            </div>
            <form class="mt-2" onSubmit={onSubmit}>
                <label htmlFor={ID_SIDEBAR_ADD_DATABASE} className="sr-only">
                    Add a database
                </label>
                <Input
                    id={ID_SIDEBAR_ADD_DATABASE}
                    label="Add a database"
                    placeholder="Database name"
                />
                <button
                    class={`
                    bg-slate-800
                    hover:bg-slate-900
                    focus:bg-slate-900
                    disabled:bg-slate-400
                    disabled:cursor-not-allowed
                    block
                    border
                    border-slate-500
                    h-8
                    mt-1
                    rounded-sm
                    text-white
                    text-xs
                    w-full
                `}
                    type="submit"
                >
                    Add
                </button>
                <ul id={ID_SIDEBAR_DATABASE_CONTAINER}>
                    {databases?.map((value) => (
                        <li class="mt-2 relative">
                            <label class="cursor-pointer text-slate-300">
                                <span>
                                    <input
                                        class="sr-only peer/database"
                                        type="radio"
                                        name="database"
                                        checked={checked && value === checked}
                                        onChange={onChange}
                                        value={value}
                                        key={`radio-database-${value}`}
                                    />
                                    <span
                                        class={`
                                    bg-slate-700
                                    block
                                    border
                                    border-slate-500
                                    hover:bg-slate-900
                                    p-1
                                    peer-checked/database:text-white
                                    peer-checked/database:bg-slate-900
                                    peer-checked/database:hover:bg-slate-950
                                    rounded-sm
                                    truncate
                                `}
                                    >
                                        <svg
                                            className="inline"
                                            height="16"
                                            width="16"
                                        >
                                            <title>Select database</title>
                                            <use
                                                href="#database-icon"
                                                height="16"
                                                width="16"
                                            />
                                        </svg>
                                        <span class="pl-2" data-value={value}>
                                            {value}
                                        </span>
                                    </span>
                                </span>
                            </label>
                            <button
                                class={`
                                absolute
                                top-1
                                right-1
                                text-slate-300
                            `}
                                type="button"
                                key={`remove-${value}`}
                                onClick={onRemove}
                            >
                                <svg className="inline" height="16" width="16">
                                    <title>Remove database</title>
                                    <use
                                        href="#remove-circle-icon"
                                        height="16"
                                        width="16"
                                    />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </form>
        </div>
    );
}
