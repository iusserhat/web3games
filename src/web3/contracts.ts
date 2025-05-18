import { ethers } from 'ethers';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESSES } from './config';

// NFT kontratının ABI'si (bunu kendi NFT kontratınızın ABI'si ile değiştirin)
const NFT_ABI = [
  // Örnek NFT Fonksiyonları
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokensOfOwner(address owner) view returns (uint256[])",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// NFT kontratına bağlanmak için bir fonksiyon
export const getNFTContract = (provider: ethers.providers.Provider, contractAddress: string = NFT_CONTRACT_ADDRESS) => {
  return new ethers.Contract(contractAddress, NFT_ABI, provider);
};

// Tüm NFT kontratlarını kontrol ederek NFT'leri getirme
export const getOwnedNFTs = async (provider: ethers.providers.Web3Provider, address: string) => {
  try {
    let allTokens: {tokenId: string, contractAddress: string}[] = [];
    
    // Tüm kontratları kontrol et
    for (const contractAddress of NFT_CONTRACT_ADDRESSES) {
      const contract = getNFTContract(provider, contractAddress);
      
      try {
        // tokensOfOwner fonksiyonu varsa kullan
        if (contract.functions.tokensOfOwner) {
          const tokens = await contract.tokensOfOwner(address);
          tokens.forEach((tokenId: ethers.BigNumber) => {
            allTokens.push({
              tokenId: tokenId.toString(),
              contractAddress
            });
          });
          continue;
        }
      } catch (error) {
        console.log(`${contractAddress} için tokensOfOwner desteklenmiyor, balanceOf kullanılacak`);
      }
      
      try {
        // Yoksa balanceOf ve tokenOfOwnerByIndex ile topla
        const balance = await contract.balanceOf(address);
        
        for (let i = 0; i < balance.toNumber(); i++) {
          try {
            // tokenOfOwnerByIndex denemesi
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            allTokens.push({
              tokenId: tokenId.toString(),
              contractAddress
            });
          } catch (error) {
            console.error(`${contractAddress} için tokenOfOwnerByIndex desteklenmiyor`, error);
            break;
          }
        }
      } catch (error) {
        console.error(`${contractAddress} için balanceOf alınamadı`, error);
      }
    }
    
    // Hata durumunda test verileri döndür
    if (allTokens.length === 0) {
      // Test token'larını ekle
      allTokens = [
        { tokenId: 'test-1', contractAddress: NFT_CONTRACT_ADDRESSES[0] },
        { tokenId: 'test-2', contractAddress: NFT_CONTRACT_ADDRESSES[1] },
        { tokenId: 'test-3', contractAddress: NFT_CONTRACT_ADDRESSES[2] }
      ];
    }
    
    return allTokens;
  } catch (error) {
    console.error("NFT'ler alınamadı:", error);
    // Hata durumunda test tokenleri döndür
    return [
      { tokenId: 'test-1', contractAddress: NFT_CONTRACT_ADDRESSES[0] },
      { tokenId: 'test-2', contractAddress: NFT_CONTRACT_ADDRESSES[1] },
      { tokenId: 'test-3', contractAddress: NFT_CONTRACT_ADDRESSES[2] }
    ];
  }
};

// NFT meta verisini getirme (karakterin özelliklerini)
export const getNFTMetadata = async (provider: ethers.providers.Web3Provider, tokenId: string, contractAddress: string) => {
  try {
    // Hızlı başlangıç için, kontrat adresine göre sabit meta verileri döndür
    let name, type, image;
    let role = 'character';
    
    if (contractAddress === NFT_CONTRACT_ADDRESSES[0]) {
      name = 'Ateş Karakteri';
      type = 'fire';
      image = '/fire-character.png';
    } else if (contractAddress === NFT_CONTRACT_ADDRESSES[1]) {
      name = 'Su Karakteri';
      type = 'ice';
      image = '/ice-character.png';
    } else if (contractAddress === NFT_CONTRACT_ADDRESSES[2]) {
      name = 'Canavar';
      type = 'enemy';
      image = '/enemy.png';
      role = 'enemy';
    } else if (contractAddress === NFT_CONTRACT_ADDRESSES[3]) {
      name = 'Dino Karakter';
      type = 'dino';
      image = '/dino.png';
    } else {
      name = `NFT #${tokenId}`;
      type = 'unknown';
      image = '';
    }
    
    return {
      name,
      description: `NFT #${tokenId}`,
      image,
      customType: type,
      role,
      attributes: [
        { trait_type: 'Type', value: type },
        { trait_type: 'Health', value: 100 },
        { trait_type: 'Attack', value: 15 },
        { trait_type: 'Defense', value: 10 },
        { trait_type: 'Speed', value: 8 },
        { trait_type: 'Special', value: 20 }
      ]
    };
  } catch (error) {
    console.error(`Token ID ${tokenId} için metadata alınamadı:`, error);
    
    // Hata durumunda varsayılan değerler döndür
    let name, type, image;
    
    if (contractAddress === NFT_CONTRACT_ADDRESSES[0]) {
      name = 'Ateş Karakteri';
      type = 'fire';
      image = '/fire-character.png';
    } else if (contractAddress === NFT_CONTRACT_ADDRESSES[1]) {
      name = 'Su Karakteri';
      type = 'ice';
      image = '/ice-character.png';
    } else if (contractAddress === NFT_CONTRACT_ADDRESSES[2]) {
      name = 'Canavar';
      type = 'enemy';
      image = '/enemy.png';
    } else if (contractAddress === NFT_CONTRACT_ADDRESSES[3]) {
      name = 'Dino Karakter';
      type = 'dino';
      image = '/dino.png';
    } else {
      name = `NFT #${tokenId}`;
      type = 'unknown';
      image = '';
    }
    
    return {
      name,
      description: `NFT #${tokenId}`,
      image,
      customType: type,
      role: contractAddress === NFT_CONTRACT_ADDRESSES[2] ? 'enemy' : 'character',
      attributes: [
        { trait_type: 'Type', value: type },
        { trait_type: 'Health', value: 100 },
        { trait_type: 'Attack', value: 15 },
        { trait_type: 'Defense', value: 10 },
        { trait_type: 'Speed', value: 8 },
        { trait_type: 'Special', value: 20 }
      ]
    };
  }
}; 