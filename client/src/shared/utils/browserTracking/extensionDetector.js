/**
 * Lijst met populaire Chrome extensies en hun bekende public resources.
 * Deze ID's werken in Chrome, Edge, Brave en Opera (niet in Firefox i.v.m. random ID's).
 */
const EXTENSIONS_LIST = [
  // --- AdBlockers & Privacy ---
  { name: "uBlock Origin", id: "cjpalhdlnbpafiamejdnhcphjbkeiagm", resource: "images/icon_128.png" },
  { name: "AdBlock", id: "gighmmpiobklfepjocnamgkkbiglidom", resource: "icons/icon128.png" },
  { name: "Adblock Plus", id: "cfhdojbkjhnklbpkdaibdccddilifddb", resource: "icons/icon128.png" },
  { name: "Ghostery", id: "mlomiejdfkolichcflejclcbmpeaniij", resource: "images/icon-64.png" },
  { name: "Privacy Badger", id: "pkehgijcmpdhfbdbbnkijodmdjhbjlgp", resource: "icons/icon128.png" },

  // --- Developer Tools ---
  { name: "React Developer Tools", id: "fmkadmapgofadopljbjfkapdkoienihi", resource: "icons/128.png" },
  { name: "Redux DevTools", id: "lmhkpmbekcpmknklioeibfkpmmfibljd", resource: "img/logo.png" },
  { name: "Vue.js devtools", id: "nhdogjmejiglipccpnnnanhbledajbpd", resource: "icons/128.png" },
  { name: "Wappalyzer", id: "gppongmhjkpfnbhagpmjfkannfbllamg", resource: "images/icon_128.png" },
  { name: "Lighthouse", id: "blipmdconlkpinefehnmjammfjpmpbjk", resource: "images/lh_logo_icon.png" },
  { name: "JSON Viewer", id: "gbmdgpbipfallnflgajpaliibnhdgobh", resource: "assets/icon128.png" },

  // --- Password Managers ---
  { name: "LastPass", id: "hdokiejnpimakedhajhdlcegeplioahd", resource: "images/icon128.png" },
  { name: "1Password", id: "aeblfdkhhhdcdjpifhhbdiojplfjncoa", resource: "images/icon-128.png" },
  { name: "Bitwarden", id: "nngceckbapebfimnlniiiahkandclblb", resource: "images/icon-128.png" },
  { name: "Dashlane", id: "fdjamakpfbbddfjaooikfcpapjohcfmg", resource: "images/icon-128.png" },

  // --- Wallets (Crypto) ---
  { name: "MetaMask", id: "nkbihfbeogaeaoehlefnkodbefgpgknn", resource: "images/icon-128.png" },
  { name: "Phantom", id: "bfnaelmomeimhlpmgjnjophhpkkoljpa", resource: "icons/icon128.png" },
  { name: "Coinbase Wallet", id: "hnfanknocfeofbddgcijnmhnfnkdnaad", resource: "images/icon-128.png" },
  { name: "Ronin Wallet", id: "fnjhmkhhmkbjkkabndcnnogagogbneec", resource: "images/icon-128.png" },

  // --- Productivity & Shopping ---
  { name: "Grammarly", id: "kbfnbcaeplbcioakkpcpgfkobkghlhen", resource: "src/images/icon-128.png" },
  { name: "Honey", id: "bmnlcjabgnpnenekpadlanbbkooimhnj", resource: "images/icon128.png" },
  { name: "Google Translate", id: "aapbdbdomjkkjkaonfhkkikfgjllcleb", resource: "options.html" },
  { name: "Adobe Acrobat", id: "efaidnbmnnnibpcajpcglclefindmkaj", resource: "browser/js/options.js" },
  { name: "Tampermonkey", id: "dhdgffkkebhmkfjojejmpbldmpobfkfo", resource: "options.html" }
];

/**
 * Detecteert welke extensies uit de bovenstaande lijst geïnstalleerd zijn.
 * * @returns {Promise<Array<string>>} Een lijst met namen van gevonden extensies.
 */
export const detectInstalledExtensions = async () => {
  const detected = [];

  // 1. Helper functie die een timeout gebruikt.
  // Als een extensie er niet is, kan de fetch soms lang blijven hangen (pending),
  // dus we breken hem af na 100ms om snelheid te garanderen.
  const checkResource = (id, path) => {
    return new Promise((resolve) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 100); // 100ms timeout

      fetch(`chrome-extension://${id}/${path}`, { signal: controller.signal })
        .then((res) => {
          clearTimeout(timeoutId);
          resolve(res.ok); // True als file gevonden is (status 200)
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(false);
        });
    });
  };

  // 2. Maak een array van promises (alle checks tegelijk starten)
  const checksPromises = EXTENSIONS_LIST.map(async (ext) => {
    const exists = await checkResource(ext.id, ext.resource);
    if (exists) {
      detected.push(ext.name);
    }
  });

  // 3. Wacht tot alle promises klaar zijn
  await Promise.all(checksPromises);

  return detected;
};