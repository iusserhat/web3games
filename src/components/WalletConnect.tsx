import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { SEPOLIA_CHAIN_ID } from '../web3/config';

// Window tipini genişleterek ethereum özelliğini ekleyelim
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Güvenli bir WalletConnect bileşeni - Web3React olmadan çalışabilir
const WalletConnect: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  // MetaMask varlığını kontrol et
  useEffect(() => {
    const checkMetaMask = () => {
      try {
        const isAvailable = typeof window !== 'undefined' && Boolean(window.ethereum);
        setIsMetaMaskAvailable(isAvailable);
        
        // MetaMask zaten bağlı mı kontrol et
        if (isAvailable && window.ethereum.selectedAddress) {
          setConnected(true);
          setAccount(window.ethereum.selectedAddress);
        }
        
        // Hesap değişikliği dinleyicisi ekle
        if (isAvailable) {
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setConnected(true);
              setAccount(accounts[0]);
            } else {
              setConnected(false);
              setAccount(null);
            }
          });
        }
      } catch (error) {
        console.error('MetaMask kontrolü sırasında hata:', error);
        setIsMetaMaskAvailable(false);
      }
    };
    
    checkMetaMask();
    
    // Cleanup
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {
          console.log('Listener removed');
        });
      }
    };
  }, []);

  // MetaMask'a bağlan
  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    // MetaMask yüklü değilse hata göster
    if (!isMetaMaskAvailable) {
      setError('MetaMask bulunamadı. Lütfen MetaMask eklentisini yükleyin ve tekrar deneyin.');
      setLoading(false);
      return;
    }
    
    try {
      // Doğrudan ethereum provider kullan
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setConnected(true);
        setAccount(accounts[0]);
      }
    } catch (error: any) {
      console.error('Cüzdan bağlantı hatası:', error);
      setError('Cüzdan bağlantısı başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  // Cüzdan bağlantısını kes - basit gösterim amaçlı
  const disconnectWallet = async () => {
    try {
      // Bağlantıyı kesme - MetaMask gerçekte bağlantıyı kesmiyor, 
      // sadece state'i güncelliyoruz
      setConnected(false);
      setAccount(null);
    } catch (error) {
      console.error('Cüzdan bağlantısı kesme hatası:', error);
    }
  };

  // Sepolia ağına geçiş yapmak için
  const switchToSepolia = async () => {
    if (!isMetaMaskAvailable || !window.ethereum) {
      setError('MetaMask bulunamadı');
      return;
    }

    try {
      // Sepolia ağına geçiş yapma isteği
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Eğer ağ ekli değilse, ağı ekle
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Ağ ekleme hatası:', addError);
          setError('Sepolia ağı eklenemedi');
        }
      } else {
        console.error('Ağ değiştirme hatası:', switchError);
        setError('Sepolia ağına geçiş yapılamadı');
      }
    }
  };

  return (
    <div className="wallet-connect">
      {!isMetaMaskAvailable ? (
        <div className="wallet-error">
          <p>Bu özellik MetaMask gerektiriyor. Lütfen MetaMask eklentisini yükleyin.</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="metamask-link"
          >
            MetaMask'ı Yükle
          </a>
        </div>
      ) : !connected ? (
        <button 
          className="connect-wallet-btn" 
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? 'Bağlanıyor...' : 'MetaMask Bağla'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-address">
            {account && `${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
          </div>
          
          {error && (
            <div className="wallet-error">
              {error}
              <button onClick={switchToSepolia} className="switch-network-btn">
                Sepolia'ya Geç
              </button>
            </div>
          )}
          
          <button className="disconnect-wallet-btn" onClick={disconnectWallet}>
            Bağlantıyı Kes
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;