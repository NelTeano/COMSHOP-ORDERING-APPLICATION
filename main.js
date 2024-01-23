import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let homeWindow;
let loadingWindow;

async function createLoadingWindow() {
    loadingWindow = new BrowserWindow({
        width: 400,
        height: 200,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    try {
        await loadingWindow.loadFile(`${__dirname}/src/Home/loading.html`);
    } catch (error) {
        console.error('Error loading loading screen:', error.message);
    }
}

async function createMainWindow() {
    homeWindow = new BrowserWindow({
        width: 650,
        height: 1100,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    try {
        await homeWindow.loadFile(`${__dirname}/src/Home/Home.html`);
        if (loadingWindow) {
            loadingWindow.close();
            loadingWindow = null; // Set to null to indicate that it's closed
        }

    } catch (error) {
        console.error('Error loading main window:', error.message);
    }
}

// Function to start the Express server
function startExpressServer() {
    const serverProcess = spawn('npm', ['run', 'server'], { shell: true });

    serverProcess.stdout.on('data', (data) => {
        console.log(`Express Server Output: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`Express Server Error: ${data}`);
    });

    serverProcess.on('close', (code) => {
        console.log(`Express Server closed with code ${code}`);
    });
}

app.whenReady().then(() => {
    // Start the Express server
    startExpressServer();

    createLoadingWindow(); // Create loading window

    // Once the app is ready, create the main window after a short delay (simulating loading)
    setTimeout(() => {
        if (!homeWindow) {
            createMainWindow();
        }
    }, 11000); // Adjust the delay as needed

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('close-main-window', () => {
    if (homeWindow) {
        homeWindow.close();
    }
});
