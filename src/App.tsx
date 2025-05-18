import { useState, useEffect } from 'react'
import './App.css'
import React from 'react'
import WalletConnect from './components/WalletConnect'
import GameRewards from './components/GameRewards'

// Local Storage erişimi için güvenli bir yardımcı fonksiyon
const safeLocalStorage = {
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage erişim hatası:', error);
    }
  },
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage erişim hatası:', error);
      return null;
    }
  }
};

// Assets'ten görselleri import et - Public klasöründen, Türkçe karaktersiz dosya adlarıyla yüklüyoruz
const atesPng = '/ates.png'
const suPng = '/su.png'
const canavarPng = '/canavar.png'
const dinoPng = '/dino.png'

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
    attack: 35,
    defense: 10,
    speed: 10,
    special: 45,
    element: "fire",
    address: NFT_ADDRESSES.FIRE,
    openseaLink: OPENSEA_LINKS.FIRE
  },
  ICE: {
    name: "Buz Karakteri",
    description: "Buz güçleriyle donatılmış cesur bir savaşçı",
    image: suPng,
    health: 120,
    attack: 30,
    defense: 15,
    speed: 7,
    special: 40,
    element: "ice",
    address: NFT_ADDRESSES.ICE,
    openseaLink: OPENSEA_LINKS.ICE
  },
  DINO: {
    name: "Dino Karakter",
    description: "Hızlı ve çevik bir karakter",
    image: dinoPng,
    health: 80,
    attack: 10,
    defense: 5,
    speed: 15,
    special: 25,
    element: "neutral",
    address: NFT_ADDRESSES.DINO,
    openseaLink: OPENSEA_LINKS.DINO
  },
  ENEMY: {
    name: "Karanlık Lord",
    description: "Karanlık güçlere hükmeden güçlü bir düşman",
    image: canavarPng,
    health: 250,
    attack: 20,
    defense: 15,
    speed: 10,
    element: "dark",
    weakness: { fire: false, ice: false },
    address: NFT_ADDRESSES.ENEMY,
    openseaLink: OPENSEA_LINKS.ENEMY
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
  const [enemyHealth, setEnemyHealth] = useState(250);
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [attackingCharIndex, setAttackingCharIndex] = useState(0);
  const [magicEffect, setMagicEffect] = useState(false);
  const [magicColor, setMagicColor] = useState("#ff6666"); // Ateş büyüsü rengi
  const [isCooldown, setIsCooldown] = useState(false);
  const [battleMessage, setBattleMessage] = useState<string>("Düşmanı yenmek için bir karaktere tıkla!");
  const [elementHits, setElementHits] = useState<{fire: boolean, ice: boolean}>({fire: false, ice: false});
  const [attackCount, setAttackCount] = useState(0);
  const [criticalHit, setCriticalHit] = useState(false); // Kritik vuruş state'i
  const [enemyMagic, setEnemyMagic] = useState(false); // Düşman büyü efekti
  const [enemyAttacking, setEnemyAttacking] = useState(false); // Düşman saldırı animasyonu
  const [enemyHit, setEnemyHit] = useState(false); // Düşmana vuruş efekti
  const [showRewards, setShowRewards] = useState(false); // Ödül gösterimi için eklendi
  
  // Karakter seçimi
  const toggleCharacterSelection = (characterType: string) => {
    if (!selectedCharacters) {
      setSelectedCharacters([characterType]);
      return;
    }
    
    if (selectedCharacters.includes(characterType)) {
      setSelectedCharacters(selectedCharacters.filter(c => c !== characterType));
    } else if (selectedCharacters.length < 3) {
      setSelectedCharacters([...selectedCharacters, characterType]);
    }
  };
  
  // Savaşı başlat
  const startBattle = () => {
    if (!selectedCharacters || selectedCharacters.length < 1) {
      setMessage("Lütfen en az 1 karakter seçin");
      return;
    }
    
    setMessage("");
    setGameStarted(true);
    setPlayerHealth(100);
    setEnemyHealth(250);
    setBattleTurn(0);
    setElementHits({fire: false, ice: false});
    setAttackCount(0);
    
    // Dino karakteri seçilmişse özel mesaj göster
    if (selectedCharacters.includes('DINO')) {
      setBattleMessage("Savaş başladı! Dino arkaplanda dolaşarak size destek oluyor! Düşmanı yenmek için hem Ateş hem de Buz elementlerinin vuruşları gerekiyor!");
    } else {
      setBattleMessage("Düşmanı yenmek için bir karaktere tıkla! Unutma, düşmanı yenmek için hem Ateş hem de Buz elementlerinin vuruşları gerekiyor!");
    }
  };
  
  // Ödül işleminin tamamlandığını işaretleyen fonksiyon
  const handleRewardComplete = () => {
    setShowRewards(false);
  };
  
  // Karakter saldırısı
  const characterAttack = (index: number) => {
    // Cooldown varsa işlemi yapma
    if (isCooldown) return;
    
    // Null veya boş kontrolleri
    if (!selectedCharacters || selectedCharacters.length === 0) {
      setBattleMessage("Lütfen önce bir karakter seçin!");
      return;
    }
    
    // Cooldown başlat
    setIsCooldown(true);
    
    // Gerçek index değerini hesapla (Dino karakteri ana karakterler arasında değil)
    const actualCharTypes = selectedCharacters.filter(charType => charType !== 'DINO');
    
    // Index sınırları kontrolü
    if (index < 0 || index >= actualCharTypes.length) {
      console.error("Geçersiz karakter indeksi:", index);
      setIsCooldown(false);
      return;
    }
    
    const charType = actualCharTypes[index];
    
    // CharType geçerliliğini kontrol et
    if (!charType || !CHARACTERS[charType as keyof typeof CHARACTERS]) {
      console.error("Geçersiz karakter tipi:", charType);
      setIsCooldown(false);
      return;
    }
    
    // Büyü rengini karakter tipine göre ayarla
    const isFireType = charType === 'FIRE';
    setMagicColor(isFireType ? "#ff6666" : "#66ccff"); // Ateş kırmızı, buz mavi
    
    // Saldırı animasyonu başlat
    setAttackingCharIndex(index);
    setAttackAnimation(true);
    setAttackCount(prev => prev + 1);
    
    // Her tıklamada çoklu ateş efekti için - sadece kendi element büyüsünü atsın
    const magicCount = 8;  // Daha fazla büyü efekti göster (5'ten 8'e)

    setBattleMessage(`${charType} karakteri saldırıyor!`);
    
    // Hızlı saldırı efektleri için döngü - artık her karakter kendi elementini kullanacak
    const showMagicEffect = (count: number) => {
      if (count <= 0) return;
      
      // Güvenlik kontrolleri
      if (!charType || !CHARACTERS[charType as keyof typeof CHARACTERS]) {
        console.error("Geçersiz karakter tipi:", charType);
        setIsCooldown(false);
        return;
      }
      
      // 0.1 saniye sonra büyü efektini başlat (daha hızlı)
      setTimeout(() => {
        setMagicEffect(true);
        
        // 0.25 saniye sonra büyü efektini kapat (daha hızlı)
        setTimeout(() => {
          setMagicEffect(false);
          
          try {
            // Düşmana hasar ver (karakter tipine göre farklı hasar)
            const baseAttack = CHARACTERS[charType as keyof typeof CHARACTERS].attack;
            // Kritik vuruş şansı ekle
            const isCritical = Math.random() < 0.25; // %25 kritik şans (artırıldı)
            const criticalMultiplier = isCritical ? 2.0 : 1.0; // Kritik vuruş 2.0x hasar (artırıldı)
            
            // Kritik vuruş anımasyonu göster
            if (isCritical) {
              setCriticalHit(true);
              setTimeout(() => setCriticalHit(false), 800); // 800ms sonra kritik vuruş efekti kaybolur
            }
            
            // Hasar hesaplama formülü iyileştirildi - %90-%150 arası rastgele hasar
            const damageVariation = Math.random() * 0.6 + 0.9;
            const baseDamage = Math.floor(baseAttack * damageVariation);
            
            // Element takibi ve hasar hesaplaması
            let updatedElementHits = {...elementHits};
            let damageMultiplier = 1.0;
            
            // Karakterin kendi elementi etkinleştirilsin
            if (charType === 'FIRE') {
              updatedElementHits.fire = true;
              if (elementHits.ice) damageMultiplier = 2.0; // Buz daha önce vurmuşsa daha yüksek güçlendirme (2.0x)
            } else if (charType === 'ICE') {
              updatedElementHits.ice = true;
              if (elementHits.fire) damageMultiplier = 2.0; // Ateş daha önce vurmuşsa daha yüksek güçlendirme (2.0x)
            }
            
            setElementHits(updatedElementHits);
            
            // Her iki element de vurmuşsa, düşman zayıflar
            const finalDamage = Math.floor(baseDamage * damageMultiplier * criticalMultiplier);
            const newEnemyHealth = Math.max(0, enemyHealth - finalDamage);
            
            // Düşmana vuruş efekti
            setEnemyHit(true);
            setTimeout(() => setEnemyHit(false), 400);
            
            setEnemyHealth(newEnemyHealth);
            
            let damageMessage = `${finalDamage} hasar verdi`;
            
            if (isCritical) {
              damageMessage = `KRİTİK! ${finalDamage} hasar verdi`;
            } else if (damageMultiplier > 1.0) {
              damageMessage += ` (${damageMultiplier}x güçlendirilmiş!)`;
            }
            
            // Element mesajları oluştur
            const elementStatus = `[${updatedElementHits.fire ? '🔥' : '○'} | ${updatedElementHits.ice ? '❄️' : '○'}]`;
            
            // Element tipi gösterimi ekle
            const elementEmoji = charType === 'FIRE' ? '🔥' : '❄️';
            
            // Dino seçilmiş ise ekstra animasyon/mesaj göster
            if (selectedCharacters && selectedCharacters.includes('DINO')) {
              const dinoText = `${CHARACTERS[charType as keyof typeof CHARACTERS].name} ${elementEmoji} düşmana ${damageMessage}! ${elementStatus} Dino da etrafta neşeyle dolaşıyor!`;
              setBattleMessage(dinoText);
            } else {
              setBattleMessage(`${CHARACTERS[charType as keyof typeof CHARACTERS].name} ${elementEmoji} düşmana ${damageMessage}! ${elementStatus}`);
            }
            
            // Düşman öldü mü kontrol et - artık her iki element de vurmuş olmalı
            if (newEnemyHealth === 0 && updatedElementHits.fire && updatedElementHits.ice) {
              setTimeout(() => {
                setGameResult('victory');
                setShowRewards(true); // Zafer kazanıldığında ödül bileşenini göster
              }, 1000);
              return;
            }
            
            // Sonraki ateş efektini göster
            if (count > 1) {
              showMagicEffect(count - 1);
            } else {
              // Son efektten sonra düşman saldırısı
              setTimeout(() => {
                // Düşman henüz ölmediyse saldırır
                if (newEnemyHealth > 0) {
                  // Düşman saldırısını başlat
                  enemyAttack(actualCharTypes);
                } else if (!(updatedElementHits.fire && updatedElementHits.ice)) {
                  // Düşman kan kaybediyor ama ölmüyor (her iki element de vurmadı)
                  let remainingElement = !updatedElementHits.fire ? "Ateş 🔥" : "Buz ❄️";
                  setBattleMessage(`Düşman ağır yaralı ama hala ayakta! ${remainingElement} güçlerine de ihtiyacın var!`);
                  
                  // Cooldown'u kaldır
                  setTimeout(() => {
                    setIsCooldown(false);
                  }, 600); // Daha hızlı cooldown (800'den 600'e)
                }
              }, 300); // Daha hızlı düşman saldırısı (400'den 300'e)
            }
          } catch (error) {
            console.error("Büyü efekti hesaplama hatası:", error);
            setIsCooldown(false);
          }
        }, 250); // Daha hızlı büyü efekti (300'den 250'ye)
      }, 100); // Daha hızlı başlangıç (150'den 100'e)
    };
    
    // Ateş efektlerini başlat
    showMagicEffect(magicCount);
  };
  
  // Düşman saldırısı
  const enemyAttack = (characterTypes: string[]) => {
    // Düşman saldırı animasyonu
    setEnemyAttacking(true);
    setTimeout(() => setEnemyAttacking(false), 800);
    
    // Düşman büyü efekti
    setTimeout(() => {
      setEnemyMagic(true);
      
      setTimeout(() => {
        setEnemyMagic(false);
        
        // Oyuncuya hasar ver
        const enemyAttackPower = CHARACTERS.ENEMY.attack;
        const damageVariation = Math.random() * 0.3 + 0.8; // %80-%110 arası hasar
        const damage = Math.floor(enemyAttackPower * damageVariation);
        
        const newHealth = Math.max(0, playerHealth - damage);
        setPlayerHealth(newHealth);
        
        // Saldırı mesajı
        setBattleMessage(`Düşman şiddetli mor-yeşil büyü kullanarak ${damage} hasar verdi!`);
        
        // Oyuncu öldü mü kontrol et
        if (newHealth === 0) {
          setTimeout(() => {
            setGameResult('defeat');
          }, 1000);
          return;
        }
        
        // Cooldown kaldırılıyor
        setTimeout(() => {
          setIsCooldown(false);
          setBattleMessage("Sıra sende! Saldırmak için karaktere tıkla.");
        }, 800);
        
      }, 400); // Büyü süresi
    }, 300); // Büyü başlangıcı
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
    setEnemyHealth(250);
    setAttackAnimation(false);
    setMagicEffect(false);
    setIsCooldown(false);
    setBattleMessage("Düşmanı yenmek için bir karaktere tıkla!");
    setShowRewards(false);
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
        
        {gameResult === 'victory' && (
          <p className="reward-info">Kazanınca token ödülü almak için MetaMask cüzdanınızı bağlayın!</p>
        )}
        
        <button className="play-again-btn" onClick={restartGame}>Tekrar Oyna</button>
        
        {/* Kazandığında ödül bileşenini göster */}
        {showRewards && (
          <GameRewards 
            isVictory={gameResult === 'victory'} 
            onRewardComplete={handleRewardComplete} 
          />
        )}
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
        
        {/* Dino filigran karakteri */}
        {selectedCharacters.includes('DINO') && (
          <div className="dino-filigran">
            <img 
              src={dinoPng} 
              alt="Dino" 
              className="dino-filigran-img" 
            />
            <div className="dino-trail"></div>
            <div className="dino-aura"></div>
          </div>
        )}
        
        {/* Kritik vuruş efekti */}
        {criticalHit && (
          <div className="critical-hit">KRİTİK VURUŞ!</div>
        )}
        
        {/* Karakterler ve canavar */}
        <div className="battle-characters">
          {/* Oyuncu tarafı */}
          <div className="player-side">
            {selectedCharacters.filter(charType => charType !== 'DINO').map((charType, index) => (
              <div 
                key={index} 
                className={`player-character ${attackingCharIndex === index && attackAnimation ? 'attacking' : ''} ${isCooldown ? 'cooldown' : ''}`}
                style={{
                  left: index === 0 ? '20%' : index === 1 ? '50%' : '70%',
                  bottom: index === 0 ? '40%' : index === 1 ? '20%' : '50%',
                  zIndex: index === 0 ? 10 : 5
                }}
                onClick={() => characterAttack(index)}
              >
                <img 
                  src={charType === 'FIRE' ? atesPng : 
                       charType === 'ICE' ? suPng : 
                       charType === 'DINO' ? dinoPng : 
                       canavarPng}
                  alt={CHARACTERS[charType as keyof typeof CHARACTERS].name} 
                  className="character-img"
                />
                <div className="character-broom"></div>
                <div className="character-wand"></div>
                
                {/* Büyü efekti */}
                {attackingCharIndex === index && magicEffect && (
                  <div className="magic-effect" style={{ backgroundColor: magicColor }}>
                    <div className="magic-particles">
                      <div className="magic-particle" style={{ top: '10%', left: '10%' }}></div>
                      <div className="magic-particle" style={{ top: '20%', left: '80%' }}></div>
                      <div className="magic-particle" style={{ top: '80%', left: '20%' }}></div>
                      <div className="magic-particle" style={{ top: '60%', left: '70%' }}></div>
                      <div className="magic-particle" style={{ top: '40%', left: '40%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Düşman tarafı */}
          <div className="enemy-side">
            <div className={`enemy-character ${enemyAttacking ? 'attacking' : ''} ${enemyHit ? 'enemy-hit' : ''}`}
                style={{
                  right: '30%',
                  bottom: '30%'
                }}
            >
              <img 
                src={canavarPng}
                alt={CHARACTERS.ENEMY.name} 
                className="enemy-img"
              />
              
              {/* Düşman büyü efekti */}
              {enemyMagic && (
                <>
                  <div className="enemy-magic attack-top"></div>
                  <div className="enemy-magic attack-bottom"></div>
                </>
              )}
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
              <div className="health-fill" style={{ width: `${(enemyHealth / 250) * 100}%` }}></div>
            </div>
            <div className="health-value">{enemyHealth}/250</div>
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
      <h2>Karakterlerinizi Seçin</h2>
      
      <div className="selection-container">
        <div className="character-grid-container">
          <div className="character-grid">
            <div 
              className={`character-card ${selectedCharacters.includes('FIRE') ? 'selected' : ''}`}
              onClick={() => toggleCharacterSelection('FIRE')}
            >
              <img src={atesPng} alt="Ateş Karakteri" />
              <h3>Ateş Karakteri</h3>
              <p>Ateş güçlerine sahip</p>
              <div className="nft-info">
                <p className="nft-address">NFT: {NFT_ADDRESSES.FIRE.substring(0, 6)}...{NFT_ADDRESSES.FIRE.substring(NFT_ADDRESSES.FIRE.length - 4)}</p>
                <a href={OPENSEA_LINKS.FIRE} target="_blank" rel="noopener noreferrer" className="opensea-link">
                  OpenSea'da Görüntüle
                </a>
              </div>
            </div>
            <div 
              className={`character-card ${selectedCharacters.includes('ICE') ? 'selected' : ''}`}
              onClick={() => toggleCharacterSelection('ICE')}
            >
              <img src={suPng} alt="Buz Karakteri" />
              <h3>Buz Karakteri</h3>
              <p>Buz güçlerine sahip</p>
              <div className="nft-info">
                <p className="nft-address">NFT: {NFT_ADDRESSES.ICE.substring(0, 6)}...{NFT_ADDRESSES.ICE.substring(NFT_ADDRESSES.ICE.length - 4)}</p>
                <a href={OPENSEA_LINKS.ICE} target="_blank" rel="noopener noreferrer" className="opensea-link">
                  OpenSea'da Görüntüle
                </a>
              </div>
            </div>
            <div 
              className={`character-card ${selectedCharacters.includes('DINO') ? 'selected' : ''}`}
              onClick={() => toggleCharacterSelection('DINO')}
            >
              <img src={dinoPng} alt="Dino Karakter" />
              <h3>Dino Karakter</h3>
              <p>Hızlı ve çevik destek</p>
              <div className="nft-info">
                <p className="nft-address">NFT: {NFT_ADDRESSES.DINO.substring(0, 6)}...{NFT_ADDRESSES.DINO.substring(NFT_ADDRESSES.DINO.length - 4)}</p>
                <a href={OPENSEA_LINKS.DINO} target="_blank" rel="noopener noreferrer" className="opensea-link">
                  OpenSea'da Görüntüle
                </a>
              </div>
            </div>
          </div>
          
          {message && <p className="error-message">{message}</p>}
          
          <button 
            className="battle-btn"
            onClick={startBattle}
          >
            Savaşa Başla
          </button>
        </div>

        <div className="enemy-preview">
          <h3>Düşmanınız:</h3>
          <div className="enemy-card">
            <img src={canavarPng} alt="Karanlık Lord" />
            <h4>{CHARACTERS.ENEMY.name}</h4>
            <p>{CHARACTERS.ENEMY.description}</p>
            <div className="nft-info">
              <p className="nft-address">NFT: {NFT_ADDRESSES.ENEMY.substring(0, 6)}...{NFT_ADDRESSES.ENEMY.substring(NFT_ADDRESSES.ENEMY.length - 4)}</p>
              <a href={OPENSEA_LINKS.ENEMY} target="_blank" rel="noopener noreferrer" className="opensea-link">
                OpenSea'da Görüntüle
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Uygulama yüklendiğinde tarayıcı depolama alanına erişim kontrolü
  useEffect(() => {
    try {
      // Test amaçlı geçici bir öğe ekleyip silme
      const testKey = "_test_storage_access";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      setErrorState(null);
    } catch (error) {
      // Eğer localStorage erişimi engellenmişse kullanıcıya uyarı göster
      console.error("Depolama erişim hatası:", error);
      setErrorState("Tarayıcı depolama alanına erişim engellendi. Lütfen tarayıcı ayarlarınızı kontrol edin veya gizli moddan çıkın.");
    }
  }, []);

  // Hata durumunda hata mesajı göster
  if (errorState) {
    return (
      <div className="error-container">
        <h2>Uygulama Başlatılamadı</h2>
        <p>{errorState}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="reload-btn"
        >
          Sayfayı Yenile
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Cüzdan bağlantı bileşeni */}
      <WalletConnect />
      
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
              <li>Karakterleri seçin - farklı elemental güçleri denemeyi unutmayın.</li>
              <li>Karakterler sırayla düşmana saldırır.</li>
              <li>Karakterlerin zıt elementleri birbirlerine karşı avantaj sağlar.</li>
              <li>Düşmanı yenmek için stratejik olarak karakter saldırılarını kullanın.</li>
              <li><strong>Oyunu kazandığınızda Sepolia üzerinde token ödülü alırsınız!</strong></li>
            </ul>
            <div className="opensea-links">
              <h3>NFT Karakter Koleksiyonları:</h3>
              <div className="nft-links">
                <a href={OPENSEA_LINKS.FIRE} target="_blank" rel="noopener noreferrer">
                  Ateş Karakteri - {NFT_ADDRESSES.FIRE}
                </a>
                <a href={OPENSEA_LINKS.ICE} target="_blank" rel="noopener noreferrer">
                  Su/Buz Karakteri - {NFT_ADDRESSES.ICE}
                </a>
                <a href={OPENSEA_LINKS.ENEMY} target="_blank" rel="noopener noreferrer">
                  Düşman/Canavar - {NFT_ADDRESSES.ENEMY}
                </a>
                <a href={OPENSEA_LINKS.DINO} target="_blank" rel="noopener noreferrer">
                  Dino Karakteri - {NFT_ADDRESSES.DINO}
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
