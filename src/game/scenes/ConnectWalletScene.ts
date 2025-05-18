import Phaser from 'phaser';
import { CharacterType } from '../types';
import type { Character, Enemy } from '../types';
import { createCharacterFromNFT, createBossEnemy } from '../engine';

// Web3 bağlantısı ve NFT getirme işlevleri dışarıdan enjekte edilecek
type ConnectWalletSceneData = {
  onConnectWallet: () => Promise<void>;
  isWalletConnected: boolean;
  walletAddress: string | null;
  nfts: any[];
  characters: any[];
  enemy: any | null;
};

export default class ConnectWalletScene extends Phaser.Scene {
  private externalData: ConnectWalletSceneData | null = null;
  private connectButton: Phaser.GameObjects.Container | null = null;
  private loadingText: Phaser.GameObjects.Text | null = null;
  private statusText: Phaser.GameObjects.Text | null = null;
  
  constructor() {
    super('ConnectWalletScene');
  }
  
  init(data: ConnectWalletSceneData) {
    this.externalData = data;
  }
  
  create() {
    // Arka plan
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x222233)
      .setOrigin(0, 0);
    
    // Başlık
    this.add.text(
      this.cameras.main.width / 2,
      100,
      'NFT Karakter Savaş Oyunu',
      { fontSize: '40px', color: '#ffffff', fontStyle: 'bold' }
    ).setOrigin(0.5, 0.5);
    
    // Alt başlık
    this.add.text(
      this.cameras.main.width / 2,
      160,
      'Sepolia Test Ağı',
      { fontSize: '24px', color: '#aaaaff' }
    ).setOrigin(0.5, 0.5);
    
    // Açıklama
    this.add.text(
      this.cameras.main.width / 2,
      220,
      'NFT karakterlerinizi kullanmak için MetaMask cüzdanınızı bağlayın',
      { fontSize: '18px', color: '#cccccc', align: 'center', wordWrap: { width: 600 } }
    ).setOrigin(0.5, 0.5);
    
