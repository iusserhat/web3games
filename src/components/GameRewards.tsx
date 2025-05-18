import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { sendGameReward } from '../web3/rewards';
import { contractAddress, contractABI } from '../abi';

interface GameRewardsProps {
  isVictory: boolean;
  onRewardComplete: () => void;
}

// Window tipini genişlet - window.ethereum için
declare global {
  interface Window {
    ethereum?: any;
  }
}

const GameRewards: React.FC<GameRewardsProps> = ({ isVictory, onRewardComplete }) => {
  const [rewardStatus, setRewardStatus] = useState<'idle' | 'checking' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [account, setAccount] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<{
    ownerAddress: string,
    isOwner: boolean,
    isAuthorized: boolean,
    contractBalance: string,
    rewardAmount: string
  }>({
    ownerAddress: '',
    isOwner: false,
    isAuthorized: false,
    contractBalance: '0',
    rewardAmount: '0'
  });
  
  // MetaMask bağlantısını kontrol et
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        setAccount(address);
        checkAccountStatus(address);
      } else if (window.ethereum) {
        try {
          // MetaMask'a bağlanmayı dene
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            checkAccountStatus(accounts[0]);
          }
        } catch (error) {
          console.error('MetaMask bağlantı hatası:', error);
        }
      }
    };
    
    checkConnection();
  }, []);
  
  // Hesabın statüsünü kontrol et (sahiplik, yetki)
  const checkAccountStatus = async (address: string) => {
    if (!window.ethereum) return;
    
    setRewardStatus('checking');
    setMessage('Kontrat kontrolü yapılıyor...');
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      
      // Kontrat bilgilerini al
      const ownerAddress = await contract.owner();
      const isAuthorized = await contract.isAuthorized(address);
      const contractBalanceWei = await contract.contractBalance();
      const contractBalance = ethers.utils.formatEther(contractBalanceWei);
      const rewardAmountWei = await contract.rewardAmount();
      const rewardAmount = ethers.utils.formatEther(rewardAmountWei);
      
      console.log('Kontrat sahibi:', ownerAddress);
      console.log('Bağlı cüzdan:', address);
      console.log('Kullanıcı yetkili mi?', isAuthorized);
      console.log('Kontrat bakiyesi:', contractBalance, 'token');
      console.log('Ödül miktarı:', rewardAmount, 'token');
      
      // Büyük-küçük harf duyarlılığını kaldır - Ethereum adresleri için checksum kontrolü
      const isContractOwner = ownerAddress.toLowerCase() === address.toLowerCase();
      
      setAccountInfo({
        ownerAddress,
        isOwner: isContractOwner,
        isAuthorized,
        contractBalance,
        rewardAmount
      });
      
      // Kontrat bakiyesi kontrolü
      if (Number(contractBalance) < Number(rewardAmount)) {
        setMessage(`Uyarı: Kontrat bakiyesi yetersiz! Bakiye: ${contractBalance}, Gerekli: ${rewardAmount}`);
      }
      
      setRewardStatus('idle');
    } catch (error) {
      console.error('Kontrat kontrolü hatası:', error);
      setRewardStatus('idle');
    }
  };
  
  // Cüzdan bağlıysa ve oyun kazanıldıysa, otomatik olarak ödül gönder
  useEffect(() => {
    if (isVictory && account) {
      // Artık tüm yetkili adresler token gönderebilir
      handleSendReward();
    } else if (isVictory && !account) {
      setMessage('Ödül almak için MetaMask cüzdanınızı bağlayın');
      setRewardStatus('error');
    }
  }, [isVictory, account]);
  
  // Ödül mesajını belirli bir süre sonra kapat
  useEffect(() => {
    if (rewardStatus === 'success' || rewardStatus === 'error') {
      const timer = setTimeout(() => {
        setRewardStatus('idle');
        onRewardComplete();
      }, 7000); // Daha uzun süre gösterelim
      
      return () => clearTimeout(timer);
    }
  }, [rewardStatus, onRewardComplete]);
  
  const handleSendReward = async () => {
    if (!account || !isVictory || !window.ethereum) return;
    
    setRewardStatus('processing');
    setMessage('Ödül token gönderiliyor...');
    
    try {
      // Ethers provider oluştur
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Token gönder
      const result = await sendGameReward(provider, account);
      
      if (result.success) {
        setRewardStatus('success');
        setMessage(`Tebrikler! 100 token cüzdanınıza gönderildi. İşlem hash: ${result.transaction.transactionHash.substring(0, 10)}...`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Ödül gönderme hatası:', error);
      
      let errorMessage = error.message || 'Bilinmeyen hata';
      
      // Yetkili değilse özel mesaj
      if (error.message && error.message.includes('Yetkisiz erişim')) {
        errorMessage = `İşlem başarısız oldu: Yetkili bir adres değilsiniz.
          Kontrat Sahibi: ${accountInfo.ownerAddress.substring(0, 6)}...${accountInfo.ownerAddress.substring(accountInfo.ownerAddress.length - 4)}`;
      }
      
      setRewardStatus('error');
      setMessage(`Ödül gönderilemedi: ${errorMessage}`);
    }
  };
  
  // Cüzdana bağlanma fonksiyonu
  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage('Lütfen MetaMask yükleyin');
      setRewardStatus('error');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        checkAccountStatus(accounts[0]);
      }
    } catch (error: any) {
      console.error('Cüzdan bağlantı hatası:', error);
      setMessage(`Cüzdan bağlanamadı: ${error.message || 'Bilinmeyen hata'}`);
      setRewardStatus('error');
    }
  };
  
  // Ödül almak için bağlan butonu
  if (isVictory && !account && rewardStatus === 'idle') {
    return (
      <div className="reward-connect">
        <p>Ödül almak için MetaMask cüzdanınızı bağlayın</p>
        <button className="connect-reward-btn" onClick={connectWallet}>
          Cüzdanı Bağla ve Ödülü Al
        </button>
      </div>
    );
  }
  
  // Yetkili değilse bilgi göster
  if (isVictory && account && !accountInfo.isAuthorized && rewardStatus === 'idle') {
    return (
      <div className="reward-connect reward-warning">
        <p>Yetkili bir adres olmadığınız için işlem başarısız olabilir.</p>
        <div className="owner-info">
          <p>Kontrat Adresi: {contractAddress}</p>
          <p>Kontrat Sahibi: {accountInfo.ownerAddress || "Bilinmiyor"}</p>
          <p>Yetkili misiniz: {accountInfo.isAuthorized ? "Evet" : "Hayır"}</p>
          <p>Senin Adresin: {account}</p>
          <p>Kontrat Bakiyesi: {accountInfo.contractBalance} token</p>
          <p>Ödül Miktarı: {accountInfo.rewardAmount} token</p>
        </div>
        <div className="button-group">
          <button className="connect-reward-btn" onClick={handleSendReward}>
            Yine de Dene
          </button>
          <button className="connect-reward-btn secondary" onClick={() => onRewardComplete()}>
            Vazgeç
          </button>
        </div>
      </div>
    );
  }
  
  if (rewardStatus === 'checking') {
    return (
      <div className="reward-processing">
        {message}
      </div>
    );
  }
  
  if (rewardStatus === 'idle') return null;
  
  return (
    <>
      {rewardStatus === 'success' && (
        <div className="reward-success">
          {message}
        </div>
      )}
      
      {rewardStatus === 'error' && (
        <div className="reward-error">
          {message}
          {!account && (
            <button className="connect-reward-btn" onClick={connectWallet}>
              Tekrar Dene
            </button>
          )}
          {account && (
            <button className="connect-reward-btn" onClick={handleSendReward}>
              Tekrar Dene
            </button>
          )}
        </div>
      )}
      
      {rewardStatus === 'processing' && (
        <div className="reward-processing">
          {message}
        </div>
      )}
    </>
  );
};

export default GameRewards;