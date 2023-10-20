import h from "h";
import p from "p";
import { signal, effect, batch } from "usignal";

import { fetcher } from "pages/fetcher";
import { databaseStorage, databasesStorage, queryStorage } from "pages/storage";
import { API_LOGIN, PAGE_HOME } from "shared.constants";

import { LoginForm } from "./login-form";
import { ID_LOGIN_FORM } from "./login.constants";

databaseStorage.clear();
databasesStorage.clear();
queryStorage.clear();

const email = signal("");
const password = signal("");
const error = signal("");
const disabled = signal(true);

function Login() {
    return (
        <LoginForm
            disabled={disabled.value}
            email={email.value}
            error={error.value}
            onSubmit={onSubmit}
            onInput={onInput}
            password={password.value}
        />
    );
}

const onSubmit = (e: Event) => {
    e.preventDefault();

    disabled.value = true;

    fetcher(API_LOGIN, {
        method: "POST",
        body: new FormData(e.target as HTMLFormElement),
    }).then(async (res) => {
        if (res.ok) {
            window.location.href = PAGE_HOME;
        } else {
            const message = await res.text();

            batch(() => {
                error.value = message;
                disabled.value = false;
            });

            queueMicrotask(() => {
                const emailInput = document.querySelector(
                    'input[name="email"]',
                ) as HTMLInputElement;
                const passwordInput = document.querySelector(
                    'input[name="password"]',
                ) as HTMLInputElement;

                emailInput.setCustomValidity(message);
                emailInput.reportValidity();

                passwordInput.setCustomValidity(message);
                passwordInput.reportValidity();

                // NOTE: avoids the native tooltip
                passwordInput.blur();
                passwordInput.focus();
            });
        }
    });
};

const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;

    target.setCustomValidity("");
    target.reportValidity();

    batch(() => {
        const emailInput = document.querySelector(
            'input[name="email"]',
        ) as HTMLInputElement;
        const passwordInput = document.querySelector(
            'input[name="password"]',
        ) as HTMLInputElement;

        email.value = emailInput.value;
        password.value = passwordInput.value;
        disabled.value = !emailInput.value || !passwordInput.value;
        error.value = "";
    });
};

effect(() => p(document.getElementById(ID_LOGIN_FORM) as Node, <Login />));
