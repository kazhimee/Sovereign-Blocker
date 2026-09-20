const defaultBlacklist = [
  "macbook", "apple", "iphone", "imac", "mac os",
  "microsoft", "windows", "xbox", "surface", "bing",
  "google", "pixel", "chrome"
];

// Asla engellenmeyecek hassas tam kalıplar (False-positive koruması)
const whitelistPhrases = [
  "google account", "apple account", "google drive", 
  "google docs", "google maps", "apple support"
];

function isSearchEngine() {
  const url = window.location.href;
  return url.includes("search.brave.com") || 
         url.includes("searx") || 
         url.includes("google.com/search") || 
         url.includes("bing.com/search");
}

function cleanResults() {
  if (!isSearchEngine()) return;

  chrome.storage.local.get(['enabled', 'blacklist'], (result) => {
    const isEnabled = result.enabled !== false; 
    if (!isEnabled) return;

    const blacklist = result.blacklist || defaultBlacklist;
    if (!blacklist || blacklist.length === 0) return;

    // Sadece ana arama sonuç kartlarını hedefle (sağ panel/sidebar'ları hariç tut)
    const resultCards = document.querySelectorAll('div.result, div.g, div[data-type="web"], li.b_algo');

    resultCards.forEach(card => {
      if (card.dataset.purified === 'true') return;

      const cardText = card.innerText.toLowerCase();
      
      // 1. Whitelist (İstisna) kontrolü: Hassas kalıplar geçiyorsa bu kartı atla
      const isWhitelisted = whitelistPhrases.some(phrase => cardText.includes(phrase));
      if (isWhitelisted) return;

      // 2. Kelime yoğunluğu ve tam eşleşme kontrolü
      let shouldBlock = false;

      for (const keyword of blacklist) {
        // Kelimenin kart içinde kaç kez geçtiğini say
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = cardText.match(regex);
        const count = matches ? matches.length : 0;

        // Kural: Eğer tam domain/site adı geçiyorsa (örn: apple.com) VEYA 
        // kelime kart içinde yoğun olarak (örn: 3'ten fazla kez) geçiyorsa engelle.
        const isDomainMatch = cardText.includes(`${keyword}.com`) || cardText.includes(`${keyword}.org`);
        
        if (isDomainMatch || count >= 3) {
          shouldBlock = true;
          break;
        }
      }

      if (shouldBlock) {
        card.innerHTML = ''; 
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = "background: #1e1e2e; color: #a6e3a1; padding: 16px; border-radius: 8px; border: 1px solid #89b4fa; text-align: center; font-family: monospace; margin: 10px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.3); width: 100%; box-sizing: border-box;";
        
        const h3 = document.createElement('h3');
        h3.style.cssText = "margin: 0 0 8px 0; color: #89b4fa; font-size: 16px;";
        h3.textContent = "🛡️ Content Purified";
        
        const p1 = document.createElement('p');
        p1.style.cssText = "margin: 0; font-size: 13px; color: #cdd6f4;";
        p1.textContent = "This result was filtered due to digital sovereignty rules.";
        
        const p2 = document.createElement('p');
        p2.style.cssText = "margin: 6px 0 0 0; font-size: 12px; color: #89b4fa; font-weight: bold;";
        p2.textContent = "~ Sovereign Blocker ~";
        
        wrapper.appendChild(h3);
        wrapper.appendChild(p1);
        wrapper.appendChild(p2);
        
        card.appendChild(wrapper);
        card.style.display = 'block'; 
        card.dataset.purified = 'true';
      }
    });
  });
}

cleanResults();

const observer = new MutationObserver(() => {
  cleanResults();
});
observer.observe(document.body, { childList: true, subtree: true });