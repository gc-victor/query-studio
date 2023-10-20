import h from "h";
import p from "p";
import { effect, signal } from "usignal";

import { queueTasks } from "pages/queueTasks";
import { databaseStorage, databasesStorage, queryStorage } from "pages/storage";

import { SidebarDatabases } from "./home.sidebar.databases";
import {
    DEFAULT_CONFIG_DB,
    ID_CODE_EDITOR_CONTENT,
    ID_CODE_EDITOR_INFO_DATABASE,
    ID_DATA_TABLE,
    ID_SIDEBAR,
    ID_SIDEBAR_ADD_DATABASE,
    ID_SIDEBAR_DATABASES,
    ID_SIDEBAR_DATABASE_CONTAINER,
} from "./home.constants";
import { removeCodeEditorContentEvent } from "./home.events";

const update = signal(0);

function HomeSidebarDatabases() {
    const checked = databaseStorage.get() ?? "";
    const databases = (databasesStorage.get() ?? "").split(",");

    return (
        <SidebarDatabases
            checked={checked}
            databases={databases}
            onChange={onChange}
            onRemove={onRemove}
            onSubmit={onSubmit}
            update={update.value}
        />
    );
}

initializeStore();

effect(() => {
    p(
        document.getElementById(ID_SIDEBAR_DATABASES) as Node,
        <HomeSidebarDatabases />,
    );
});

function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const database = formData.get(ID_SIDEBAR_ADD_DATABASE) as string;

    databaseStorage.set(database);

    const databases = databasesStorage.get() ?? "";
    const hasDatabase = databases.includes(",") && databases !== database;
    const hasCommaPrefix = databases.includes(`,${database}`);
    const hasCommaSuffix = databases.includes(`${database},`);

    if (!hasDatabase || (!hasCommaPrefix && !hasCommaSuffix)) {
        databasesStorage.set(`${database},${databases}`);
    }

    (
        document.getElementById(ID_SIDEBAR_ADD_DATABASE) as HTMLInputElement
    ).value = "";

    queueTasks([
        updateCodeEditorInfoDatabase,
        forceUpdate,
        removeCodeEditorContent,
    ]);
}

function onRemove(e: Event) {
    const target = e.target as HTMLInputElement;
    const button =
        target instanceof HTMLButtonElement ? target : target.closest("button");
    const value = (
        button?.previousElementSibling?.querySelector(
            "[data-value]",
        ) as HTMLElement
    ).dataset.value;

    if (value === DEFAULT_CONFIG_DB) {
        return;
    }

    const databases = (databasesStorage.get() ?? "")
        .split(",")
        .filter((v) => v !== value);

    databasesStorage.set(databases.join(","));

    if (databaseStorage.get() === value) {
        databaseStorage.set(databases[0]);
    }

    queueTasks([
        updateCodeEditorInfoDatabase,
        forceUpdate,
        removeCodeEditorContent,
    ]);
}

function onChange(e: Event) {
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    const database = target.value;

    const databases = (databasesStorage.get() ?? "")
        .split(",")
        .filter((v) => v !== database);
    databases.unshift(database);
    databasesStorage.set(databases.join(","));

    databaseStorage.set(database);

    queueTasks([
        removeList,
        forceUpdate,
        updateCodeEditorInfoDatabase,
        removeCodeEditorContent,
        removeTable,
    ]);

    function removeList() {
        // NOTE: It is needed to remove them before re-order the items list
        const container = document.getElementById(
            ID_SIDEBAR_DATABASE_CONTAINER,
        ) as HTMLUListElement;

        // NOTE: avoid refresh scrollbar
        container.style.height = `${container.offsetHeight}px`;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const sidebar = document.getElementById(ID_SIDEBAR) as HTMLUListElement;

        sidebar.scrollTop = 0;
    }

    function removeTable() {
        const table = document.getElementById(
            ID_DATA_TABLE,
        ) as HTMLUListElement;

        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    }
}

// Initialize Store
function initializeStore() {
    databaseStorage.set(databaseStorage.get() ?? DEFAULT_CONFIG_DB);
    databasesStorage.set(
        databasesStorage.get() ?? databaseStorage.get() ?? DEFAULT_CONFIG_DB,
    );

    updateCodeEditorInfoDatabase();
}

function removeCodeEditorContent() {
    const editor_content = document.getElementById(
        ID_CODE_EDITOR_CONTENT,
    ) as HTMLTextAreaElement;
    editor_content.value = "";
    queryStorage.set("");

    editor_content.dispatchEvent(removeCodeEditorContentEvent);
}

function updateCodeEditorInfoDatabase() {
    (
        document.getElementById(ID_CODE_EDITOR_INFO_DATABASE) as HTMLElement
    ).textContent = databaseStorage.get() ?? DEFAULT_CONFIG_DB;
}

function forceUpdate() {
    update.value++;
}
