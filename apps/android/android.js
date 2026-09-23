const ANDROID_ISO =
    "https://github.com/yourneighborhoodyapper5-hash/games-working-/releases/download/Iso/android-x86-4.4-r1.iso";

let androidEmulator = null;

function startAndroid() {
    if (androidEmulator) {
        console.log("Android is already running.");
        return;
    }

    const screen = document.getElementById("android-screen");

    if (!screen) {
        console.error("Missing #android-screen element.");
        return;
    }

    if (typeof V86Starter === "undefined") {
        console.error("V86Starter was not loaded.");
        return;
    }

    console.log("Starting Android-x86 in v86...");

    androidEmulator = new V86Starter({
        wasm_path: "v86/v86.wasm",

        memory_size: 512 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,

        screen_container: screen,

        bios: {
            url: "v86/seabios.bin"
        },

        vga_bios: {
            url: "v86/vgabios.bin"
        },

        cdrom: {
            url: ANDROID_ISO
        },

        autostart: true,

        acpi: true,

        enable_ne2k: true,

        disable_mouse: false,
        disable_keyboard: false,

        boot_order: 0x132
    });

    console.log("Android emulator started.");
}

function stopAndroid() {
    if (!androidEmulator) {
        return;
    }

    androidEmulator.stop();
    androidEmulator = null;

    console.log("Android emulator stopped.");
}

function resetAndroid() {
    if (!androidEmulator) {
        startAndroid();
        return;
    }

    androidEmulator.restart();
    console.log("Android emulator restarted.");
}

window.startAndroid = startAndroid;
window.stopAndroid = stopAndroid;
window.resetAndroid = resetAndroid;

// Automatically start Android when the page loads.
window.addEventListener("load", () => {
    setTimeout(() => {
        startAndroid();
    }, 500);
});
