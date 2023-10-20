import { databaseStorage, databasesStorage, queryStorage } from "pages/storage";
import { API_LOGOUT } from "shared.constants";

import { ID_SIDEBAR_BUTTON_LOGOUT } from "./home.constants";

document.getElementById(ID_SIDEBAR_BUTTON_LOGOUT)?.addEventListener("click", () => {
    databaseStorage.clear();
    databasesStorage.clear();
    queryStorage.clear();

    window.location.href = API_LOGOUT;
});