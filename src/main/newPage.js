
import { BrowserWindow, ipcMain, screen } from 'electron';

let win = null;
const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/#reader' : `file://${__dirname}/newPage/index.html`;

/**
 * 创建新窗口函数
 */
function createNewPageWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 500,
    minHeight: 130,
    show: false, // 先不让窗口显示
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
  });
  const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
  const winSize = win.getSize(); // 获取窗口宽高
  // 设置窗口的位置 注意x轴要桌面的宽度 - 窗口的宽度
  win.loadURL(winURL);
  win.setPosition((size.width - winSize[0]) / 2, 350);
  // 监听渲染完成
  win.once('ready-to-show', () => {
    win.show();
  });
  // 监听窗口关闭
  win.on('close', () => {
    win = null;
  });

  global.newPage = {
    id: win.id
  };
}

/**
 * 监听创建新窗口
 */
ipcMain.on('showNewPageWindow', () => {
  if (win) {
    if (win.isVisible()) {
      createNewPageWindow();
    } else {
      win.showInactive();
    }
  } else {
    createNewPageWindow();
  }
});

/**
 * 监听隐藏新窗口
 */
ipcMain.on('hideNewPageWindow', () => {
  if (win) {
    win.hide();
  }
});
