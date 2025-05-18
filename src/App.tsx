import { useState, useEffect } from 'react'
import './App.css'
import React from 'react'

// Assets'ten görselleri import et
import atesPng from './assets/ateş.png'
import suPng from './assets/su.png'
import canavarPng from './assets/canavar.png'
import dinoJpeg from './assets/dino.jpeg'

// NFT kontrat adresleri - web3 olmadan direk sabit kullanacağız
const NFT_ADDRESSES = {
  FIRE: "0xf33528dC48A65e3be3427A714C5f5571D311d7C3",
  ICE: "0x6C18119bb4b60Dd92bCCdfAe88bD890016279740",
  ENEMY: "0x079dD9B6E74753A70426e884B95421d25472DBf5",
  DINO: "0x81A75ed365Fe5F5E39093fb78bde942939cC690d"
};

// OpenSea bağlantıları
const OPENSEA_LINKS = {
  FIRE: `https://testnets.opensea.io/assets/sepolia/${NFT_ADDRESSES.FIRE}/1`,
  ICE: `https://testnets.opensea.io/assets/sepolia/${NFT_ADDRESSES.ICE}/1`,
  ENEMY: `https://testnets.opensea.io/assets/sepolia/${NFT_ADDRESSES.ENEMY}/1`,
  DINO: `https://testnets.opensea.io/assets/sepolia/${NFT_ADDRESSES.DINO}/1`
};

// Karakter karakteristikleri
const CHARACTERS = {
  FIRE: {
    name: "Ateş Karakteri",
    description: "Ateş elementini kullanan güçlü bir büyücü",
    image: atesPng,
    health: 100,
    attack: 20,
    defense: 10,
    speed: 8,
    special: 30
  },
  ICE: {
    name: "Buz Karakteri",
    description: "Buz güçleriyle donatılmış cesur bir savaşçı",
    image: suPng,
    health: 120,
    attack: 15, 
    defense: 15,
    speed: 5,
    special: 25
  },
  DINO: {
    name: "Dino Karakter",
    description: "Hızlı ve çevik bir karakter",
    image: dinoJpeg,
    health: 80,
    attack: 10,
    defense: 5,
    speed: 15,
    special: 25
  },
  ENEMY: {
    name: "Karanlık Lord",
    description: "Karanlık güçlere hükmeden güçlü bir düşman",
    image: canavarPng,
    health: 200,
    attack: 25,
    defense: 15,
    speed: 10
  }
};

