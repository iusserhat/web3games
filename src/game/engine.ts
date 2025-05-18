import Phaser from 'phaser';
import { CharacterType } from './types';
import type { Character, Enemy, GameState } from './types';

// NFT metadata'sından karakter oluşturma
export const createCharacterFromNFT = (tokenId: string, metadata: any, contractAddress: string): Character => {
  // Metadata içindeki attributes'dan veya customType'dan karakter tipini belirle
  let type = CharacterType.FIRE; // varsayılan tip

  if (metadata.customType) {
    type = metadata.customType === 'ice' ? CharacterType.ICE : CharacterType.FIRE;
  } else {
    const typeAttribute = metadata.attributes?.find((attr: any) => 
      attr.trait_type === 'Type' || attr.trait_type === 'Element'
    );
    
    type = typeAttribute?.value?.toLowerCase() === 'ice' 
      ? CharacterType.ICE 
      : CharacterType.FIRE;
  }
  
  // Metadata içindeki attributes'dan istatistikleri çıkar
  const getStatValue = (statName: string, defaultValue: number = 10) => {
    const stat = metadata.attributes?.find((attr: any) => 
      attr.trait_type === statName
    );
    return stat ? Number(stat.value) : defaultValue;
  };

  // Özel (dino) karakteri 
  if (metadata.customType === 'dino') {
    return {
      id: `character-${tokenId}`,
      tokenId,
      contractAddress,
      type: CharacterType.FIRE, // Dino ateş tipinde olsun
      name: metadata.name || 'Dino Karakter',
      stats: {
        health: getStatValue('Health', 80),
        attack: getStatValue('Attack', 10),
        defense: getStatValue('Defense', 5),
        speed: getStatValue('Speed', 15),
        specialAttack: getStatValue('Special', 25)
      },
      image: metadata.image || '/dino.png',
      description: metadata.description || 'Hızlı ve çevik bir karakter'
    };
  }

  // Normal karakterler
  return {
    id: `character-${tokenId}`,
    tokenId,
    contractAddress,
    type,
    name: metadata.name || `NFT #${tokenId}`,
    stats: {
      health: getStatValue('Health', 100),
      attack: getStatValue('Attack', 15),
      defense: getStatValue('Defense', 10),
      speed: getStatValue('Speed', 5),
      specialAttack: getStatValue('Special', 20)
    },
    image: metadata.image || (type === CharacterType.FIRE ? '/fire-character.png' : '/ice-character.png'),
    description: metadata.description || ''
  };
};

// Düşman oluşturma (Boss)
export const createBossEnemy = (tokenId: string, metadata: any, contractAddress: string): Enemy => {
  // Metadata içindeki attributes'dan düşman istatistiklerini çıkar
  const getStatValue = (statName: string, defaultValue: number = 20) => {
    const stat = metadata.attributes?.find((attr: any) => 
      attr.trait_type === statName
    );
    return stat ? Number(stat.value) : defaultValue;
  };

  return {
    id: `enemy-${tokenId}`,
    tokenId,
    contractAddress,
    name: metadata.name || 'Karanlık Büyücü',
    health: getStatValue('Health', 200),
    attack: getStatValue('Attack', 25),
    defense: getStatValue('Defense', 15),
    image: metadata.image || '/enemy.png'
  };
};

// Saldırı hesaplama
export const calculateAttackDamage = (attacker: Character | Enemy, defender: Character | Enemy) => {
  const attackStat = 'stats' in attacker ? attacker.stats.attack : attacker.attack;
  const defenseStat = 'stats' in defender ? defender.stats.defense : defender.defense;
  
  // Basit hasar formülü: saldırı - savunma (minimum 1)
  let damage = Math.max(1, attackStat - defenseStat / 2);
  
  // Eğer karakter tipine göre zayıflık varsa daha fazla hasar
  if ('type' in attacker && 'type' in defender) {
    if (attacker.type === CharacterType.FIRE && defender.type === CharacterType.ICE) {
      damage *= 1.5; // Buz, ateşe karşı zayıf
    } else if (attacker.type === CharacterType.ICE && defender.type === CharacterType.FIRE) {
      damage *= 1.5; // Ateş, buza karşı zayıf
    }
  }
  
  return Math.floor(damage);
};

