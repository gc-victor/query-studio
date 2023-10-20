import h from "h";

import {
    ID_CODE_EDITOR,
    ID_CODE_EDITOR_CODE,
    ID_CODE_EDITOR_CONTENT,
    ID_CODE_EDITOR_INFO_DATABASE,
    ID_CODE_EDITOR_LINE_NUMBER,
} from "./home.constants";

interface CodeEditorProps {
    onInput?: (e: InputEvent) => void;
    onKeydown?: (e: KeyboardEvent) => void;
    onSubmit?: (e: Event) => void;
    value?: string;
}

export function CodeEditor({
    onInput,
    onKeydown,
    onSubmit,
    value,
}: CodeEditorProps) {
    return (
        <form
            id={ID_CODE_EDITOR}
            class="ml-56"
            onInput={onInput}
            onKeydown={onKeydown}
            onSubmit={onSubmit}
        >
            <div class="border-b border-slate-600 grid overflow-hidden relative">
                <ul
                    id={ID_CODE_EDITOR_LINE_NUMBER}
                    class={`
                        c-code-editor-line-number
                        absolute
                        counter-reset
                        font-mono
                        leading-5
                        px-3
                        py-4
                        text-white
                        w-10
                    `}
                >
                    {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                    <li></li>
                </ul>
                <label htmlFor={ID_CODE_EDITOR_CONTENT} className="sr-only">
                    Code editor
                </label>
                <textarea
                    id={ID_CODE_EDITOR_CONTENT}
                    name="text"
                    className={`
                        code-editor-textarea
                        font-fira
                        selection:bg-slate-500
                        bg-slate-900
                        border-0
                        text-white
                        grid-row-1
                        grid-col-1
                        leading-5
                        overflow-hidden
                        p-4
                        pl-10
                        resize-none
                        whitespace-pre
                        `}
                    placeholder="Run your queries using Ctrl+Enter or Command+Enter"
                    rows={10}
                    spellcheck="false"
                >
                    {value}
                </textarea>
                <pre>
                    <code
                        id={ID_CODE_EDITOR_CODE}
                        class="code-editor-code language-sql p-4 pl-10"
                        data-language="sql"
                    />
                </pre>
            </div>
            <p className="border-b border-slate-600 text-xs p-2 flex justify-between">
                <span
                    id={ID_CODE_EDITOR_INFO_DATABASE}
                    className="text-slate-400"
                >
                    TODO: add current DB
                </span>
                <span>
                    <span className="text-slate-400">⌃ + ↵ | ⌘ + ↵</span>
                    <button
                        class={`
                            bg-slate-800
                            hover:bg-slate-900
                            focus:bg-slate-900
                            disabled:bg-slate-400
                            disabled:cursor-not-allowed
                            border
                            border-slate-500
                            h-5
                            ml-4
                            px-5
                            rounded-sm
                            text-white
                            text-xs
                        `}
                        type="submit"
                    >
                        Run
                    </button>
                </span>
            </p>
        </form>
    );
}