// Oyun Ekranı - Basit Versiyon (Phaser ve Web3 olmadan)
const GameScreen = () => {
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState<'victory' | 'defeat' | null>(null);
  const [message, setMessage] = useState("");
  const [battleTurn, setBattleTurn] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [attackingCharIndex, setAttackingCharIndex] = useState(0);
  const [magicEffect, setMagicEffect] = useState(false);
  const [magicColor, setMagicColor] = useState("#ff6666"); // Ateş büyüsü rengi
  const [isCooldown, setIsCooldown] = useState(false);
  const [battleMessage, setBattleMessage] = useState<string>("Düşmanı yenmek için bir karaktere tıkla!");
  
  // Karakter seçimi
  const toggleCharacterSelection = (characterType: string) => {
    if (selectedCharacters.includes(characterType)) {
      setSelectedCharacters(selectedCharacters.filter(c => c !== characterType));
    } else if (selectedCharacters.length < 2) {
      setSelectedCharacters([...selectedCharacters, characterType]);
    }
  };
  
  // Savaşı başlat
  const startBattle = () => {
    if (selectedCharacters.length !== 2) {
      setMessage("Lütfen 2 karakter seçin");
      return;
    }
    
    setMessage("");
    setGameStarted(true);
    setPlayerHealth(100);
    setEnemyHealth(200);
    setBattleTurn(0);
    setBattleMessage("Düşmanı yenmek için bir karaktere tıkla!");
  };
  
  // Karakter saldırısı
  const characterAttack = (index: number) => {
    // Cooldown varsa işlemi yapma
    if (isCooldown) return;
    
    // Cooldown başlat
    setIsCooldown(true);
    
    // Büyü rengini karakter tipine göre ayarla
    const charType = selectedCharacters[index];
    const isFireType = charType === 'FIRE';
    setMagicColor(isFireType ? "#ff6666" : charType === 'ICE' ? "#66ccff" : "#ffcc00");
    
    // Saldırı animasyonu başlat
    setAttackingCharIndex(index);
    setAttackAnimation(true);
    setBattleMessage(`${charType} karakteri saldırıyor!`);
    
    // 0.3 saniye sonra büyü efektini başlat
    setTimeout(() => {
      setMagicEffect(true);
      
      // 1 saniye sonra saldırıyı bitir
      setTimeout(() => {
        setAttackAnimation(false);
        
        // 0.5 saniye sonra büyü efektini kapat
        setTimeout(() => {
          setMagicEffect(false);
          
          // Düşmana hasar ver (karakter tipine göre farklı hasar)
          const baseAttack = CHARACTERS[charType as keyof typeof CHARACTERS].attack;
          const damage = Math.floor(baseAttack * (Math.random() * 0.4 + 0.8)); // %80-%120 arası rastgele hasar
          const newEnemyHealth = Math.max(0, enemyHealth - damage);
          setEnemyHealth(newEnemyHealth);
          
          // Hasar bilgisini göster
          setBattleMessage(`${CHARACTERS[charType as keyof typeof CHARACTERS].name} düşmana ${damage} hasar verdi!`);
          
          // Düşman öldü mü kontrol et
          if (newEnemyHealth === 0) {
            setTimeout(() => {
              setGameResult('victory');
            }, 1000);
            return;
          }
          
          // Düşman saldırısı
          setTimeout(() => {
            setBattleMessage("Düşman saldırıyor!");
            
            // 1 saniye sonra düşman saldırısını uygula
            setTimeout(() => {
              // Rastgele bir karaktere saldır
              const randomCharIndex = Math.floor(Math.random() * selectedCharacters.length);
              const targetCharType = selectedCharacters[randomCharIndex];
              
              // Düşman saldırı gücü
              const enemyAttack = CHARACTERS.ENEMY.attack;
              const damage = Math.floor(enemyAttack * (Math.random() * 0.3 + 0.7)); // %70-%100 arası rastgele hasar
              const newPlayerHealth = Math.max(0, playerHealth - damage);
              setPlayerHealth(newPlayerHealth);
              
              // Hasar bilgisini göster
              setBattleMessage(`Düşman, ${CHARACTERS[targetCharType as keyof typeof CHARACTERS].name}'e ${damage} hasar verdi!`);
              
              // Oyuncu öldü mü kontrol et
              if (newPlayerHealth === 0) {
                setTimeout(() => {
                  setGameResult('defeat');
                }, 1000);
                return;
              }
              
              // Cooldown'u kaldır
              setTimeout(() => {
                setIsCooldown(false);
                setBattleMessage("Düşmanı yenmek için bir karaktere tıkla!");
              }, 1000);
            }, 1000);
          }, 1000);
        }, 500);
      }, 1000);
    }, 300);
  };
  
  // Savaş turu (artık kullanılmıyor)
  const performNextTurn = () => {
    // İlk turda bekleme yap
    if (battleTurn === 0) {
      setBattleTurn(1);
      return;
    }
  };
  
  // Oyunu yeniden başlat
  const restartGame = () => {
    setSelectedCharacters([]);
    setGameStarted(false);
    setGameResult(null);
    setMessage("");
    setBattleTurn(0);
    setPlayerHealth(100);
    setEnemyHealth(200);
    setAttackAnimation(false);
    setMagicEffect(false);
    setIsCooldown(false);
    setBattleMessage("Düşmanı yenmek için bir karaktere tıkla!");
  };
  
  if (gameResult) {
    return (
      <div className="game-result">
        <h2 className={gameResult === 'victory' ? 'victory-title' : 'defeat-title'}>
          {gameResult === 'victory' ? 'ZAFER!' : 'YENİLDİNİZ!'}
        </h2>
        
        <p>{gameResult === 'victory' 
          ? 'Düşmanı başarıyla yendiniz. NFT karakterleriniz güçlendi!' 
          : 'Savaşı kaybettiniz. Bir dahaki sefere daha güçlü karakterler seçin!'}
        </p>
        
        <button className="play-again-btn" onClick={restartGame}>Tekrar Oyna</button>
      </div>
    );
  }
  
  if (gameStarted) {
    return (
      <div className="battle-scene">
        {/* Savaş ortamı */}
        <div className="battle-sky">
          <div className="moon"></div>
          <div className="stars"></div>
          
          <div className="castle left-castle"></div>
          <div className="castle right-castle"></div>
          
          <div className="trees"></div>
        </div>
        
        {/* Karakterler ve canavar */}
        <div className="battle-characters">
          {/* Oyuncu karakterleri */}
          <div className="player-side">
            {selectedCharacters.map((charType, index) => (
              <div 
                key={charType} 
                className={`player-character ${attackAnimation && attackingCharIndex === index ? 'attacking' : ''} ${isCooldown ? 'cooldown' : ''}`}
                style={{
                  top: index === 0 ? '20%' : '60%',
                  left: index === 0 ? '10%' : '25%'
                }}
                onClick={() => characterAttack(index)}
              >
                <img 
                  src={CHARACTERS[charType as keyof typeof CHARACTERS].image} 
                  alt={charType} 
                  className="character-img" 
                />
                <div className="character-broom"></div>
                <div className="character-wand"></div>
                
                {/* Büyü efekti */}
                {magicEffect && attackingCharIndex === index && (
                  <div 
                    className="magic-effect"
                    style={{
                      backgroundColor: magicColor,
                      boxShadow: `0 0 15px ${magicColor}`
                    }}
                  >
                    <div className="magic-particles">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="magic-particle" 
                          style={{
                            backgroundColor: magicColor,
                            animationDelay: `${i * 0.1}s`,
                            top: `${i * 2}px`,
                            left: `${i * 2}px`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Düşman */}
          <div className="enemy-side">
            <div className="enemy-character">
              <img src={CHARACTERS.ENEMY.image} alt="enemy" className="enemy-img" />
            </div>
          </div>
        </div>
        
        {/* Sağlık çubukları */}
        <div className="health-bars">
          <div className="player-health">
            <div className="health-label">Karakterler</div>
            <div className="health-bar">
              <div className="health-fill" style={{ width: `${playerHealth}%` }}></div>
            </div>
            <div className="health-value">{playerHealth}/100</div>
          </div>
          
          <div className="enemy-health">
            <div className="health-label">Düşman</div>
            <div className="health-bar">
              <div className="health-fill" style={{ width: `${(enemyHealth / 200) * 100}%` }}></div>
            </div>
            <div className="health-value">{enemyHealth}/200</div>
          </div>
        </div>
        
        {/* Savaş durumu mesajı */}
        <div className="battle-status">
          <p>{battleMessage}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="character-selection">
      <h2>Karakterlerini Seç</h2>
      
      {message && <p className="selection-message">{message}</p>}
      
      <div className="characters-grid">
        {['FIRE', 'ICE', 'DINO', 'ENEMY'].map(charType => {
          const char = CHARACTERS[charType as keyof typeof CHARACTERS];
          const isSelected = selectedCharacters.includes(charType);
          const isEnemy = charType === 'ENEMY';
          
          return (
            <div 
              key={charType} 
              className={`character-card ${isSelected ? 'selected' : ''} ${isEnemy ? 'enemy-card' : ''}`}
              onClick={() => isEnemy ? null : toggleCharacterSelection(charType)}
              style={isEnemy ? { cursor: 'default' } : {}}
            >
              <img src={char.image} alt={char.name} />
              <h3>{char.name}</h3>
              <p className={`char-type ${isEnemy ? 'enemy-type' : ''}`}>
                {charType === 'FIRE' ? 'Ateş' : 
                 charType === 'ICE' ? 'Buz' : 
                 charType === 'DINO' ? 'Dino' : 'Düşman'}
              </p>
              <div className="char-stats">
                <p>HP: {isEnemy ? char.health : char.health}</p>
                <p>ATK: {isEnemy ? char.attack : char.attack}</p>
                <p>DEF: {isEnemy ? char.defense : char.defense}</p>
              </div>
              {!isEnemy && (
                <div className="contract-info">
                  <p className="contract-address">
                    Kontrat: {NFT_ADDRESSES[charType as keyof typeof NFT_ADDRESSES].substring(0, 6)}...
                    {NFT_ADDRESSES[charType as keyof typeof NFT_ADDRESSES].substring(38)}
                  </p>
                  <a 
                    href={OPENSEA_LINKS[charType as keyof typeof OPENSEA_LINKS]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="opensea-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    OpenSea'da Görüntüle
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button 
        className={`start-battle-btn ${selectedCharacters.length === 2 ? 'enabled' : 'disabled'}`}
        onClick={startBattle}
        disabled={selectedCharacters.length !== 2}
      >
        Savaşı Başlat
      </button>
    </div>
  );
};

// Ana uygulama
function App() {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="app">
      <header className="app-header">
        <h1>NFT Karakter Savaş Oyunu</h1>
        <p>Sepolia Test Ağı</p>
      </header>
      
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <h2>Oyun Talimatları</h2>
            <p>Bu oyunda, Sepolia test ağında NFT karakterleri ile savaşabilirsiniz.</p>
            <ul>
              <li>İki karakter seçin - farklı elemental güçleri denemeyi unutmayın.</li>
              <li>Karakterler sırayla düşmana saldırır.</li>
              <li>Karakterlerin zıt elementleri birbirlerine karşı avantaj sağlar.</li>
              <li>Düşmanı yenmek için stratejik olarak karakter saldırılarını kullanın.</li>
            </ul>
            <div className="opensea-links">
              <h3>NFT Karakter Koleksiyonları:</h3>
              <div className="nft-links">
                <a href={OPENSEA_LINKS.FIRE} target="_blank" rel="noopener noreferrer">
                  Ateş Karakteri
                </a>
                <a href={OPENSEA_LINKS.ICE} target="_blank" rel="noopener noreferrer">
                  Su/Buz Karakteri
                </a>
                <a href={OPENSEA_LINKS.ENEMY} target="_blank" rel="noopener noreferrer">
                  Düşman/Canavar
                </a>
                <a href={OPENSEA_LINKS.DINO} target="_blank" rel="noopener noreferrer">
                  Dino Karakteri
                </a>
              </div>
            </div>
            <button 
              className="start-button"
              onClick={() => setShowInstructions(false)}
            >
              Oyuna Başla
            </button>
          </div>
        </div>
      )}
      
      <main className="app-main">
        {!showInstructions && <GameScreen />}
      </main>
      
      <footer className="app-footer">
        <p>NFT'leriniz ile oynayın ve eğlenin! Bu oyun Sepolia test ağı üzerinde çalışır.</p>
        <button 
          className="instructions-button"
          onClick={() => setShowInstructions(true)}
        >
          Talimatları Göster
        </button>
      </footer>
    </div>
  );
}

export default App