// Özel saldırı hesaplama
export const calculateSpecialAttackDamage = (attacker: Character, defender: Character | Enemy) => {
  const specialAttackStat = attacker.stats.specialAttack;
  const defenseStat = 'stats' in defender ? defender.stats.defense : defender.defense;
  
  // Özel saldırı hasarı (savunmayı daha az dikkate alır)
  let damage = Math.max(1, specialAttackStat - defenseStat / 4);
  
  // Karakter tipine göre zayıflık etkisi
  if ('type' in defender) {
    if (attacker.type === CharacterType.FIRE && defender.type === CharacterType.ICE) {
      damage *= 2; // Buz, ateşe karşı çok zayıf (özel saldırıda)
    } else if (attacker.type === CharacterType.ICE && defender.type === CharacterType.FIRE) {
      damage *= 2; // Ateş, buza karşı çok zayıf (özel saldırıda)
    }
  }
  
  return Math.floor(damage);
};

// Oyun durum yönetimi için bir sınıf
export class GameStateManager {
  private state: GameState;
  private eventEmitter: Phaser.Events.EventEmitter;
  
  constructor() {
    this.state = {
      playerCharacters: [],
      enemy: null,
      isPlayerTurn: true,
      gameOver: false,
      victory: false
    };
    
    this.eventEmitter = new Phaser.Events.EventEmitter();
  }
  
  // Oyunu başlat
  startGame(characters: Character[], enemy: Enemy) {
    this.state = {
      playerCharacters: characters,
      enemy,
      isPlayerTurn: true,
      gameOver: false,
      victory: false
    };
    
    this.eventEmitter.emit('gameStarted', this.state);
  }
  
  // Oyuncu saldırısı
  playerAttack(characterIndex: number, useSpecialAttack: boolean = false) {
    if (!this.state.isPlayerTurn || this.state.gameOver || !this.state.enemy) return;
    
    const character = this.state.playerCharacters[characterIndex];
    if (!character) return;
    
    const enemy = this.state.enemy;
    
    // Hasar hesaplama
    const damage = useSpecialAttack 
      ? calculateSpecialAttackDamage(character, enemy)
      : calculateAttackDamage(character, enemy);
    
    // Düşmana hasar ver
    const newEnemyHealth = Math.max(0, enemy.health - damage);
    const updatedEnemy = { ...enemy, health: newEnemyHealth };
    
    // Düşman öldü mü kontrol et
    const victory = newEnemyHealth <= 0;
    
    // Oyun durumunu güncelle
    this.state = {
      ...this.state,
      enemy: updatedEnemy,
      isPlayerTurn: !victory, // Düşman ölmediyse sıra düşmana geçer
      gameOver: victory,
      victory
    };
    
    this.eventEmitter.emit('playerAttack', {
      character,
      damage,
      enemy: updatedEnemy,
      specialAttack: useSpecialAttack
    });
    
    if (victory) {
      this.eventEmitter.emit('gameOver', { victory: true });
    } else {
      // Düşman sırasını otomatik oynat
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }
  
  // Düşman saldırısı
  enemyAttack() {
    if (this.state.isPlayerTurn || this.state.gameOver || !this.state.enemy) return;
    
    const enemy = this.state.enemy;
    
    // Rastgele bir karaktere saldır
    const targetIndex = Math.floor(Math.random() * this.state.playerCharacters.length);
    const targetCharacter = this.state.playerCharacters[targetIndex];
    
    // Hasar hesaplama
    const damage = calculateAttackDamage(enemy, targetCharacter);
    
    // Karaktere hasar ver
    const newCharacterHealth = Math.max(0, targetCharacter.stats.health - damage);
    const updatedCharacter = {
      ...targetCharacter,
      stats: { ...targetCharacter.stats, health: newCharacterHealth }
    };
    
    // Karakteri güncelle
    const updatedCharacters = [...this.state.playerCharacters];
    updatedCharacters[targetIndex] = updatedCharacter;
    
    // Tüm karakterler öldü mü kontrol et
    const allCharactersDead = updatedCharacters.every(character => character.stats.health <= 0);
    
    // Oyun durumunu güncelle
    this.state = {
      ...this.state,
      playerCharacters: updatedCharacters,
      isPlayerTurn: !allCharactersDead, // Tüm karakterler ölmediyse sıra oyuncuya geçer
      gameOver: allCharactersDead,
      victory: false
    };
    
    this.eventEmitter.emit('enemyAttack', {
      enemy,
      targetCharacter: updatedCharacter,
      damage
    });
    
    if (allCharactersDead) {
      this.eventEmitter.emit('gameOver', { victory: false });
    }
  }
  
  // Olayları dinleme
  on(event: string, callback: Function) {
    this.eventEmitter.on(event, callback);
  }
  
  // Güncel oyun durumunu al
  getState() {
    return this.state;
  }
} 