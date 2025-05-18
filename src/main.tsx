import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Web3 bileşenleri ile ilgili sorunları önlemek için Strict Mode'u kaldırdık
// ve olası render hatalarını yakalamak için try-catch bloğu ekledik
try {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
} catch (error) {
  console.error("Render hatası:", error);
  
  // Hata durumunda basit bir hata ekranı göster
  const errorDiv = document.createElement('div');
  errorDiv.style.textAlign = 'center';
  errorDiv.style.padding = '50px';
  errorDiv.style.backgroundColor = '#1a1a2e';
  errorDiv.style.color = '#ffffff';
  
  errorDiv.innerHTML = `
    <h1>Uygulama başlatılamadı</h1>
    <p style="color: #ff6b6b">Bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
    <button style="background-color: #4a69bd; color: white; padding: 10px 20px; border: none; border-radius: 4px; margin-top: 20px; cursor: pointer;" 
      onclick="window.location.reload()">
      Sayfayı Yenile
    </button>
  `;
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = '';
    rootElement.appendChild(errorDiv);
  }
}
