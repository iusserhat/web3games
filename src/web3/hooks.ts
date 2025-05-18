import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { injected, NFT_CONTRACT_ADDRESSES } from './config';
import { getOwnedNFTs, getNFTMetadata } from './contracts';

// Cüzdan bağlantısı için hook
export const useWallet = () => {
  const { active, account, library, activate, deactivate, error } = useWeb3React<ethers.providers.Web3Provider>();
  const [loading, setLoading] = useState(false);

  // MetaMask'a bağlanma
  const connectWallet = async () => {
    setLoading(true);
    try {
      await activate(injected);
    } catch (error) {
      console.error('Cüzdan bağlantı hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cüzdan bağlantısını kesme
  const disconnectWallet = async () => {
    try {
      deactivate();
    } catch (error) {
      console.error('Cüzdan bağlantısı kesme hatası:', error);
    }
  };

  return {
    active,
    account,
    library,
    connectWallet,
    disconnectWallet,
    loading,
    error
  };
};

// Kullanıcının NFT'lerini getirme hook'u
export const useNFTs = () => {
  const { active, account, library } = useWeb3React<ethers.providers.Web3Provider>();
  const [nfts, setNfts] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [enemy, setEnemy] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    if (!active || !account || !library) {
      setError('Cüzdan bağlı değil');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Kullanıcının sahip olduğu NFT token ID'lerini al
      const tokenData = await getOwnedNFTs(library, account);
      
      // Her bir token için metadata'yı al
      const nftPromises = tokenData.map(async ({ tokenId, contractAddress }) => {
        try {
          const metadata = await getNFTMetadata(library, tokenId, contractAddress);
          return {
            tokenId,
            contractAddress,
            metadata
          };
        } catch (metadataError) {
          console.error(`Token ${tokenId} için metadata alınamadı:`, metadataError);
          // Hata durumunda varsayılan metadata döndür
          return {
            tokenId,
            contractAddress,
            metadata: {
              name: `NFT #${tokenId}`,
              description: 'Metadata yüklenemedi',
              image: contractAddress === NFT_CONTRACT_ADDRESSES[0] ? '/fire-character.png' : 
                     contractAddress === NFT_CONTRACT_ADDRESSES[1] ? '/ice-character.png' : 
                     contractAddress === NFT_CONTRACT_ADDRESSES[2] ? '/enemy.png' : '/dino.png',
              customType: contractAddress === NFT_CONTRACT_ADDRESSES[0] ? 'fire' : 
                          contractAddress === NFT_CONTRACT_ADDRESSES[1] ? 'ice' : 
                          contractAddress === NFT_CONTRACT_ADDRESSES[2] ? 'enemy' : 'dino',
              role: contractAddress === NFT_CONTRACT_ADDRESSES[2] ? 'enemy' : 'character'
            }
          };
        }
      });
      
      const nftData = await Promise.all(nftPromises);
      
      // NFT'leri rol ve tip bazında gruplama
      const characterNFTs = nftData.filter(nft => 
        nft.metadata && 
        nft.metadata.role !== 'enemy' &&
        nft.contractAddress !== NFT_CONTRACT_ADDRESSES[2]
      );
      
      const enemyNFT = nftData.find(nft => 
        nft.metadata && 
        (nft.metadata.role === 'enemy' || nft.contractAddress === NFT_CONTRACT_ADDRESSES[2])
      );
      
      setNfts(nftData);
      setCharacters(characterNFTs);
      setEnemy(enemyNFT || null);
    } catch (err) {
      console.error('NFT verisi alınırken hata oluştu:', err);
      setError('NFT verisi alınamadı');
      
      // Hata durumunda test karakterleri oluştur
      const testCharacters = [
        {
          tokenId: 'test-1',
          contractAddress: NFT_CONTRACT_ADDRESSES[0],
          metadata: {
            name: 'Ateş Büyücüsü',
            description: 'Test karakter',
            image: '/fire-character.png',
            customType: 'fire',
            role: 'character'
          }
        },
        {
          tokenId: 'test-2',
          contractAddress: NFT_CONTRACT_ADDRESSES[1],
          metadata: {
            name: 'Buz Savaşçısı',
            description: 'Test karakter',
            image: '/ice-character.png',
            customType: 'ice',
            role: 'character'
          }
        }
      ];
      
      const testEnemy = {
        tokenId: 'test-enemy',
        contractAddress: NFT_CONTRACT_ADDRESSES[2],
        metadata: {
          name: 'Karanlık Lord',
          description: 'Test düşman',
          image: '/enemy.png',
          customType: 'enemy',
          role: 'enemy'
        }
      };
      
      setNfts([...testCharacters, testEnemy]);
      setCharacters(testCharacters);
      setEnemy(testEnemy);
    } finally {
      setLoading(false);
    }
  };

  // Cüzdan bağlandığında NFT'leri otomatik olarak yükle
  useEffect(() => {
    if (active && account && library) {
      fetchNFTs();
    } else {
      setNfts([]);
      setCharacters([]);
      setEnemy(null);
    }
  }, [active, account, library]);

  return {
    nfts,
    characters,
    enemy,
    loading,
    error,
    refetch: fetchNFTs
  };
}; 