    // Bağlantı durumu metni
    this.statusText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 150,
      '',
      { fontSize: '18px', color: '#ffff88', align: 'center' }
    ).setOrigin(0.5, 0.5);
    
    // Yükleme metni
    this.loadingText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 100,
      '',
      { fontSize: '18px', color: '#88ff88', align: 'center' }
    ).setOrigin(0.5, 0.5);
    
    // Cüzdan bağlantı butonu
    this.createConnectButton();
    
    // Cüzdan durumunu kontrol et
    this.checkWalletStatus();
  }
  
  private createConnectButton() {
    const container = this.add.container(
      this.cameras.main.width / 2,
      300
    );
    
    // Buton arka planı
    const background = this.add.rectangle(0, 0, 250, 60, 0x3366aa)
      .setStrokeStyle(2, 0x5588cc)
      .setName('background');
    
    // Buton metni
    const text = this.add.text(
      0,
      0,
      'MetaMask Bağla',
      { fontSize: '22px', color: '#ffffff', fontStyle: 'bold' }
    ).setOrigin(0.5, 0.5)
      .setName('text');
    
    container.add([background, text]);
    
    // Interaktif yap
    background.setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        background.setFillStyle(0x4477bb);
      })
      .on('pointerout', () => {
        background.setFillStyle(0x3366aa);
      })
      .on('pointerdown', () => {
        this.connectWallet();
      });
    
    this.connectButton = container;
  }
  
  private async connectWallet() {
    if (!this.externalData?.onConnectWallet) {
      console.error('Cüzdan bağlantı işlevi enjekte edilmemiş');
      return;
    }
    
    if (this.loadingText) {
      this.loadingText.setText('Cüzdan bağlanıyor...');
    }
    
    if (this.connectButton) {
      const background = this.connectButton.getByName('background') as Phaser.GameObjects.Rectangle;
      if (background) {
        background.setFillStyle(0x666699).removeInteractive();
      }
    }
    
    try {
      await this.externalData.onConnectWallet();
      this.checkWalletStatus();
    } catch (error) {
      console.error('Cüzdan bağlantı hatası:', error);
      if (this.loadingText) {
        this.loadingText.setText('Bağlantı hatası oluştu! Tekrar deneyin.');
        this.loadingText.setColor('#ff5555');
      }
      
      // Butonu tekrar etkinleştir
      if (this.connectButton) {
        const background = this.connectButton.getByName('background') as Phaser.GameObjects.Rectangle;
        if (background) {
          background.setFillStyle(0x3366aa)
            .setInteractive({ useHandCursor: true });
        }
      }
    }
  }
  
  private checkWalletStatus() {
    if (!this.externalData) return;
    
    const { isWalletConnected, walletAddress, characters, enemy } = this.externalData;
    
    if (isWalletConnected && walletAddress) {
      // Cüzdan bağlandıysa butonun görünümünü değiştir
      if (this.connectButton) {
        const background = this.connectButton.getByName('background') as Phaser.GameObjects.Rectangle;
        const text = this.connectButton.getByName('text') as Phaser.GameObjects.Text;
        
        if (background && text) {
          background.setFillStyle(0x338833).removeInteractive();
          text.setText('Cüzdan Bağlandı');
        }
      }
      
      // Durum metnini güncelle
      if (this.statusText) {
        const shortAddress = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4);
        this.statusText.setText(`Bağlı Cüzdan: ${shortAddress}`);
      }
      
      // NFT'leri kontrol et
      if (characters && characters.length > 0) {
        this.handleNFTs();
      } else {
        // NFT bulunamadıysa
        if (this.loadingText) {
          this.loadingText.setText('NFT bulunamadı! Test için örnek karakterler oluşturuluyor...');
          
          // 2 saniye sonra test karakterleri oluştur
          this.time.delayedCall(2000, () => {
            this.createTestCharacters();
          });
        }
      }
    } else {
      // Cüzdan bağlı değilse
      if (this.statusText) {
        this.statusText.setText('Cüzdan bağlı değil');
      }
    }
  }
  
  private handleNFTs() {
    if (!this.externalData) return;
    
    const { characters, enemy } = this.externalData;
    
    if (this.loadingText) {
      this.loadingText.setText(`${characters.length} NFT karakter bulundu! Oyun başlatılıyor...`);
    }
    
    try {
      // NFT'lerden karakter oluştur
      const gameCharacters = characters.map(nft => 
        createCharacterFromNFT(
          nft.tokenId, 
          nft.metadata, 
          nft.contractAddress
        )
      );
      
      // Düşman oluştur
      let gameEnemy: Enemy | null = null;
      
      if (enemy) {
        gameEnemy = createBossEnemy(
          enemy.tokenId, 
          enemy.metadata, 
          enemy.contractAddress
        );
      } else {
        // Eğer düşman NFT'si yoksa varsayılan düşman oluştur
        gameEnemy = {
          id: 'enemy-default',
          tokenId: 'default',
          contractAddress: '',
          name: 'Karanlık Büyücü',
          health: 200,
          attack: 25,
          defense: 15,
          image: '/enemy.png'
        };
      }
      
      // 2 saniye sonra menü sahnesine geç
      this.time.delayedCall(2000, () => {
        this.scene.start('MenuScene', { 
          characters: gameCharacters, 
          enemy: gameEnemy 
        });
      });
    } catch (error) {
      console.error('NFT işleme hatası:', error);
      
      if (this.loadingText) {
        this.loadingText.setText('NFT işlenirken hata oluştu! Test karakterleri oluşturuluyor...');
        
        // 2 saniye sonra test karakterleri oluştur
        this.time.delayedCall(2000, () => {
          this.createTestCharacters();
        });
      }
    }
  }
  
  private createTestCharacters() {
    // Test için karakterler oluştur
    const fireCharacter = {
      id: 'character-test-1',
      tokenId: 'test-1',
      contractAddress: '',
      type: CharacterType.FIRE,
      name: 'Ateş Büyücüsü',
      stats: {
        health: 100,
        attack: 20,
        defense: 10,
        speed: 8,
        specialAttack: 30
      },
      image: '/fire-character.png',
      description: 'Ateş elementini kullanan güçlü bir büyücü'
    };
    
    const iceCharacter = {
      id: 'character-test-2',
      tokenId: 'test-2',
      contractAddress: '',
      type: CharacterType.ICE,
      name: 'Buz Savaşçısı',
      stats: {
        health: 120,
        attack: 15,
        defense: 15,
        speed: 5,
        specialAttack: 25
      },
      image: '/ice-character.png',
      description: 'Buz güçleriyle donatılmış cesur bir savaşçı'
    };
    
    const dinoCharacter = {
      id: 'character-test-3',
      tokenId: 'test-3',
      contractAddress: '',
      type: CharacterType.FIRE,
      name: 'Dino Karakter',
      stats: {
        health: 80,
        attack: 10,
        defense: 5,
        speed: 15,
        specialAttack: 25
      },
      image: '/dino.png',
      description: 'Hızlı ve çevik bir karakter'
    };
    
    // Test düşmanı
    const enemy = {
      id: 'enemy-test',
      tokenId: 'test-enemy',
      contractAddress: '',
      name: 'Karanlık Lord',
      health: 200,
      attack: 25,
      defense: 15,
      image: '/enemy.png'
    };
    
    // Menü sahnesine geç
    this.scene.start('MenuScene', {
      characters: [fireCharacter, iceCharacter, dinoCharacter],
      enemy
    });
  }
} 