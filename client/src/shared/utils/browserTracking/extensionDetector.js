/**
 * Detecteert browser extensies via Global Objects (modern) en Resource Scanning (legacy).
*/

const EXTENSIONS_LIST = [
  // AdBlockers & Privacy
  { name: "uBlock Origin", id: "cjpalhdlnbpafiamejdnhcphjbkeiagm", resource: "images/icon_128.png" },
  { name: "AdBlock", id: "gighmmpiobklfepjocnamgkkbiglidom", resource: "icons/icon128.png" },
  { name: "Adblock Plus", id: "cfhdojbkjhnklbpkdaibdccddilifddb", resource: "icons/icon128.png" },
  { name: "Ghostery", id: "mlomiejdfkolichcflejclcbmpeaniij", resource: "images/icon-64.png" },
  { name: "Privacy Badger", id: "pkehgijcmpdhfbdbbnkijodmdjhbjlgp", resource: "icons/icon128.png" },

  // Password Managers
  { name: "LastPass", id: "hdokiejnpimakedhajhdlcegeplioahd", resource: "images/icon128.png" },
  { name: "Bitwarden", id: "nngceckbapebfimnlniiiahkandclblb", resource: "images/icon-128.png" },
  { name: "Dashlane", id: "fdjamakpfbbddfjaooikfcpapjohcfmg", resource: "images/icon-128.png" },

  // Productivity & Shopping
  { name: "Grammarly", id: "kbfnbcaeplbcioakkpcpgfkobkghlhen", resource: "src/images/icon-128.png" },
  { name: "Honey", id: "bmnlcjabgnpnenekpadlanbbkooimhnj", resource: "images/icon128.png" },
  { name: "Wappalyzer", id: "gppongmhjkpfnbhagpmjfkannfbllamg", resource: "images/icon_128.png" }
];

export const detectInstalledExtensions = async () => {
  const detected = [];

  // METHODE 1: Check Global Objects 
  // React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    detected.push("React Developer Tools");
  }

  // Vue DevTools
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    detected.push("Vue.js devtools");
  }
  
  // Redux DevTools
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    detected.push("Redux DevTools");
  }

  // Apollo Client DevTools
  if (window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__) {
    detected.push("Apollo Client DevTools");
  }

  // Crypto Wallets (MetaMask, Phantom, etc.)
  if (window.ethereum) {
    if (window.ethereum.isMetaMask) detected.push("MetaMask");
    if (window.ethereum.isPhantom) detected.push("Phantom");
    if (window.ethereum.isCoinbaseWallet) detected.push("Coinbase Wallet");
    if (window.ethereum.isTrust) detected.push("Trust Wallet");
  }
  
  // Solana specifiek
  if (window.solana && window.solana.isPhantom) {
    if (!detected.includes("Phantom")) detected.push("Phantom");
  }

  // METHODE 2: Resource Scanning

  const checkResource = (id, path) => {
    return new Promise((resolve) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 150);

      fetch(`chrome-extension://${id}/${path}`, { signal: controller.signal })
        .then((res) => {
          clearTimeout(timeoutId);
          resolve(res.ok);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(false);
        });
    });
  };

  const checksPromises = EXTENSIONS_LIST.map(async (ext) => {
    if (detected.includes(ext.name)) return;

    const exists = await checkResource(ext.id, ext.resource);
    if (exists) {
      detected.push(ext.name);
    }
  });

  await Promise.all(checksPromises);

  return [...new Set(detected)].sort();
};