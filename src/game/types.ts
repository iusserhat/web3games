// Karakter tipleri
export enum CharacterType {
  FIRE = 'fire',
  ICE = 'ice'
}

// Karakter niteliklerini tanımlayan arayüz
export interface CharacterStats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  specialAttack: number;
}

// Oyun karakteri arayüzü
export interface Character {
  id: string;
  tokenId: string;
  contractAddress: string;
  type: CharacterType;
  name: string;
  stats: CharacterStats;
  image: string;
  description: string;
}

// Düşman arayüzü
export interface Enemy {
  id: string;
  tokenId: string;
  contractAddress: string;
  name: string;
  health: number;
  attack: number;
  defense: number;
  image: string;
}

// Oyun sahnesinin durumu
export interface GameState {
  playerCharacters: Character[];
  enemy: Enemy | null;
  isPlayerTurn: boolean;
  gameOver: boolean;
  victory: boolean;
} 