/*
 * Kairo Android
 * v86 Android emulator
 */

const ANDROID_ISO =
    "https://github.com/yourneighborhoodyapper5-hash/games-working-/releases/download/Iso/android-x86-4.4-r1.iso";

let androidEmulator = null;


/* =========================================================
   START ANDROID
========================================================= */

function startAndroid() {

    if (androidEmulator) {
        console.log("Android is already running.");
        return;
    }

    const screen =
        document.getElementById("android-screen");

    if (!screen) {
        throw new Error(
            "Missing #android-screen element."
        );
    }

    if (typeof V86Starter === "undefined") {
        throw new Error(
            "v86 is not loaded."
        );
    }

    console.log("Starting Kairo Android...");

    androidEmulator = new V86Starter({

        wasm_path:
            "v86/v86.wasm",

        memory_size:
            512 * 1024 * 1024,

        vga_memory_size:
            8 * 1024 * 1024,

        screen_container:
            screen,

        bios: {
            url:
                "v86/seabios.bin"
        },

        vga_bios: {
            url:
                "v86/vgabios.bin"
        },

        cdrom: {
            url:
                ANDROID_ISO
        },

        autostart:
            true,

        acpi:
            true,

        enable_ne2k:
            true,

        disable_mouse:
            false,

        disable_keyboard:
            false

    });

    console.log(
        "Kairo Android started."
    );
}


/* =========================================================
   STOP
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
   RESET
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

    if (document.fullscreenElement) {

        document.exitFullscreen();

        return;
    }

    if (screen.requestFullscreen) {

        screen.requestFullscreen();

    }
}


/* =========================================================
   EXPORT
========================================================= */

window.startAndroid =
    startAndroid;

window.stopAndroid =
    stopAndroid;

window.resetAndroid =
    resetAndroid;

window.fullscreenAndroid =
    fullscreenAndroid;
