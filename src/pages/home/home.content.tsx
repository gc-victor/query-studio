import h from "h";

import { HomeSvg } from "./home.svg";
import { CodeEditor } from "./home.code-editor";
import { SidebarDatabases } from "./home.sidebar.databases";
import { SidebarTables } from "./home.sidebar.tables";
import { SidebarLogout } from "./home.sidebar.logout";
import { ID_DATA_TABLE, ID_SIDEBAR } from "./home.constants";

export function homeContent() {
    return (
        <div>
            <header class="absolute p-3 right-1 top-1">
                <h1 class="text-white">
                    <svg height="24" width="64">
                        <title>Query Logo</title>
                        <use href="#query-logo" height="24" width="64" />
                    </svg>
                </h1>
            </header>
            <aside class="border-b-2 border-l border-r border-slate-600 fixed left-0 z-1 w-56 h-screen">
                <div
                    id={ID_SIDEBAR}
                    class="bg-slate-950 h-full overflow-y-auto px-1 py-2"
                >
                    <SidebarLogout />
                    <hr class="border-b-0 border-slate-500 my-3" />
                    <SidebarDatabases />
                    <SidebarTables />
                </div>
                {/* TODO: Add at the bottom links to the documentation, github, discord, ... */}
            </aside>
            <div>
                <CodeEditor />
                {/* Table */}
                <div id={ID_DATA_TABLE} class="ml-56 height-full" />
            </div>
            <HomeSvg />
        </div>
    );
}
