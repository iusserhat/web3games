import Phaser from 'phaser';
import { GameStateManager } from '../engine';
import type { Character, Enemy, GameState } from '../types';

export default class MainGameScene extends Phaser.Scene {
  private gameState: GameStateManager;
  private characters: Character[] = [];
  private enemy: Enemy | null = null;
  
  private characterSprites: Phaser.GameObjects.Sprite[] = [];
  private broomstickSprites: Phaser.GameObjects.Sprite[] = [];
  private enemySprite: Phaser.GameObjects.Sprite | null = null;
  
  private healthBars: {[key: string]: {bar: Phaser.GameObjects.Graphics, text: Phaser.GameObjects.Text}} = {};
  private actionButtons: Phaser.GameObjects.Container[] = [];
  
  private infoText: Phaser.GameObjects.Text | null = null;
  private backgroundImage: Phaser.GameObjects.Image | null = null;
  private magicParticles: Phaser.GameObjects.Particles.ParticleEmitterManager | null = null;
  
  constructor() {
    super('MainGameScene');
    this.gameState = new GameStateManager();
  }
  
  init(data: { characters: Character[], enemy: Enemy }) {
    this.characters = data.characters;
    this.enemy = data.enemy;
  }
  
  preload() {
    // Yerel resim dosyaları (IPFS kullanmak yerine)
    this.load.image('fire-character', '/fire-character.png');
    this.load.image('ice-character', '/ice-character.png');
    this.load.image('enemy', '/enemy.png');
    this.load.image('dino', '/dino.png');
    
    // Süpürge ve arka plan görselleri
    this.load.image('broomstick', '/broomstick.png');
    this.load.image('sky-background', '/sky-background.jpg');
    this.load.image('magic-particle', '/magic-particle.png');
    
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
    
    // UI için gerekli assetler
    this.load.image('button', 'https://cdn.pixabay.com/photo/2016/06/13/13/46/button-1454413_960_720.png');
  }
  
  create() {
    // Gökyüzü arka planı
    this.backgroundImage = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'sky-background'
    ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);
      
    // Oyun başlığı
    this.add.text(
      this.cameras.main.width / 2, 
      20, 
      'NFT Karakter Savaşı', 
      { fontSize: '28px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }
    ).setOrigin(0.5, 0);
    
    // Büyü parçacıkları
    this.createMagicParticles();
    
    // Karakterleri oluştur
    this.createCharacters();
    
    // Düşmanı oluştur
    this.createEnemy();
    
    // Butonları oluştur
    this.createActionButtons();
    
    // Bilgi metnini oluştur
    this.infoText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height - 40,
      'Saldırı yapmak için karakteri ve saldırı türünü seçin',
      { fontSize: '18px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }
    ).setOrigin(0.5, 0.5);
    
    // Oyun durumunu başlat
    if (this.characters.length > 0 && this.enemy) {
      this.gameState.startGame(this.characters, this.enemy);
      
      // Oyun durumu olaylarını dinle
      this.setupEventListeners();
      
      // Karakterleri ve düşmanı animasyonlu şekilde başlat
      this.animateCharactersEnter();
      this.animateEnemyEnter();
    }
  }
  
