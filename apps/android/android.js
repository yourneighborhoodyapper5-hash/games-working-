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

async function startAndroid() {

    const screen = document.getElementById("android-screen");

    if (!screen) {
        console.error("Android screen element not found.");
        return;
    }

    // Prevent starting multiple emulators
    if (androidEmulator) {
        console.log("Android is already running.");
        return;
    }

    screen.innerHTML = "";

    const canvas = document.createElement("canvas");

    canvas.id = "android-canvas";
    canvas.width = 1024;
    canvas.height = 768;

    screen.appendChild(canvas);

    try {

        androidEmulator = new V86Starter({

            wasm_path: "./x86/v86.wasm",

            memory_size: 512 * 1024 * 1024,

            vga_memory_size: 8 * 1024 * 1024,

            screen_container: screen,

            bios: {
                url: "./x86/seabios.bin"
            },

            vga_bios: {
                url: "./x86/vgabios.bin"
            },

            cdrom: {
                url: ANDROID_ISO
            },

            autostart: true,

            network_relay_url:
                "wss://relay.widgetry.org/"

        });

        console.log("Android emulator started.");

    } catch (error) {

        console.error(
            "Failed to start Android:",
            error
        );

        screen.innerHTML = `
            <div class="android-error">
                <h2>Android failed to start</h2>
                <p>${error.message}</p>
            </div>
        `;

        androidEmulator = null;
    }
}


/* =========================================================
   STOP ANDROID
========================================================= */

function stopAndroid() {

    if (!androidEmulator) {
        return;
    }

    try {

        androidEmulator.stop();

    } catch (error) {

        console.error(
            "Failed to stop Android:",
            error
        );

    }

    androidEmulator = null;

    const screen =
        document.getElementById(
            "android-screen"
        );

    if (screen) {
        screen.innerHTML = "";
    }
}


/* =========================================================
   GLOBAL EXPORT
========================================================= */

window.startAndroid = startAndroid;
window.stopAndroid = stopAndroid;
