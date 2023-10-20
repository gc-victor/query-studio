import h from "h";

import { ID_SIDEBAR_BUTTON_LOGOUT } from "./home.constants";

export function SidebarLogout() {
    return (
        <p>
            <button id={ID_SIDEBAR_BUTTON_LOGOUT} class="text-xs" type="button">
                <span class="sr-only">Logout</span>
                <svg className="inline" height="20" width="20">
                    <title>Logout</title>
                    <use href="#logout-icon" height="20" width="20" />
                </svg>
            </button>
        </p>
    );
}
