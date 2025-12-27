
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("SomnoAI: 找不到 #root 容器元素");
    return;
  }

  try {
    console.log("SomnoAI: 准备挂载 React 19 应用...");
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("SomnoAI: 核心应用已成功启动并挂载");
  } catch (err) {
    console.error("SomnoAI Critical Mounting Error:", err);
    
    // 生成精美的错误回退 UI
    const errorStack = err instanceof Error ? err.stack || err.message : String(err);
    
    rootElement.innerHTML = `
      <div style="padding: 40px 24px; color: white; background: #0f172a; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-family: sans-serif;">
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); padding: 24px; border-radius: 32px; max-width: 480px; width: 100%;">
          <div style="background: #ef4444; width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto; box-shadow: 0 8px 16px rgba(239, 68, 68, 0.4);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h1 style="font-weight: 800; font-size: 22px; margin-bottom: 12px; color: white;">启动失败 (引擎异常)</h1>
          <p style="font-size: 14px; color: #94a3b8; margin-bottom: 24px; line-height: 1.6;">检测到模块加载冲突，通常是因为浏览器缓存了旧版本的依赖关系。</p>
          
          <div style="text-align: left; background: #020617; padding: 16px; border-radius: 12px; font-family: 'Fira Code', monospace; font-size: 11px; overflow-x: auto; color: #f1f5f9; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px;">
            <div style="color: #ef4444; font-weight: bold; margin-bottom: 8px;">堆栈详情:</div>
            <pre style="margin: 0; white-space: pre-wrap;">${errorStack}</pre>
          </div>
          
          <button onclick="window.location.reload()" style="width: 100%; padding: 14px; background: #3b82f6; border: none; border-radius: 16px; color: white; cursor: pointer; font-weight: 700; font-size: 14px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); transition: all 0.2s;">清除缓存并刷新</button>
        </div>
      </div>
    `;
  }
};

// 使用 window.onload 确保所有外部脚本（如 Tailwind）都准备就绪
if (document.readyState === 'complete') {
  startApp();
} else {
  window.addEventListener('load', startApp);
}
