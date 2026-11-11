const api = globalThis.browser || globalThis.chrome;
const services = [
  { group: 'Google', entries: [
    ['google-search','Google Search','google.com'], ['google-drive','Google Drive','drive.google.com'],
    ['google-docs','Google Docs','docs.google.com'], ['google-sheets','Google Sheets','sheets.google.com'],
    ['google-slides','Google Slides','slides.google.com'], ['gmail','Gmail','mail.google.com'],
    ['google-maps','Google Maps','maps.google.com'], ['youtube','YouTube','youtube.com'],
    ['google-photos','Google Photos','photos.google.com'], ['google-play','Google Play','play.google.com'],
    ['google-calendar','Google Calendar','calendar.google.com'], ['google-meet','Google Meet','meet.google.com'],
    ['google-chrome','Google Chrome','google.com/chrome']
  ]},
  { group: 'Apple', entries: [
    ['apple','Apple','apple.com'], ['icloud','iCloud','icloud.com'], ['apple-music','Apple Music','music.apple.com'],
    ['apple-tv','Apple TV+','tv.apple.com'], ['app-store','App Store','apps.apple.com'],
    ['apple-support','Apple Support','support.apple.com'], ['apple-maps','Apple Maps','maps.apple.com'],
    ['apple-podcasts','Apple Podcasts','podcasts.apple.com'], ['apple-pay','Apple Pay','apple.com/apple-pay'],
    ['apple-icloud-mail','iCloud Mail','icloud.com/mail']
  ]},
  { group: 'Microsoft', entries: [
    ['microsoft','Microsoft','microsoft.com'], ['bing','Bing','bing.com'], ['outlook','Outlook','outlook.com'],
    ['onedrive','OneDrive','onedrive.live.com'], ['microsoft-365','Microsoft 365','microsoft365.com'],
    ['word','Word','word.cloud.microsoft'], ['excel','Excel','excel.cloud.microsoft'],
    ['powerpoint','PowerPoint','powerpoint.cloud.microsoft'], ['teams','Microsoft Teams','teams.microsoft.com'],
    ['windows','Windows','microsoft.com/windows'], ['xbox','Xbox','xbox.com'], ['azure','Microsoft Azure','azure.microsoft.com']
  ]},
  { group: 'Social media', entries: [
    ['facebook','Facebook','facebook.com'], ['instagram','Instagram','instagram.com'],
    ['whatsapp','WhatsApp','whatsapp.com'], ['threads','Threads','threads.net'],
    ['x-twitter','X / Twitter','x.com · twitter.com'], ['tiktok','TikTok','tiktok.com'],
    ['reddit','Reddit','reddit.com'], ['discord','Discord','discord.com'],
    ['snapchat','Snapchat','snapchat.com'], ['pinterest','Pinterest','pinterest.com'],
    ['linkedin','LinkedIn','linkedin.com'], ['mastodon','Mastodon','mastodon.social'],
    ['bluesky','Bluesky','bsky.app'], ['telegram','Telegram','telegram.org'],
    ['twitch','Twitch','twitch.tv'], ['tumblr','Tumblr','tumblr.com'],
    ['threads-app','Threads media','threads.com'], ['vimeo','Vimeo','vimeo.com']
  ]},
  { group: 'Other platforms', entries: [
    ['amazon','Amazon','amazon.com'], ['netflix','Netflix','netflix.com'],
    ['spotify','Spotify','spotify.com'], ['steam','Steam','steampowered.com'],
    ['epic-games','Epic Games','epicgames.com'], ['openai','OpenAI','openai.com'],
    ['snap','Snap Inc.','snap.com'], ['yahoo','Yahoo','yahoo.com'],
    ['dropbox','Dropbox','dropbox.com'], ['zoom','Zoom','zoom.us']
  ]}
];
let selectedServices = [];
let keywords = [];
let saveTimer;

function renderServices() {
  const container = document.getElementById('serviceGroups');
  container.replaceChildren();
  for (const group of services) {
    const card = document.createElement('section');
    card.className = 'service-group';
    const heading = document.createElement('div'); heading.className = 'group-title';
    const title = document.createElement('h3'); title.textContent = group.group;
    const count = document.createElement('span'); count.textContent = `${group.entries.filter(([id]) => selectedServices.includes(id)).length} selected`;
    heading.append(title, count);
    const grid = document.createElement('div'); grid.className = 'service-grid';
    for (const [id, label, domain] of group.entries) {
      const row = document.createElement('label'); row.className = 'service-option';
      const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = selectedServices.includes(id); checkbox.dataset.service = id;
      const text = document.createElement('span'); text.append(document.createTextNode(label));
      const hint = document.createElement('small'); hint.textContent = domain; text.appendChild(hint);
      row.append(checkbox, text); grid.appendChild(row);
      checkbox.addEventListener('change', () => {
        selectedServices = checkbox.checked ? [...new Set([...selectedServices, id])] : selectedServices.filter(item => item !== id);
        count.textContent = `${group.entries.filter(([key]) => selectedServices.includes(key)).length} selected`;
        save({ selectedServices });
      });
    }
    card.append(heading, grid); container.appendChild(card);
  }
}
function renderKeywords() {
  const list = document.getElementById('keywordList'); list.replaceChildren();
  document.getElementById('emptyKeywords').hidden = keywords.length > 0;
  for (const keyword of keywords) {
    const row = document.createElement('div'); row.className = 'keyword-item';
    const value = document.createElement('span'); value.textContent = keyword;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${keyword}`);
    remove.addEventListener('click', () => { keywords = keywords.filter(item => item !== keyword); save({ keywords }); renderKeywords(); });
    row.append(value, remove); list.appendChild(row);
  }
}
function save(values) {
  api.storage.local.set(values);
  const status = document.getElementById('saveStatus'); status.textContent = 'Settings saved'; status.classList.add('show');
  clearTimeout(saveTimer); saveTimer = setTimeout(() => status.classList.remove('show'), 1500);
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await api.storage.local.get({ enabled: true, keywords: [], selectedServices: [] });
  keywords = Array.isArray(data.keywords) ? data.keywords.filter(value => typeof value === 'string') : [];
  // Migrate older versions while deliberately discarding their automatic company blacklist.
  const legacy = await api.storage.local.get(['blacklist']);
  if (!Array.isArray(data.keywords) && Array.isArray(legacy.blacklist)) {
    keywords = [];
    await api.storage.local.remove('blacklist');
    await api.storage.local.set({ keywords: [] });
  }
  selectedServices = Array.isArray(data.selectedServices) ? data.selectedServices : [];
  document.getElementById('enabled').checked = data.enabled !== false;
  document.getElementById('enabled').addEventListener('change', event => save({ enabled: event.target.checked }));
  renderServices(); renderKeywords();
  document.getElementById('keywordForm').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('keywordInput'); const keyword = input.value.trim();
    if (!keyword || keywords.some(item => item.toLocaleLowerCase() === keyword.toLocaleLowerCase())) return;
    keywords = [...keywords, keyword]; save({ keywords }); renderKeywords(); input.value = ''; input.focus();
  });
  const links = [...document.querySelectorAll('.nav-link')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (visible) links.forEach(link => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
  }, { rootMargin: '-10% 0px -70% 0px' });
  ['filters','services','keywords','about'].forEach(id => observer.observe(document.getElementById(id)));
});
