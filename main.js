import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let homeWindow;

// `${__dirname}/src/Home/Home.html`

async function createMainWindow() {
    homeWindow = new BrowserWindow({ width: 650, height: 1100 });
    try {
        await homeWindow.loadFile(`${__dirname}/src/Home/Home.html`);
    } catch (error) {
        console.error('Error loading file:', error.message);
    }
}

app.whenReady().then(() => {
    createMainWindow();

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


