class SessionStorageWrapper {
    private key: string;
    private storage: Storage;

    constructor(key: string) {
        this.key = key;
        this.storage = window.sessionStorage;
    }

    public set(value: string): void {
        this.storage.setItem(this.key, value);
    }

    public get(): string | null {
        return this.storage.getItem(this.key);
    }

    public clear(): void {
        this.storage.clear();
    }
}

export const databasesStorage = new SessionStorageWrapper("databases");
export const databaseStorage = new SessionStorageWrapper("database");
export const queryStorage = new SessionStorageWrapper("query");
