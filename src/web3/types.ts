export {};

declare global {
  interface Window {
    ethereum: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (result: any) => void) => void;
      removeListener: (event: string, callback: (result: any) => void) => void;
      selectedAddress: string | undefined;
      chainId: string | undefined;
    };
  }
}