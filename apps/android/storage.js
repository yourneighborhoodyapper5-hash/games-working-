/*
 * Kairo Android
 * Persistent browser storage layer
 *
 * Uses:
 *   IndexedDB -> emulator data
 *   localStorage -> tiny preferences
 *
 * Everything is stored locally for this browser/origin.
 */

const KAIRO_ANDROID_DB = "kairo-android";
const KAIRO_ANDROID_VERSION = 1;

const STORES = {
    SYSTEM: "system",
    FILES: "files",
    APPS: "apps",
    SNAPSHOTS: "snapshots",
    MEDIA: "media"
};

let dbPromise = null;


/* =========================================================
   DATABASE
========================================================= */

function openDatabase() {

    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {

        const request = indexedDB.open(
            KAIRO_ANDROID_DB,
            KAIRO_ANDROID_VERSION
        );

        request.onupgradeneeded = event => {

            const db = event.target.result;

            for (const storeName of Object.values(STORES)) {

                if (!db.objectStoreNames.contains(storeName)) {

                    db.createObjectStore(
                        storeName,
                        { keyPath: "id" }
                    );

                }

            }

        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

    });

    return dbPromise;
}


/* =========================================================
   GENERIC OPERATIONS
========================================================= */

async function put(storeName, id, value) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                storeName,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request =
            store.put({
                id,
                value,
                updatedAt: Date.now()
            });

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}


async function get(storeName, id) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                storeName,
                "readonly"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request =
            store.get(id);

        request.onsuccess = () => {

            resolve(
                request.result
                    ? request.result.value
                    : null
            );

        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}


async function remove(storeName, id) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                storeName,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request =
            store.delete(id);

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}


async function getAll(storeName) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                storeName,
                "readonly"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request =
            store.getAll();

        request.onsuccess = () => {

            resolve(
                request.result.map(
                    item => ({
                        id: item.id,
                        value: item.value,
                        updatedAt: item.updatedAt
                    })
                )
            );

        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}


/* =========================================================
   SYSTEM SETTINGS
========================================================= */

const AndroidStorage = {

    async setSetting(name, value) {

        return put(
            STORES.SYSTEM,
            "setting:" + name,
            value
        );

    },

    async getSetting(name, fallback = null) {

        const value =
            await get(
                STORES.SYSTEM,
                "setting:" + name
            );

        return value === null
            ? fallback
            : value;

    },


    /* =====================================================
       INSTALLED APPS
    ===================================================== */

    async installApp(app) {

        return put(
            STORES.APPS,
            app.id,
            {
                id: app.id,
                name: app.name,
                packageName:
                    app.packageName || "",
                version:
                    app.version || "1.0",
                installedAt:
                    app.installedAt || Date.now(),
                data: app.data || {}
            }
        );

    },


    async getInstalledApps() {

        const entries =
            await getAll(STORES.APPS);

        return entries.map(
            entry => entry.value
        );

    },


    async getInstalledApp(id) {

        return get(
            STORES.APPS,
            id
        );

    },


    async uninstallApp(id) {

        return remove(
            STORES.APPS,
            id
        );

    },


    async updateAppData(id, data) {

        const app =
            await this.getInstalledApp(id);

        if (!app) {
            return false;
        }

        app.data = data;
        app.updatedAt = Date.now();

        return put(
            STORES.APPS,
            id,
            app
        );

    },


    /* =====================================================
       FILE STORAGE
    ===================================================== */

    async saveFile(path, data, metadata = {}) {

        return put(
            STORES.FILES,
            path,
            {
                path,
                data,
                metadata,
                updatedAt: Date.now()
            }
        );

    },


    async getFile(path) {

        return get(
            STORES.FILES,
            path
        );

    },


    async deleteFile(path) {

        return remove(
            STORES.FILES,
            path
        );

    },


    async listFiles() {

        const entries =
            await getAll(STORES.FILES);

        return entries.map(
            entry => entry.value
        );

    },


    /* =====================================================
       VM SNAPSHOTS
    ===================================================== */

    async saveSnapshot(name, state) {

        return put(
            STORES.SNAPSHOTS,
            name,
            {
                name,
                state,
                savedAt: Date.now()
            }
        );

    },


    async getSnapshot(name) {

        return get(
            STORES.SNAPSHOTS,
            name
        );

    },


    async deleteSnapshot(name) {

        return remove(
            STORES.SNAPSHOTS,
            name
        );

    },


    async listSnapshots() {

        const entries =
            await getAll(STORES.SNAPSHOTS);

        return entries.map(
            entry => entry.value
        );

    },


    /* =====================================================
       MEDIA / DISK IMAGES
    ===================================================== */

    async saveMedia(id, data, metadata = {}) {

        return put(
            STORES.MEDIA,
            id,
            {
                id,
                data,
                metadata,
                savedAt: Date.now()
            }
        );

    },


    async getMedia(id) {

        return get(
            STORES.MEDIA,
            id
        );

    },


    async deleteMedia(id) {

        return remove(
            STORES.MEDIA,
            id
        );

    },


    /* =====================================================
       DATABASE INFORMATION
    ===================================================== */

    async getStorageSummary() {

        const [
            files,
            apps,
            snapshots,
            media
        ] = await Promise.all([

            getAll(STORES.FILES),
            getAll(STORES.APPS),
            getAll(STORES.SNAPSHOTS),
            getAll(STORES.MEDIA)

        ]);

        return {

            files: files.length,
            installedApps: apps.length,
            snapshots: snapshots.length,
            mediaItems: media.length

        };

    }

};


/* =========================================================
   EXPORT / IMPORT
========================================================= */

async function exportAndroidData() {

    const data = {

        version: 1,

        exportedAt:
            new Date().toISOString(),

        system:
            await getAll(STORES.SYSTEM),

        files:
            await getAll(STORES.FILES),

        apps:
            await getAll(STORES.APPS),

        snapshots:
            await getAll(STORES.SNAPSHOTS)

    };

    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "kairo-android-backup.json";

    link.click();

    URL.revokeObjectURL(url);

}


/*
 * Imports the JSON backup generated above.
 *
 * Media/disk images are intentionally not included
 * in this first backup format because they can be huge.
 * We'll add proper binary backup support later.
 */

async function importAndroidData(file) {

    const text =
        await file.text();

    const backup =
        JSON.parse(text);

    if (
        !backup ||
        backup.version !== 1
    ) {

        throw new Error(
            "Unsupported Kairo Android backup."
        );

    }


    const restoreEntries =
        async (
            storeName,
            entries
        ) => {

            if (!Array.isArray(entries)) {
                return;
            }

            for (const entry of entries) {

                await put(
                    storeName,
                    entry.id,
                    entry.value
                );

            }

        };


    await restoreEntries(
        STORES.SYSTEM,
        backup.system
    );

    await restoreEntries(
        STORES.FILES,
        backup.files
    );

    await restoreEntries(
        STORES.APPS,
        backup.apps
    );

    await restoreEntries(
        STORES.SNAPSHOTS,
        backup.snapshots
    );

}


/* =========================================================
   GLOBAL EXPORT
========================================================= */

window.AndroidStorage =
    AndroidStorage;

window.exportAndroidData =
    exportAndroidData;

window.importAndroidData =
    importAndroidData;
