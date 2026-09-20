const defaultBlacklist = [
  "macbook", "apple", "iphone", "imac", "mac os",
  "microsoft", "windows", "xbox", "surface", "bing",
  "google", "pixel", "chrome"
];

function aramaMotorundaMiyiz() {
  const url = window.location.href;
  return url.includes("search.brave.com") || 
         url.includes("searx") || 
         url.includes("google.com/search") || 
         url.includes("bing.com/search");
}

function temizle() {
  if (!aramaMotorundaMiyiz()) return;

  chrome.storage.local.get(['blacklist'], (result) => {
    const karaliste = result.blacklist || defaultBlacklist;
    if (!karaliste || karaliste.length === 0) return;

    const tarayici = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let dugum;
    let degistirilecekElementler = new Set();

    while ((dugum = tarayici.nextNode())) {
      const metin = dugum.nodeValue.toLowerCase();
      const yasakliVarMi = karaliste.some(kelime => metin.includes(kelime));
      
      if (yasakliVarMi) {
        let ebeveyn = dugum.parentElement;
        if (ebeveyn) {
          let kutu = ebeveyn.closest('div.result, div.g, div[data-type="web"], li.b_algo');
          if (kutu) {
            degistirilecekElementler.add(kutu);
          }
        }
      }
    }

    degistirilecekElementler.forEach(el => {
      if (!el.dataset.temizlendi) {
        el.innerHTML = ''; 
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = "background: #1e1e2e; color: #a6e3a1; padding: 16px; border-radius: 8px; border: 1px solid #89b4fa; text-align: center; font-family: monospace; margin: 10px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.3); width: 100%;";
        
        const h3 = document.createElement('h3');
        h3.style.cssText = "margin: 0 0 8px 0; color: #89b4fa; font-size: 16px;";
        h3.textContent = "🛡️ Content Purified";
        
        const p1 = document.createElement('p');
        p1.style.cssText = "margin: 0; font-size: 13px; color: #cdd6f4;";
        p1.textContent = "This result was filtered due to digital sovereignty rules.";
        
        const p2 = document.createElement('p');
        p2.style.cssText = "margin: 6px 0 0 0; font-size: 12px; color: #89b4fa; font-weight: bold;";
        p2.textContent = "~ Sovereign Blocker ~"; // Değişen kısım burası
        
        wrapper.appendChild(h3);
        wrapper.appendChild(p1);
        wrapper.appendChild(p2);
        
        el.appendChild(wrapper);
        el.style.display = 'block'; 
        el.dataset.temizlendi = 'true';
      }
    });
  });
}

temizle();

const gozlemci = new MutationObserver(() => {
  temizle();
});
gozlemci.observe(document.body, { childList: true, subtree: true });