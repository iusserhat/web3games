import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../abi';

// Oyun ödülü gönderme fonksiyonu - geliştirme ve hata ayıklama için daha fazla log
export const sendGameReward = async (
  provider: ethers.providers.Web3Provider,
  playerAddress: string
) => {
  console.log('Ödül gönderme başlatıldı:', {
    contractAddress,
    playerAddress
  });
  
  try {
    // Ağ kontrolü yap - Sepolia ağında olduğundan emin ol
    const network = await provider.getNetwork();
    console.log('Bağlı ağ:', network.name, network.chainId);
    
    if (network.chainId !== 11155111) { // Sepolia ChainID
      return {
        success: false,
        error: `Sepolia test ağına bağlı değilsiniz. Lütfen MetaMask'ta ağı değiştirin. Mevcut ağ: ${network.name} (ID: ${network.chainId})`
      };
    }
    
    // Signer'ı al
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    console.log('Token gönderen hesap:', signerAddress);
    
    // Kontrat ile bağlantı kur
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    
    try {
      // Kontrat bilgilerini kontrol et
      const owner = await contract.owner();
      const isAuthorized = await contract.isAuthorized(signerAddress);
      const contractBalanceWei = await contract.contractBalance();
      const contractBalance = ethers.utils.formatEther(contractBalanceWei);
      const rewardAmount = ethers.utils.formatEther(await contract.rewardAmount());
      
      console.log('Kontrat sahibi:', owner);
      console.log('Kullanıcı kontrat sahibi mi?', owner.toLowerCase() === signerAddress.toLowerCase());
      console.log('Kullanıcı yetkili mi?', isAuthorized);
      console.log('Kontrat bakiyesi:', contractBalance, 'token');
      console.log('Ödül miktarı:', rewardAmount, 'token');
      
      // Kontrat bakiyesi yeterli mi kontrol et
      if (Number(contractBalance) < Number(rewardAmount)) {
        return {
          success: false,
          error: `Kontrat bakiyesi yetersiz. Kontrat bakiyesi: ${contractBalance} token, Gereken: ${rewardAmount} token`
        };
      }
      
      // Kullanıcı yetkili mi kontrol et
      if (!isAuthorized) {
        return {
          success: false,
          error: `Yetkili değilsiniz. Token göndermek için kontrat sahibi veya yetkili bir adres olmalısınız.
                 Kontrat sahibi: ${owner}`
        };
      }
    } catch (error) {
      console.warn('Kontrat bilgileri kontrolü yapılamadı:', error);
    }
    
    // Gönderme işlemini işaretleyici kontrat üzerinden yapalım - signer ile
    const signerContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    
    console.log('Kontrat bağlantısı kuruldu');
    
    try {
      // Gaz fiyatı ve limit ayarları ekleyerek token gönderim işlemini iyileştirme
      const gasPrice = await provider.getGasPrice();
      const adjustedGasPrice = gasPrice.mul(12).div(10); // %20 daha yüksek gaz fiyatı
      
      try {
        const gasLimit = await signerContract.estimateGas.rewardWinner(playerAddress);
        const adjustedGasLimit = gasLimit.mul(12).div(10); // %20 daha yüksek gaz limiti
        
        console.log('Gas fiyatı:', ethers.utils.formatUnits(adjustedGasPrice, 'gwei'), 'gwei');
        console.log('Gas limiti:', adjustedGasLimit.toString());
        
        // Kazanana ödül gönder - gas ayarlarıyla
        const tx = await signerContract.rewardWinner(playerAddress, {
          gasPrice: adjustedGasPrice,
          gasLimit: adjustedGasLimit
        });
        
        console.log('İşlem gönderildi, hash:', tx.hash);
        
        // İşlemin tamamlanmasını bekle
        const receipt = await tx.wait();
        console.log('İşlem tamamlandı:', receipt);
        
        return {
          success: true,
          transaction: receipt
        };
      } catch (error: any) {
        console.error('İşlem tahmini hatası:', error);
        
        // Yetkili olmama hatası
        if (error.message && error.message.includes('Yetkisiz erişim')) {
          return {
            success: false,
            error: 'Yetkili olmadığınız için token gönderilemiyor. Oyun geliştiricisiyle iletişime geçin.'
          };
        }
        
        throw error;
      }
    } catch (error: any) {
      if (error.code === 'INSUFFICIENT_FUNDS') {
        return {
          success: false,
          error: 'Yetersiz bakiye. İşlem ücreti için ETH gerekiyor.'
        };
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        return {
          success: false,
          error: 'Kontrat işlemi gerçekleştirilemedi. Kontratta bir sorun olabilir.'
        };
      }
      
      console.error('Kontrat hata detayları:', error);
      return {
        success: false,
        error: error.message || 'Ödül gönderilemedi'
      };
    }
  } catch (error: any) {
    console.error('Ödül gönderme genel hatası:', error);
    return {
      success: false,
      error: error.message || 'Ödül gönderilemedi'
    };
  }
}; 