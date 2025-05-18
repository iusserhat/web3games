import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Depolama erişimi kontrolü
const checkStorageAccess = () => {
  try {
    const testKey = "_test_storage_access";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error("Depolama erişimi hatası:", error);
    return false;
  }
};

// Hata durumunda gösterilecek bileşen
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="error-container">
    <h2>Uygulama Hatası</h2>
    <p>Bir hata oluştu: {message}</p>
    <button 
      onClick={() => window.location.reload()} 
      className="reload-btn"
    >
      Sayfayı Yenile
    </button>
  </div>
);

// Ana uygulama render işlemi
const renderApp = () => {
  const hasStorageAccess = checkStorageAccess();
  
  if (!hasStorageAccess) {
    // Depolama erişimi yoksa uyarı göster
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <ErrorDisplay message="Tarayıcı depolama erişimi engellendi. Lütfen tarayıcı ayarlarınızı kontrol edin veya gizli moddan çıkın." />
    );
    return;
  }
  
  // Normal durum - Ana uygulamayı render et
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Uygulamayı başlat
renderApp();
