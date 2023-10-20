// @see: https://web.dev/articles/optimize-long-tasks?utm_source=devtools
export async function queueTasks(tasks: Array<() => void>) {
    while (tasks.length > 0) {
        const task = tasks.shift();

        task?.();

        await yieldToMain();
    }
}

function yieldToMain() {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    });
}