import Phaser from 'phaser';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useNFTs, useWallet } from '../web3/hooks';

// Sahneleri içe aktar
import ConnectWalletScene from './scenes/ConnectWalletScene';
import MenuScene from './scenes/MenuScene';
import MainGameScene from './scenes/MainGameScene';
import ResultScene from './scenes/ResultScene';

class GameManager {
  private game: Phaser.Game | null = null;
  private gameConfig: Phaser.Types.Core.GameConfig;
  private walletConnectCallback: (() => Promise<void>) | null = null;
  private walletStatus: {
    isConnected: boolean;
    address: string | null;
    nfts: any[];
    characters: any[];
    enemy: any | null;
  } = {
    isConnected: false,
    address: null,
    nfts: [],
    characters: [],
    enemy: null
  };
  
  constructor() {
    this.gameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 800,
      height: 600,
      backgroundColor: '#222233',
      scene: [ConnectWalletScene, MenuScene, MainGameScene, ResultScene]
    };
  }
  
  // Oyunu başlat
  public start() {
    if (this.game) {
      return;
    }
    
    this.game = new Phaser.Game(this.gameConfig);
    
    // Cüzdan bağlantı verisini ConnectWalletScene'e ilet
    const connectWalletScene = this.game.scene.getScene('ConnectWalletScene') as ConnectWalletScene;
    if (connectWalletScene) {
      connectWalletScene.scene.start('ConnectWalletScene', {
        onConnectWallet: this.walletConnectCallback ? this.walletConnectCallback : async () => {},
        isWalletConnected: this.walletStatus.isConnected,
        walletAddress: this.walletStatus.address,
        nfts: this.walletStatus.nfts,
        characters: this.walletStatus.characters,
        enemy: this.walletStatus.enemy
      });
    }
  }
  
  // Oyunu durdur
  public stop() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
  
  // Cüzdan bağlantı callback'ini ayarla
  public setWalletConnectCallback(callback: () => Promise<void>) {
    this.walletConnectCallback = callback;
  }
  
  // Cüzdan durumunu güncelle
  public updateWalletStatus(isConnected: boolean, address: string | null, nfts: any[] = [], characters: any[] = [], enemy: any | null = null) {
    this.walletStatus = {
      isConnected,
      address,
      nfts,
      characters,
      enemy
    };
    
    // Eğer oyun zaten başlatılmışsa, ConnectWalletScene'i güncelle
    if (this.game) {
      const connectWalletScene = this.game.scene.getScene('ConnectWalletScene') as ConnectWalletScene;
      if (connectWalletScene && connectWalletScene.scene.isActive()) {
        connectWalletScene.scene.restart({
          onConnectWallet: this.walletConnectCallback ? this.walletConnectCallback : async () => {},
          isWalletConnected: this.walletStatus.isConnected,
          walletAddress: this.walletStatus.address,
          nfts: this.walletStatus.nfts,
          characters: this.walletStatus.characters,
          enemy: this.walletStatus.enemy
        });
      }
    }
  }
}

// Web bileşeni ile entegrasyon için React hook'u
export const useGameManager = () => {
  const [gameManager] = useState<GameManager>(() => new GameManager());
  const { account, active, library } = useWeb3React<ethers.providers.Web3Provider>();
  const { connectWallet, disconnectWallet } = useWallet();
  const { nfts, characters, enemy, loading: nftsLoading } = useNFTs();
  
  // Cüzdan bağlantısı değiştiğinde oyunu güncelle
  useEffect(() => {
    if (gameManager) {
      gameManager.setWalletConnectCallback(connectWallet);
      gameManager.updateWalletStatus(active, account || null, nfts, characters, enemy);
    }
  }, [active, account, nfts, characters, enemy, gameManager, connectWallet]);
  
  // Component mount/unmount için oyunu başlat/durdur
  useEffect(() => {
    gameManager.start();
    
    return () => {
      gameManager.stop();
    };
  }, [gameManager]);
  
  return {
    isLoading: nftsLoading,
    connectWallet,
    disconnectWallet,
    isConnected: active,
    walletAddress: account
  };
};

export default GameManager; 