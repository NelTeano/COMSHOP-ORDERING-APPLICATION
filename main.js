import express from 'express'
import dotenv from 'dotenv';
import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initDatabase } from './database.js'

// ROUTES
import orderRoutes from './server/routes/orderRoutes.js';
import productRoutes from './server/routes/productRoutes.js'

dotenv.config(); // INIT .env
initDatabase(); // INIT DB

const expressApp = express();
const port = 3000;

//MIDDLEWARE
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.json());
expressApp.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let homeWindow;

// `${__dirname}/src/Home/Home.html`

async function createMainWindow() {
    homeWindow = new BrowserWindow({ width: 650, height: 1000 });
    try {
        await homeWindow.loadFile(`${__dirname}/Quantity/Quantity.html`);
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

    expressApp.listen(port, () => {
        console.log(`Express server is running on http://localhost:${port}`);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


// USE ROUTES
expressApp.use('/api', orderRoutes);
expressApp.use('/api', productRoutes);
