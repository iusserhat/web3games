import Phaser from 'phaser';
import type { Character, Enemy } from '../types';

export default class ResultScene extends Phaser.Scene {
  private victory: boolean = false;
  
  constructor() {
    super('ResultScene');
  }
  
  init(data: { victory: boolean }) {
    this.victory = data.victory;
  }
  
  create() {
    // Arka plan
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x333344)
      .setOrigin(0, 0);
    
    // Sonuç başlığı
    const titleText = this.victory ? 'ZAFER!' : 'YENİLDİNİZ!';
    const titleColor = this.victory ? '#ffff00' : '#ff5555';
    
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 3,
      titleText,
      { fontSize: '48px', color: titleColor, fontStyle: 'bold' }
    ).setOrigin(0.5, 0.5);
    
    // Açıklama
    const description = this.victory
      ? 'Düşmanı başarıyla yendiniz. NFT karakterleriniz güçlendi!'
      : 'Savaşı kaybettiniz. Bir dahaki sefere daha güçlü karakterler seçin!';
    
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      description,
      { fontSize: '24px', color: '#ffffff', align: 'center', wordWrap: { width: this.cameras.main.width - 100 } }
    ).setOrigin(0.5, 0.5);
    
    // Yeniden oyna butonu
    const button = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height * 0.7,
      200,
      50,
      0x666666
    ).setInteractive({ useHandCursor: true });
    
    const buttonText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height * 0.7,
      'Ana Menüye Dön',
      { fontSize: '20px', color: '#ffffff' }
    ).setOrigin(0.5, 0.5);
    
    // Buton etkileşimleri
    button.on('pointerover', () => {
      button.setFillStyle(0x888888);
    });
    
    button.on('pointerout', () => {
      button.setFillStyle(0x666666);
    });
    
    button.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
} 