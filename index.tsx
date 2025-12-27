
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '20px';
  errorDiv.innerText = '错误: 找不到 ID 为 root 的 DOM 元素。';
  document.body.appendChild(errorDiv);
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React 渲染错误:", err);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: white; background: #ef4444; border-radius: 10px; margin: 20px;">
        <h1 style="font-weight: bold; margin-bottom: 10px;">应用启动失败</h1>
        <pre style="font-size: 12px; white-space: pre-wrap;">${err instanceof Error ? err.stack : String(err)}</pre>
        <p style="font-size: 12px; margin-top: 10px; color: #fee2e2;">提示：请检查浏览器控制台(F12)查看详细错误信息。</p>
      </div>
    `;
  }
}
