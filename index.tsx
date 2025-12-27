
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    console.log("SomnoAI: 准备挂载应用...");
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("SomnoAI: 挂载指令已发送");
  } catch (err) {
    console.error("Critical Render Error:", err);
    rootElement.innerHTML = `
      <div style="padding: 30px; color: white; background: #0f172a; border: 1px solid #334155; border-radius: 24px; margin: 20px; text-align: center; max-width: 600px; margin-left: auto; margin-right: auto;">
        <h1 style="font-weight: bold; font-size: 20px; color: #ef4444; margin-bottom: 12px;">启动错误</h1>
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">检测到环境配置冲突或资源被拦截。</p>
        <div style="text-align: left; background: #020617; padding: 20px; border-radius: 12px; font-family: monospace; font-size: 11px; overflow: auto; max-height: 250px; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.05);">
          ${err instanceof Error ? err.stack : String(err)}
        </div>
        <button onclick="window.location.reload()" style="margin-top: 24px; padding: 12px 30px; background: #3b82f6; border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: bold;">尝试刷新</button>
      </div>
    `;
  }
};

// 使用 window 'load' 事件确保所有关键资源（如样式和字体）加载完成后再运行逻辑
if (document.readyState === 'complete') {
  startApp();
} else {
  window.addEventListener('load', startApp);
}
