import Phaser from 'phaser';
import type { Character, Enemy } from '../types';
import { createCharacterFromNFT, createBossEnemy } from '../engine';

export default class MenuScene extends Phaser.Scene {
  private characters: Character[] = [];
  private enemy: Enemy | null = null;
  private characterButtons: Phaser.GameObjects.Container[] = [];
  private selectedCharacters: Character[] = [];
  private startButton: Phaser.GameObjects.Container | null = null;
  
  constructor() {
    super('MenuScene');
  }
  
  init(data: { characters: Character[], enemy: Enemy }) {
    if (data.characters) {
      this.characters = data.characters;
    }
    
    if (data.enemy) {
      this.enemy = data.enemy;
    }
    
    this.selectedCharacters = [];
  }
  
  preload() {
    // Yerel resim dosyaları
    this.load.image('fire-character', '/fire-character.png');
    this.load.image('ice-character', '/ice-character.png');
    this.load.image('enemy', '/enemy.png');
    this.load.image('dino', '/dino.png');
    
    // OpenSea logo
    this.load.image('opensea-logo', 'https://opensea.io/static/images/logos/opensea-logo.svg');
    
    // Karakter NFT resimlerini yükle - URL kontrolü yap
    this.characters.forEach(character => {
      if (character.image) {
        try {
          // Dosya sistemi yolu mu yoksa URL mi kontrol et
          if (character.image.startsWith('http')) {
            // URL ise doğrudan yükle
            this.load.image(`character-${character.tokenId}`, character.image);
          } else {
            // Yerel dosya ise başında / olduğundan emin ol
            const path = character.image.startsWith('/') ? character.image : `/${character.image}`;
            this.load.image(`character-${character.tokenId}`, path);
          }
        } catch (e) {
          console.error(`Karakter resmi yüklenemedi: ${character.image}`);
        }
      }
    });
    
    // Düşman NFT resmini yükle
    if (this.enemy && this.enemy.image) {
      try {
        // Dosya sistemi yolu mu yoksa URL mi kontrol et
        if (this.enemy.image.startsWith('http')) {
          this.load.image(`enemy-${this.enemy.tokenId}`, this.enemy.image);
        } else {
          const path = this.enemy.image.startsWith('/') ? this.enemy.image : `/${this.enemy.image}`;
          this.load.image(`enemy-${this.enemy.tokenId}`, path);
        }
      } catch (e) {
        console.error(`Düşman resmi yüklenemedi: ${this.enemy.image}`);
      }
    }
  }
  
  create() {
    // Arka plan
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x222233)
      .setOrigin(0, 0);
    
    // Başlık
    this.add.text(
      this.cameras.main.width / 2,
      50,
      'NFT Karakter Savaş Oyunu',
      { fontSize: '36px', color: '#ffffff', fontStyle: 'bold' }
    ).setOrigin(0.5, 0.5);
    
    // Alt başlık
    this.add.text(
      this.cameras.main.width / 2,
      100,
      'Savaşacak 2 karakteri seçin',
      { fontSize: '24px', color: '#aaaaff' }
    ).setOrigin(0.5, 0.5);
    
    // Karakter butonlarını oluştur
    this.createCharacterButtons();
    
    // Oyunu başlat butonu
    this.createStartButton();
    
