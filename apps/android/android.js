/*
 * Kairo Android
 * v86 Android emulator layer
 *
 * Folder structure:
 *
 * /
 * ├── index.html
 * ├── storage.js
 * ├── android.js
 * └── v86/
 *     ├── build/
 *     ├── src/
 *     └── ...
 */

const ANDROID_ISO =
    "https://github.com/yourneighborhoodyapper5-hash/games-working-/releases/download/Iso/android-x86-4.4-r1.iso";

let androidEmulator = null;


/* =========================================================
   ANDROID EMULATOR
========================================================= */

async function startAndroid() {

    if (androidEmulator) {
        console.log("Android is already running.");
        return androidEmulator;
    }

    const screen =
        document.getElementById("android-screen");

    if (!screen) {
        throw new Error(
            "Missing #android-screen element."
        );
    }


    /*
     * v86 requires its emulator library.
     *
     * Make sure your v86 folder contains:
     *
     * build/libv86.js
     *
     * If your build uses a different location,
     * change the script path in index.html.
     */

    if (typeof V86Starter === "undefined") {

        throw new Error(
            "v86 is not loaded. Make sure libv86.js is loaded before android.js."
        );

    }


    console.log(
        "Starting Kairo Android..."
    );


    androidEmulator =
        new V86Starter({

            wasm_path:
                "v86/build/v86.wasm",

            memory_size:
                512 * 1024 * 1024,

            vga_memory_size:
                8 * 1024 * 1024,

            screen_container:
                screen,

            bios:
                {
                    url:
                        "v86/bios/seabios.bin"
                },

            vga_bios:
                {
                    url:
                        "v86/bios/vgabios.bin"
                },

            cdrom:
                {
                    url:
                        ANDROID_ISO
                },

            autostart:
                true,

            disable_keyboard:
                false,

            disable_mouse:
                false,

            acpi:
                true,

            enable_ne2k:
                true,

            preserve_mac_from_state_image:
                true,

            filesystem:
                {
                    baseurl:
                        "v86/build/"
                }

        });


    console.log(
        "Kairo Android started."
    );


    return androidEmulator;
}


/* =========================================================
   STOP ANDROID
========================================================= */

function stopAndroid() {

    if (!androidEmulator) {
        return;
    }

    androidEmulator.stop();

    androidEmulator = null;

    console.log(
        "Kairo Android stopped."
    );

}


/* =========================================================
   RESET ANDROID
========================================================= */

function resetAndroid() {

    if (!androidEmulator) {
        return;
    }

    androidEmulator.restart();

    console.log(
        "Kairo Android restarted."
    );

}


/* =========================================================
   FULLSCREEN
========================================================= */

function fullscreenAndroid() {

    const screen =
        document.getElementById(
            "android-screen"
        );

    if (!screen) {
        return;
    }


    if (
        document.fullscreenElement
    ) {

        document.exitFullscreen();

        return;

    }


    if (
        screen.requestFullscreen
    ) {

        screen.requestFullscreen();

    }

}


/* =========================================================
   GLOBAL EXPORTS
========================================================= */

window.startAndroid =
    startAndroid;

window.stopAndroid =
    stopAndroid;

window.resetAndroid =
    resetAndroid;

window.fullscreenAndroid =
    fullscreenAndroid;
