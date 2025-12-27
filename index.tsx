
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Critical Render Error:", err);
    rootElement.innerHTML = `
      <div style="padding: 30px; color: white; background: #1e293b; border: 1px solid #ef4444; border-radius: 20px; margin: 20px; text-align: center;">
        <h1 style="font-weight: bold; font-size: 20px; color: #ef4444; margin-bottom: 15px;">系统启动异常</h1>
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 20px;">检测到运行环境冲突，请尝试刷新页面或清除浏览器缓存。</p>
        <div style="text-align: left; background: #0f172a; padding: 15px; border-radius: 10px; font-family: monospace; font-size: 12px; overflow: auto; max-height: 200px;">
          ${err instanceof Error ? err.stack : String(err)}
        </div>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 25px; background: #3b82f6; border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: bold;">重新加载</button>
      </div>
    `;
  }
};

// 确保 DOM 完全加载后再启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
