import h from "h";
import { LoginForm } from "./login-form";
import { Svg } from "pages/svg";

export function loginContent() {
    return (
        <div class="flex items-center h-full justify-center">
            <div class="max-w-md md:w-[448px]">
                <h1 class="flex justify-center">
                    <svg height="64" width="173">
                        <title>Query Logo</title>
                        <use href="#query-logo" height="64" width="173" />
                    </svg>
                </h1>
                <LoginForm />
                <Svg />
            </div>
        </div>
    );
}
