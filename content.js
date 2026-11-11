const api = globalThis.browser || globalThis.chrome;
const serviceDomains = {
  'google-search': ['google.com/search'], 'google-drive': ['drive.google.com'], 'google-docs': ['docs.google.com'],
  'google-sheets': ['sheets.google.com'], 'google-slides': ['slides.google.com'], gmail: ['mail.google.com'],
  'google-maps': ['maps.google.com'], youtube: ['youtube.com'], 'google-photos': ['photos.google.com'],
  'google-play': ['play.google.com'], 'google-calendar': ['calendar.google.com'], 'google-meet': ['meet.google.com'],
  'google-chrome': ['google.com/chrome'], apple: ['apple.com'], icloud: ['icloud.com'],
  'apple-music': ['music.apple.com'], 'apple-tv': ['tv.apple.com'], 'app-store': ['apps.apple.com'],
  'apple-support': ['support.apple.com'], 'apple-maps': ['maps.apple.com'], 'apple-podcasts': ['podcasts.apple.com'],
  'apple-pay': ['apple.com/apple-pay'], 'apple-icloud-mail': ['icloud.com/mail'], microsoft: ['microsoft.com'],
  bing: ['bing.com'], outlook: ['outlook.com'], onedrive: ['onedrive.live.com'],
  'microsoft-365': ['microsoft365.com'], word: ['word.cloud.microsoft'], excel: ['excel.cloud.microsoft'],
  powerpoint: ['powerpoint.cloud.microsoft'], teams: ['teams.microsoft.com'], windows: ['microsoft.com/windows'],
  xbox: ['xbox.com'], azure: ['azure.microsoft.com'],
  facebook: ['facebook.com'], instagram: ['instagram.com'], whatsapp: ['whatsapp.com'],
  threads: ['threads.net'], 'x-twitter': ['x.com', 'twitter.com'], tiktok: ['tiktok.com'],
  reddit: ['reddit.com'], discord: ['discord.com'], snapchat: ['snapchat.com'],
  pinterest: ['pinterest.com'], linkedin: ['linkedin.com'], mastodon: ['mastodon.social'],
  bluesky: ['bsky.app'], telegram: ['telegram.org'], twitch: ['twitch.tv'], tumblr: ['tumblr.com'],
  'threads-app': ['threads.com'], vimeo: ['vimeo.com'], amazon: ['amazon.com'], netflix: ['netflix.com'],
  spotify: ['spotify.com'], steam: ['steampowered.com'], 'epic-games': ['epicgames.com'],
  openai: ['openai.com'], snap: ['snap.com'], yahoo: ['yahoo.com'], dropbox: ['dropbox.com'], zoom: ['zoom.us']
};
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function isSearchPage() {
  const host = location.hostname;
  return host === 'search.brave.com' || host === 'searx.be' || host.endsWith('.searx.space') ||
    ((host === 'google.com' || host === 'www.google.com') && location.pathname === '/search') || (host === 'www.bing.com' && location.pathname === '/search');
}
function createNotice() {
  const box = document.createElement('div');
  box.style.cssText = 'background:#1e293b;color:#cbd5e1;padding:13px 16px;border-radius:8px;border:1px solid #526582;font:13px system-ui,sans-serif;margin:10px 0;';
  box.textContent = 'This result was hidden by your Sovereign Blocker settings.';
  return box;
}
function cleanResults() {
  if (!isSearchPage()) return;
  api.storage.local.get({ enabled: true, keywords: [], selectedServices: [] }, settings => {
    if (!settings.enabled) return;
    const keywords = Array.isArray(settings.keywords) ? settings.keywords : [];
    const domains = (Array.isArray(settings.selectedServices) ? settings.selectedServices : []).flatMap(id => serviceDomains[id] || []);
    if (!keywords.length && !domains.length) return;
    document.querySelectorAll('div.result, div.g, div[data-type="web"], li.b_algo').forEach(card => {
      if (card.dataset.sovereignFiltered === 'true') return;
      const text = (card.innerText || '').toLocaleLowerCase();
      const explicitServiceMatch = domains.some(domain => text.includes(domain));
      const keywordMatch = keywords.some(keyword => {
        const term = keyword.trim().toLocaleLowerCase();
        if (!term) return false;
        const escaped = escapeRegex(term);
        const count = (text.match(new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'giu')) || []).length;
        return text.includes(`${term}.com`) || text.includes(`${term}.org`) || count >= 3;
      });
      if (!explicitServiceMatch && !keywordMatch) return;
      card.replaceChildren(createNotice());
      card.dataset.sovereignFiltered = 'true';
    });
  });
}
if (isSearchPage()) {
  cleanResults();
  new MutationObserver(cleanResults).observe(document.documentElement, { childList: true, subtree: true });
}