  private createMagicParticles() {
    this.magicParticles = this.add.particles('magic-particle');
    
    // Farklı renklerde parçacıklar
    const fireEmitter = this.magicParticles.createEmitter({
      speed: { min: 10, max: 50 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      tint: 0xff6666,
      on: false
    });
    
    const iceEmitter = this.magicParticles.createEmitter({
      speed: { min: 10, max: 50 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      tint: 0x66ccff,
      on: false
    });
    
    this.magicParticles.setDepth(10);
    
    return { fireEmitter, iceEmitter };
  }
  
  private createCharacters() {
    const startX = 150;
    const y = this.cameras.main.height / 2;
    const spacing = 200;
    
    this.characters.forEach((character, index) => {
      // Süpürge sprite'ı
      const broomSprite = this.add.sprite(
        startX + index * spacing,
        y + 40,
        'broomstick'
      ).setScale(0.3);
      
      // Karakter sprite'ı
      const sprite = this.add.sprite(
        startX + index * spacing,
        y,
        character.image ? `character-${character.tokenId}` : character.type === 'fire' ? 'fire-character' : 'ice-character'
      ).setScale(0.5);
      
      // Karakter ismi
      this.add.text(
        sprite.x,
        sprite.y - 100,
        character.name,
        { fontSize: '16px', color: '#ffffff', stroke: '#000000', strokeThickness: 2 }
      ).setOrigin(0.5, 0.5);
      
      // Karakter tipi
      this.add.text(
        sprite.x,
        sprite.y - 80,
        `Tip: ${character.type === 'fire' ? 'Ateş' : 'Buz'}`,
        { fontSize: '14px', color: character.type === 'fire' ? '#ff7777' : '#77ddff', stroke: '#000000', strokeThickness: 2 }
      ).setOrigin(0.5, 0.5);
      
      // Can çubuğu
      this.createHealthBar(character.id, sprite.x, sprite.y + 90, character.stats.health);
      
      // Sprite'ları kaydet
      this.characterSprites.push(sprite);
      this.broomstickSprites.push(broomSprite);
      
      // Interaktif yap
      sprite.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.onCharacterSelected(index));
        
      // Karakterleri ve süpürgeleri havada uçuruyor gibi göster
      this.animateCharacterFloating(sprite, broomSprite);
    });
  }
  
  private animateCharacterFloating(charSprite: Phaser.GameObjects.Sprite, broomSprite: Phaser.GameObjects.Sprite) {
    // Karakter için hafif yukarı-aşağı hareketi
    this.tweens.add({
      targets: charSprite,
      y: charSprite.y - 5,
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    
    // Süpürge için aynı hareketi yap (karakter ile senkronize)
    this.tweens.add({
      targets: broomSprite,
      y: broomSprite.y - 5,
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
  
  private animateCharactersEnter() {
    // Tüm karakterler ve süpürgeleri için
    this.characterSprites.forEach((sprite, index) => {
      const broomSprite = this.broomstickSprites[index];
      
      // Başlangıçta ekranın solundan dışarıda
      sprite.x = -100;
      broomSprite.x = -100;
      
      // Sırayla sahneye gir (sıralar arasında gecikme ile)
      const delay = index * 300;
      
      // Süpürge girişi
      this.tweens.add({
        targets: broomSprite,
        x: 150 + index * 200,
        duration: 1500,
        delay: delay,
        ease: 'Back.easeOut'
      });
      
      // Karakter girişi (süpürge ile birlikte)
      this.tweens.add({
        targets: sprite,
        x: 150 + index * 200,
        duration: 1500,
        delay: delay,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Giriş tamamlandıktan sonra yukarı-aşağı hareketini başlat
          this.animateCharacterFloating(sprite, broomSprite);
        }
      });
    });
  }
  
  private createEnemy() {
    if (!this.enemy) return;
    
    const x = this.cameras.main.width - 200;
    const y = this.cameras.main.height / 2;
    
    // Düşman sprite'ı
    this.enemySprite = this.add.sprite(
      x,
      y,
      this.enemy.image ? `enemy-${this.enemy.tokenId}` : 'enemy'
    ).setScale(0.7);
    
    // Düşman ismi
    this.add.text(
      x,
      y - 100,
      this.enemy.name,
      { fontSize: '20px', color: '#ff5555', stroke: '#000000', strokeThickness: 2 }
    ).setOrigin(0.5, 0.5);
    
    // Can çubuğu
    this.createHealthBar(this.enemy.id, x, y + 100, this.enemy.health);
    
    // Düşmanı sürekli olarak hafifçe hareket ettir
    this.tweens.add({
      targets: this.enemySprite,
      y: y - 10,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
  
  private animateEnemyEnter() {
    if (!this.enemySprite) return;
    
    // Başlangıçta ekranın sağından dışarıda
    this.enemySprite.x = this.cameras.main.width + 100;
    
    // Sahneye giriş animasyonu
    this.tweens.add({
      targets: this.enemySprite,
      x: this.cameras.main.width - 200,
      duration: 1500,
      delay: 1000, // Karakterlerden sonra gir
      ease: 'Back.easeOut'
    });
  }
  
  private createHealthBar(id: string, x: number, y: number, maxHealth: number) {
    // Can çubuğu arkaplanı
    const background = this.add.graphics()
      .fillStyle(0x444444, 1)
      .fillRect(x - 50, y, 100, 20)
      .setDepth(0);
    
    // Can çubuğu
    const bar = this.add.graphics()
      .fillStyle(0x00ff00, 1)
      .fillRect(x - 50, y, 100, 20)
      .setDepth(1);
    
    // Can metni
    const text = this.add.text(x, y + 10, `${maxHealth}/${maxHealth}`, {
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000000', 
      strokeThickness: 1
    }).setOrigin(0.5, 0.5);
    
    this.healthBars[id] = { bar, text };
  }
  
  private createActionButtons() {
    const buttonY = this.cameras.main.height - 100;
    const buttonWidth = 150;
    const spacing = 20;
    const buttonX = this.cameras.main.width / 2 - buttonWidth - spacing / 2;
    
    // Normal Saldırı Butonu
    const attackButton = this.createButton(
      buttonX, 
      buttonY, 
      'Normal Saldırı',
      () => this.onAttackSelected(false)
    );
    
    // Özel Saldırı Butonu
    const specialButton = this.createButton(
      buttonX + buttonWidth + spacing, 
      buttonY, 
      'Özel Saldırı',
      () => this.onAttackSelected(true)
    );
    
    this.actionButtons.push(attackButton, specialButton);
    
    // Butonları başlangıçta devre dışı bırak (önce karakter seçilmeli)
    this.setButtonsEnabled(false);
  }
  
  private createButton(x: number, y: number, text: string, callback: Function): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    
    // Buton arka planı
    const background = this.add.graphics()
      .fillStyle(0x666666, 1)
      .fillRoundedRect(0, 0, 150, 40, 10)
      .setName('background');
    
    // Buton metni
    const buttonText = this.add.text(75, 20, text, {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5, 0.5);
    
    container.add([background, buttonText]);
    
    // Interaktif yap
    background.setInteractive({ useHandCursor: true })
      .on('pointerover', () => background.fillStyle(0x888888, 1).fillRoundedRect(0, 0, 150, 40, 10))
      .on('pointerout', () => background.fillStyle(0x666666, 1).fillRoundedRect(0, 0, 150, 40, 10))
      .on('pointerdown', () => callback());
    
    return container;
  }
  
  private setButtonsEnabled(enabled: boolean) {
    this.actionButtons.forEach(button => {
      const background = button.getByName('background') as Phaser.GameObjects.Graphics;
      if (background) {
        background.setInteractive(enabled ? { useHandCursor: true } : false);
        background.fillStyle(enabled ? 0x666666 : 0x444444, 1).fillRoundedRect(0, 0, 150, 40, 10);
      }
    });
  }
  
  private updateHealthBar(id: string, currentHealth: number, maxHealth: number) {
    const healthBar = this.healthBars[id];
    if (!healthBar) return;
    
    const { bar, text } = healthBar;
    const percent = Math.max(0, currentHealth / maxHealth);
    const color = percent > 0.6 ? 0x00ff00 : percent > 0.3 ? 0xffff00 : 0xff0000;
    
    bar.clear()
      .fillStyle(color, 1)
      .fillRect(bar.x, bar.y, 100 * percent, 20);
    
    text.setText(`${currentHealth}/${maxHealth}`);
  }
  
  private selectedCharacterIndex: number = -1;
  
  private onCharacterSelected(index: number) {
    const state = this.gameState.getState();
    
    // Karakter seçimini kontrol et
    if (!state.isPlayerTurn || state.gameOver) return;
    
    const character = this.characters[index];
    if (character.stats.health <= 0) {
      this.showInfoText('Bu karakter savaşamaz!');
      return;
    }
    
    // Önceki seçili karakteri normal duruma getir
    if (this.selectedCharacterIndex >= 0) {
      const prevSprite = this.characterSprites[this.selectedCharacterIndex];
      prevSprite.setTint(0xffffff);
    }
    
    // Yeni karakteri seç
    this.selectedCharacterIndex = index;
    const sprite = this.characterSprites[index];
    sprite.setTint(0xaaffaa);
    
    // Butonları etkinleştir
    this.setButtonsEnabled(true);
    
    this.showInfoText(`${character.name} seçildi. Saldırı türü seçin.`);
  }
  
  private onAttackSelected(isSpecial: boolean) {
    const state = this.gameState.getState();
    
    // Saldırıyı kontrol et
    if (!state.isPlayerTurn || state.gameOver || this.selectedCharacterIndex < 0) return;
    
    // Saldırıyı gerçekleştir
    this.gameState.playerAttack(this.selectedCharacterIndex, isSpecial);
    
    // Butonları devre dışı bırak
    this.setButtonsEnabled(false);
    
    // Karakter seçimini temizle
    if (this.selectedCharacterIndex >= 0) {
      const sprite = this.characterSprites[this.selectedCharacterIndex];
      sprite.setTint(0xffffff);
      this.selectedCharacterIndex = -1;
    }
  }
  
  private showInfoText(message: string) {
    if (this.infoText) {
      this.infoText.setText(message);
    }
  }
  
  private setupEventListeners() {
    // Oyuncu saldırı olayı
    this.gameState.on('playerAttack', (data: any) => {
      const { character, damage, enemy, specialAttack } = data;
      
      this.updateHealthBar(enemy.id, enemy.health, this.enemy?.health || 200);
      
      // Saldırı animasyonu
      if (this.selectedCharacterIndex >= 0 && this.enemySprite && this.magicParticles) {
        const charSprite = this.characterSprites[this.selectedCharacterIndex];
        const broomSprite = this.broomstickSprites[this.selectedCharacterIndex];
        
        const { fireEmitter, iceEmitter } = this.magicParticles as any;
        const emitter = character.type === 'fire' ? fireEmitter : iceEmitter;
        
        // Karakter ve süpürge düşmana doğru ilerlesin
        this.tweens.add({
          targets: [charSprite, broomSprite],
          x: this.enemySprite.x - 150,
          duration: 1000,
          ease: 'Sine.easeInOut',
          onStart: () => {
            // Saldırı tipine göre parçacık efekti başlat
            emitter.start();
            emitter.setPosition(charSprite.x, charSprite.y);
          },
          onUpdate: () => {
            // Partikülü karakteri takip et
            emitter.setPosition(charSprite.x + 30, charSprite.y);
          },
          onComplete: () => {
            // Düşman hasar efekti
            this.tweens.add({
              targets: this.enemySprite,
              alpha: 0.5,
              scaleX: 0.9,
              scaleY: 0.9,
              duration: 100,
              yoyo: true,
              repeat: 3,
              onComplete: () => {
                // Karakter ve süpürge yerine dönsün
                this.tweens.add({
                  targets: [charSprite, broomSprite],
                  x: charSprite.getData('originalX') || 150 + this.selectedCharacterIndex * 200,
                  duration: 1000,
                  ease: 'Sine.easeInOut',
                  onComplete: () => {
                    emitter.stop();
                  }
                });
              }
            });
          }
        });
      }
      
      this.showInfoText(`${character.name}, ${specialAttack ? 'özel' : 'normal'} saldırıyla ${damage} hasar verdi!`);
    });
    
    // Düşman saldırı olayı
    this.gameState.on('enemyAttack', (data: any) => {
      const { enemy, targetCharacter, damage } = data;
      
      // Can çubuğunu güncelle
      this.updateHealthBar(
        targetCharacter.id, 
        targetCharacter.stats.health, 
        this.characters.find(c => c.id === targetCharacter.id)?.stats.health || 100
      );
      
      // Saldırı animasyonu
      if (this.enemySprite && this.magicParticles) {
        const targetIndex = this.characters.findIndex(c => c.id === targetCharacter.id);
        if (targetIndex >= 0) {
          const targetSprite = this.characterSprites[targetIndex];
          
          const { fireEmitter } = this.magicParticles as any;
          const emitter = fireEmitter; // Düşman ateş saldırısı kullanıyor
          
          // Düşman karaktere doğru hareket etsin
          this.tweens.add({
            targets: this.enemySprite,
            x: targetSprite.x + 150,
            duration: 1000,
            ease: 'Sine.easeInOut',
            onStart: () => {
              // Düşman saldırı efekti
              emitter.setTint(0xff3366);
              emitter.start();
              emitter.setPosition(this.enemySprite.x, this.enemySprite.y);
            },
            onUpdate: () => {
              // Partikülü düşmanı takip et
              emitter.setPosition(this.enemySprite.x - 30, this.enemySprite.y);
            },
            onComplete: () => {
              // Karakter hasar efekti
              this.tweens.add({
                targets: targetSprite,
                alpha: 0.5,
                scaleX: 0.4,
                scaleY: 0.4,
                duration: 100,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                  // Düşman yerine dönsün
                  this.tweens.add({
                    targets: this.enemySprite,
                    x: this.cameras.main.width - 200,
                    duration: 1000,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                      emitter.stop();
                    }
                  });
                }
              });
            }
          });
        }
      }
      
      this.showInfoText(`${enemy.name}, ${targetCharacter.name}'e ${damage} hasar verdi!`);
    });
    
    // Oyun bitti olayı
    this.gameState.on('gameOver', (data: any) => {
      const { victory } = data;
      
      const message = victory 
        ? 'Tebrikler! Düşmanı yendiniz!' 
        : 'Oyun bitti. Tüm karakterleriniz yenildi!';
      
      this.showInfoText(message);
      
      // Zafer animasyonu
      if (victory && this.enemySprite) {
        this.tweens.add({
          targets: this.enemySprite,
          alpha: 0,
          scaleX: 2,
          scaleY: 2,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => {
            this.enemySprite?.destroy();
          }
        });
      }
      
      // 3 saniye sonra sonuç ekranına git
      this.time.delayedCall(3000, () => {
        this.scene.start('ResultScene', { victory });
      });
    });
  }
  
  update() {
    // Her kare güncelleme - gerekirse burada ekstra animasyonlar eklenebilir
  }
} 