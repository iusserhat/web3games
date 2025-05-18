import { InjectedConnector } from '@web3-react/injected-connector';

// Sepolia test ağı ID'si
export const SEPOLIA_CHAIN_ID = 11155111;

// Desteklenen zincirler
export const supportedChainIds = [SEPOLIA_CHAIN_ID];

// Injected connector (MetaMask gibi)
export const injected = new InjectedConnector({
  supportedChainIds,
});

// NFT kontrat adresleri
export const NFT_CONTRACT_ADDRESSES = [
  "0xf33528dC48A65e3be3427A714C5f5571D311d7C3", // Ateş karakter
  "0x6C18119bb4b60Dd92bCCdfAe88bD890016279740", // Su karakter
  "0x079dD9B6E74753A70426e884B95421d25472DBf5", // Canavar/Düşman
  "0x81A75ed365Fe5F5E39093fb78bde942939cC690d"  // Boş görev karakter/Dino
];

// Ana NFT kontrat adresi
export const NFT_CONTRACT_ADDRESS = NFT_CONTRACT_ADDRESSES[0];

// Sepolia RPC URL - Güvenilir bir public RPC kullanıyoruz
export const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"; 