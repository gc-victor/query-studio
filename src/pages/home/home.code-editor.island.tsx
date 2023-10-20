import h from "h";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import {
    Tabulator,
    EditModule,
    SortModule,
    ColumnDefinition,
} from "tabulator-tables";

import { fetcher } from "pages/fetcher";
import { databaseStorage, databasesStorage, queryStorage } from "pages/storage";

import {
    EVENT_REMOVE_CODE_EDITOR_CONTENT,
    ID_CODE_EDITOR,
    ID_CODE_EDITOR_CODE,
    ID_CODE_EDITOR_CONTENT,
    ID_CODE_EDITOR_LINE_NUMBER,
    ID_DATA_TABLE,
} from "./home.constants";
import { CodeEditor } from "./home.code-editor";
import { API_LOGOUT, API_QUERY } from "shared.constants";

Tabulator.registerModule([EditModule, SortModule]);

function HomeCodeEditor() {
    const value = queryStorage.get() ?? "";

    return (
        <CodeEditor
            value={value}
            onInput={update}
            onKeydown={onKeydown}
            onSubmit={onSubmit}
        />
    );
}

const app = document.getElementById(ID_CODE_EDITOR);
app?.parentNode?.replaceChild(<HomeCodeEditor />, app);

(
    document.getElementById(ID_CODE_EDITOR_CONTENT) as HTMLTextAreaElement
).addEventListener(
    EVENT_REMOVE_CODE_EDITOR_CONTENT as unknown as keyof DocumentEventMap,
    update as EventListener,
);

update();

function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        onSubmit(e);
    } else {
        indentation(e);
    }
}

function onSubmit(e: Event) {
    e.preventDefault();

    removeTable();

    const textarea = document.getElementById(
        ID_CODE_EDITOR_CONTENT,
    ) as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const query =
        selectedText ||
        textarea.value
            .replace(/--.*|\/\*[\s\S]*?\*\//g, "")
            .replace(/\s+/g, " ")
            .replace(/\n+/g, "")
            .trim();

    fetchQuery(query);
}

function removeTable() {
    const table = document.getElementById(ID_DATA_TABLE) as HTMLUListElement;

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}

async function table(data: { [key: string]: unknown }[]) {
    const table = new Tabulator(`#${ID_DATA_TABLE}`, {
        autoColumns: true,
        autoColumnsDefinitions: (definitions?: ColumnDefinition[]) => {
            for (const column of definitions || []) {
                column.editor = true;
            }

            return definitions || [];
        },
        data,
        layout: "fitDataStretch",
        maxHeight: "100%",
    });

    table.on("cellEdited", function (cell) {
        const field = cell.getField();
        const initialValue = cell.getInitialValue();
        const value = cell.getValue();
        const row = cell.getRow().getData();
        const keys = Object.keys(cell.getRow().getData());
        const where = keys.reduce((acc, key, index) => {
            return (
                acc +
                `${key} = '${key === field ? initialValue : row[key]}'${
                    index === keys.length - 1 ? "" : " AND "
                }`
            );
        }, "");
        const name = getTableName();

        if (!name) {
            table.setData([
                {
                    error: "Not possible to get table name. Please, simplify the query",
                },
            ]);

            return;
        }

        fetchQuery(`UPDATE ${name} SET ${field} = '${value}' WHERE ${where}`);
    });
}

function getTableName() {
    let query = queryStorage.get() ?? "";
    query = query
        .replace(/--.*|\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\n+/g, "")
        .trim();
    const regex = /^SELECT\s+.*?\s+FROM\s+(\w+)/i;
    const match = query.match(regex);

    return match ? match[1] : "";
}

function fetchQuery(query: string) {
    fetcher(API_QUERY, {
        method: "POST",
        body: JSON.stringify({
            db_name: databaseStorage.get(),
            query,
        }),
    }).then(async (res) => {
        if (res.ok) {
            const json = await res.json();
            const data = json.data;

            table(
                !data.length
                    ? [{ data: "There is no data for this query." }]
                    : data,
            );
        } else if (res.status === 401) {
            databaseStorage.clear();
            databasesStorage.clear();
            queryStorage.clear();

            window.location.href = API_LOGOUT;
        } else {
            const error = await res.text();

            table([{ error }]);
        }
    });
}

function indentation(e: KeyboardEvent) {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value ?? "";

    if (e.key === "Tab") {
        const indentation = "\t";

        e.preventDefault();

        if (target.selectionStart === target.selectionEnd) {
            if (!e.shiftKey) {
                // TODO: replace execCommand as is deprecated
                document.execCommand("insertText", false, indentation);
            } else {
                if (
                    target.selectionStart > 0 &&
                    value[target.selectionStart - 1] === indentation
                ) {
                    // TODO: replace execCommand as is deprecated
                    document.execCommand("delete");
                }
            }
        } else {
            let selStart = target.selectionStart;
            let selEnd = target.selectionEnd;
            while (selStart > 0 && value[selStart - 1] !== "\n") selStart--;
            while (
                selEnd > 0 &&
                value[selEnd - 1] !== "\n" &&
                selEnd < value.length
            )
                selEnd++;

            const lines = value.substring(selStart, selEnd).split("\n");

            for (let i = 0; i < lines.length; i++) {
                if (i === lines.length - 1 && lines[i].length === 0) continue;

                if (e.shiftKey) {
                    if (lines[i].startsWith(indentation))
                        lines[i] = lines[i].substring(1);
                    else if (lines[i].startsWith("    "))
                        lines[i] = lines[i].substring(4);
                } else lines[i] = indentation + lines[i];
            }

            const text = lines.join("\n");

            target.value =
                value.substring(0, selStart) + text + value.substring(selEnd);
            target.selectionStart = selStart;
            target.selectionEnd = selStart + text.length;

            update();
        }
    }
}

function update() {
    const el = document.getElementById(
        ID_CODE_EDITOR_CONTENT,
    ) as HTMLTextAreaElement;
    const value = el.value ?? "";
    const lines = value.match(/(\r\n|\n|\r)/g) || [];

    if (el && el.parentNode instanceof HTMLElement) {
        el.parentNode.dataset.replicatedValue = value;

        el.style.height = "224px";
        el.style.height = `${el.scrollHeight}px`;
        el.rows = Math.max(10, el.rows + (el.rows >= 10 ? 1 : -1));
    }

    const codeEditorCode = document.getElementById(ID_CODE_EDITOR_CODE);

    if (codeEditorCode) {
        hljs.registerLanguage("sql", sql);
        const highlightedCode = hljs.highlight(value, {
            language: "sql",
        }).value;

        codeEditorCode.innerHTML = highlightedCode;
    }

    const lineNumberEl = document.getElementById(
        ID_CODE_EDITOR_LINE_NUMBER,
    ) as HTMLElement;

    if (lineNumberEl) {
        lineNumberEl.innerHTML = lines
            .concat(["" as never], ["" as never])
            .join("<li>") as string;
    }

    queryStorage.set(value);
}
