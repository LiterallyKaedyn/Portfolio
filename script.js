const consoleElement = document.getElementById('console');
const topLeftButton = document.getElementById('topLeftButton');
const mainContent = document.getElementById('mainContent');

// Loading text animation
const loadingElement = document.createElement('div');
loadingElement.id = 'loading';
loadingElement.innerText = 'Loading...';
consoleElement.appendChild(loadingElement);

// System Info Detection
function getCPUInfo() {
    return `${navigator.hardwareConcurrency || '?'} cores (${navigator.platform || 'Unknown Platform'})`;
}

function getRAMInfo() {
    return navigator.deviceMemory ? `${navigator.deviceMemory}GB` : "Unknown RAM";
}

function getGPUInfo() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (e) { }
    return "Unknown GPU";
}

function getNetworkInfo() {
    return navigator.connection ? `${navigator.connection.effectiveType.toUpperCase()} Connection` : "Unknown Network Interface";
}

// Insert detected values
const consoleLines = [
    "JesterOS Bootloader v1.27",
    "Copyright (C) 2025 Jester Software Systems Limited",
    "",
    "Initializing firmware interface...",
    `Detected CPU: ${getCPUInfo()}`,
    `Detected GPU: ${getGPUInfo()}`,
    "",
    "Loading jcode update... failed (checksum mismatch)",
    "Attempting fallback... success (rev 0x29E11)",
    "",
    `System RAM: ${getRAMInfo()}`,
    "",
    "Initializing memory controller... OK",
    "Initializing hardware...",
    `> SATA controller: Generic SATA AHCI Controller`,
    `> USB bus controller: Generic USB Controller`,
    `> Network interface: ${getNetworkInfo()}`,
    "> Audio interface: HD Audio Controller",
    "",
    "Mounting root filesystem...",
    "> ext4 filesystem detected on /dev/sda1",
    "> WARNING: journal replay required",
    "> Mount successful",
    "",
    "Starting services...",
    "> System logger... done",
    "> Device manager... [WARN] 2 devices unresponsive",
    "> Network manager... error: failed to bring up eth0",
    "> Audio service... fallback to dummy driver",
    "Launching shell daemon... OK",
    "Starting user session...",
    "",
    "*** NOTICE: Boot completed with 3 warnings and 2 recoverable errors ***",
    "Welcome to jDash v0.3.7 \"Aoraki\"",
    "",
    "Press ENTER to continue..."
];

let currentLine = 0;
let currentChar = 0;
let typingSpeed = 20; // speed of typing

function startTyping() {
    // Remove loading animation
    consoleElement.removeChild(loadingElement);
    typeLine();
}

function typeLine() {
    if (currentLine < consoleLines.length) {
        let line = consoleLines[currentLine];
        if (currentChar < line.length) {
            consoleElement.innerHTML += line[currentChar];
            currentChar++;
            setTimeout(typeLine, typingSpeed);
        } else {
            consoleElement.innerHTML += '\n';
            currentLine++;
            currentChar = 0;
            setTimeout(typeLine, 100); // slight pause between lines
        }
    } else {
        // Finished typing, add blinking cursor
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        consoleElement.appendChild(cursor);
        enableEnter();
    }
}

function fadeOutConsole() {
    consoleElement.style.transition = "opacity 2s ease";
    topLeftButton.style.transition = "opacity 2s ease";
    consoleElement.style.opacity = 0;
    topLeftButton.style.opacity = 0;
    setTimeout(() => {
        consoleElement.style.display = "none";
        topLeftButton.style.display = "none";
        mainContent.classList.add('show');
    }, 2000);
}

function enableEnter() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            fadeOutConsole();
        }
    });
}

// Top left button now fades everything out too
topLeftButton.addEventListener('click', () => {
    fadeOutConsole();
});

window.onload = () => {
    // Show loading animation for 2.5 seconds
    setTimeout(startTyping, 2500);
};