    // Cüzdan bağlantı durumu
    this.createWalletStatus();
  }
  
  private createCharacterButtons() {
    const startY = 180;
    const spacing = 320; // Daha fazla bilgi için aralık arttırıldı
    const columns = 2; // Her satırda iki karakter göster
    
    this.characters.forEach((character, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      
      const x = (this.cameras.main.width / (columns + 1)) * (column + 1);
      const y = startY + row * spacing;
      
      // Karakter butonu container
      const container = this.add.container(x, y);
      
      // Buton arka planı
      const background = this.add.rectangle(0, 0, 280, 300, 0x444455)
        .setStrokeStyle(2, 0x666677)
        .setName('background');
      
      // Karakter resmi
      const image = this.add.sprite(
        0, 
        -100,
        character.image ? `character-${character.tokenId}` : character.type === 'fire' ? 'fire-character' : character.type === 'ice' ? 'ice-character' : 'dino'
      ).setScale(0.3);
      
      // Karakter ismi
      const nameText = this.add.text(
        0,
        -40,
        character.name,
        { fontSize: '18px', color: '#ffffff', align: 'center', fontStyle: 'bold' }
      ).setOrigin(0.5, 0.5);
      
      // Karakter tipi
      const typeColor = character.type === 'fire' ? '#ff7777' : character.type === 'ice' ? '#77ddff' : '#ffaa00';
      const typeText = this.add.text(
        0,
        -15,
        `Tip: ${character.type === 'fire' ? 'Ateş' : character.type === 'ice' ? 'Buz' : 'Dino'}`,
        { fontSize: '16px', color: typeColor }
      ).setOrigin(0.5, 0.5);
      
      // İstatistikler
      const statsText = this.add.text(
        0,
        15,
        `HP: ${character.stats.health}\nATK: ${character.stats.attack}\nDEF: ${character.stats.defense}`,
        { fontSize: '14px', color: '#cccccc', align: 'center' }
      ).setOrigin(0.5, 0.5);
      
      // Kontrat adresi (kısaltılmış)
      const shortAddress = character.contractAddress.substring(0, 6) + '...' + character.contractAddress.substring(character.contractAddress.length - 4);
      const addressText = this.add.text(
        0,
        55,
        `Kontrat: ${shortAddress}`,
        { fontSize: '12px', color: '#aaaaaa', align: 'center' }
      ).setOrigin(0.5, 0.5);
      
      // OpenSea bağlantısı
      const openseaUrl = `https://testnets.opensea.io/assets/sepolia/${character.contractAddress}/1`;
      const openseaText = this.add.text(
        0,
        80,
        'OpenSea\'da Görüntüle',
        { fontSize: '14px', color: '#4f9ce0', align: 'center', fontStyle: 'bold' }
      ).setOrigin(0.5, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          // URL'yi tarayıcıda aç (konsola yazdır)
          console.log(`Opening OpenSea URL: ${openseaUrl}`);
          window.open(openseaUrl, '_blank');
        });
      
      // OpenSea logosu
      const logo = this.add.image(
        -75,
        80,
        'opensea-logo'
      ).setScale(0.15);
      
      container.add([background, image, nameText, typeText, statsText, addressText, openseaText, logo]);
      
      // Interaktif yap
      background.setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          background.setStrokeStyle(2, 0xaaaaff);
        })
        .on('pointerout', () => {
          if (!this.selectedCharacters.includes(character)) {
            background.setStrokeStyle(2, 0x666677);
          }
        })
        .on('pointerdown', () => {
          this.toggleCharacterSelection(character, container);
        });
      
      this.characterButtons.push(container);
    });
  }
  
  private toggleCharacterSelection(character: Character, container: Phaser.GameObjects.Container) {
    const background = container.getByName('background') as Phaser.GameObjects.Rectangle;
    
    // Eğer zaten seçiliyse, seçimi kaldır
    const selectedIndex = this.selectedCharacters.findIndex(c => c.id === character.id);
    
    if (selectedIndex >= 0) {
      this.selectedCharacters.splice(selectedIndex, 1);
      background.setFillStyle(0x444455).setStrokeStyle(2, 0x666677);
    } 
    // Değilse ve 2'den az karakter seçilmişse, seç
    else if (this.selectedCharacters.length < 2) {
      this.selectedCharacters.push(character);
      background.setFillStyle(0x335533).setStrokeStyle(2, 0x33ff33);
    }
    
    // Başlat butonunu güncelle
    this.updateStartButton();
  }
  
  private createStartButton() {
    const container = this.add.container(
      this.cameras.main.width / 2,
      this.cameras.main.height - 100
    );
    
    // Buton arka planı
    const background = this.add.rectangle(0, 0, 200, 50, 0x444466)
      .setName('background');
    
    // Buton metni
    const text = this.add.text(
      0,
      0,
      'Savaşa Başla',
      { fontSize: '20px', color: '#aaaaaa' }
    ).setOrigin(0.5, 0.5)
      .setName('text');
    
    container.add([background, text]);
    
    // Başlangıçta devre dışı
    this.startButton = container;
    this.updateStartButton();
  }
  
  private updateStartButton() {
    if (!this.startButton) return;
    
    const background = this.startButton.getByName('background') as Phaser.GameObjects.Rectangle;
    const text = this.startButton.getByName('text') as Phaser.GameObjects.Text;
    
    const isEnabled = this.selectedCharacters.length === 2;
    
    if (isEnabled) {
      background.setFillStyle(0x445577).setStrokeStyle(2, 0x5588ff);
      text.setColor('#ffffff');
      
      // Interaktif yap
      if (!background.input) {
        background.setInteractive({ useHandCursor: true })
          .on('pointerover', () => {
            background.setFillStyle(0x5577aa);
          })
          .on('pointerout', () => {
            background.setFillStyle(0x445577);
          })
          .on('pointerdown', () => {
            this.startGame();
          });
      }
    } else {
      background.setFillStyle(0x444466).setStrokeStyle(0);
      text.setColor('#aaaaaa');
      
      // Interaktif özelliği kaldır
      if (background.input) {
        background.removeInteractive();
      }
    }
  }
  
  private createWalletStatus() {
    // Cüzdan bağlantı durumu ve adres
    const walletText = 'Cüzdan Bağlandı: 0x...';
    
    this.add.text(
      20,
      this.cameras.main.height - 50,
      walletText,
      { fontSize: '16px', color: '#66aa66' }
    ).setOrigin(0, 0.5);
    
    // Cüzdan bağlantısı kesme butonu
    const disconnectButton = this.add.rectangle(
      170,
      this.cameras.main.height - 50,
      120,
      30,
      0x553333
    ).setInteractive({ useHandCursor: true });
    
    this.add.text(
      170,
      this.cameras.main.height - 50,
      'Bağlantıyı Kes',
      { fontSize: '14px', color: '#ff6666' }
    ).setOrigin(0.5, 0.5);
    
    disconnectButton.on('pointerover', () => {
      disconnectButton.setFillStyle(0x774444);
    });
    
    disconnectButton.on('pointerout', () => {
      disconnectButton.setFillStyle(0x553333);
    });
    
    disconnectButton.on('pointerdown', () => {
      // Cüzdan bağlantısını kes
      this.scene.start('ConnectWalletScene');
    });
    
    // NFT Bilgileri
    this.add.text(
      this.cameras.main.width - 20,
      this.cameras.main.height - 50,
      "NFT Koleksiyonları: Sepolia Test Ağı",
      { fontSize: '14px', color: '#aaaaaa' }
    ).setOrigin(1, 0.5);
  }
  
  private startGame() {
    // Test için basit bir düşman oluştur
    if (!this.enemy) {
      this.enemy = {
        id: 'enemy-1',
        tokenId: '1',
        name: 'Karanlık Büyücü',
        health: 200,
        attack: 25,
        defense: 15,
        image: ''
      };
    }
    
    // Oyun sahnesine geç
    this.scene.start('MainGameScene', {
      characters: this.selectedCharacters,
      enemy: this.enemy
    });
  }
} 