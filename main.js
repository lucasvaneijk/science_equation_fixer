const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    icon: path.join(__dirname, "build", "science.ico"),
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  win.webContents.openDevTools();
  win.loadFile("src/index.html");

}

Menu.setApplicationMenu(null);
Menu.setApplicationMenu(false);

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
}); 