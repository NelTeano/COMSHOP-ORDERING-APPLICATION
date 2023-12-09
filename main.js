const { app, BrowserWindow, ipcMain } = require('electron');

let homeWindow;
let orderWindow;

function createMainWindow() {
    homeWindow = new BrowserWindow({ width: 650, height: 1000 });
    homeWindow.loadFile('C:/Users/Teano/Documents/COMPUTER-SHOP_ORDERING/src/Home/Home.html');
}

// home page C:/Users/Teano/Documents/COMPUTER-SHOP_ORDERING/src/Home/Home.html
// order page C:/Users/Teano/Documents/COMPUTER-SHOP_ORDERING/src/Order/Order.html

// function createSecondWindow() {
//     orderWindow = new BrowserWindow({ width: 800, height: 600 });

//     // Handle window closure properly
//     orderWindow.on('closed', () => {
//         orderWindow = null;
//     });

//     orderWindow.loadFile('C:/Users/Teano/Documents/COMPUTER-SHOP_ORDERING/src/Order/Order.html');
// }

app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

    // // Create the second window when requested
    // ipcMain.on('open-second-page', () => {
    //     createSecondWindow();

    //     // Close the first window
    //     if (homeWindow) {
    //         homeWindow.close();
    //     }
    // });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});