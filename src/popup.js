document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const keywordInput = document.getElementById('keywordInput');
  const addBtn = document.getElementById('addBtn');
  const keywordList = document.getElementById('keywordList');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const defaultBlacklist = [
    "macbook", "apple", "iphone", "imac", "mac os",
    "microsoft", "windows", "xbox", "surface", "bing",
    "google", "pixel", "chrome"
  ];

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  const observer = new MutationObserver(() => {
    const aboutSection = document.getElementById('sovereignAboutSection');
    if (!aboutSection) {
      const aboutTab = document.getElementById('aboutTab');
      if (aboutTab) {
        const restoredAbout = document.createElement('div');
        restoredAbout.id = 'sovereignAboutSection';
        restoredAbout.className = 'immutable-about';
        restoredAbout.innerHTML = `
          <div>Developer: <span style="color: #f9e2af; font-weight: bold;">Kazhime Kagemori</span></div>
          <div style="margin-top: 6px;">Support: <a href="mailto:kazhimeofficial@gmail.com" style="color: #89b4fa;">kazhimeofficial@gmail.com</a></div>
          <div style="margin-top: 6px;"><a href="https://github.com/kazhimee/Sovereign-Blocker" target="_blank" style="color: #89b4fa;">GitHub Repository</a></div>
        `;
        aboutTab.appendChild(restoredAbout);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  chrome.storage.local.get(['enabled', 'blacklist'], (result) => {
    toggleSwitch.checked = result.enabled !== false;
    renderList(result.blacklist || defaultBlacklist);
  });

  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.local.set({ enabled: isEnabled }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          const url = tabs[0].url || "";
          if (url.includes("search.brave.com") || url.includes("searx") || url.includes("google.com/search") || url.includes("bing.com/search")) {
            chrome.tabs.reload(tabs[0].id);
          }
        }
      });
    });
  });

  addBtn.addEventListener('click', () => {
    const val = keywordInput.value.trim().toLowerCase();
    if (!val) return;

    chrome.storage.local.get(['blacklist'], (result) => {
      const list = result.blacklist || defaultBlacklist;
      if (!list.includes(val)) {
        list.push(val);
        chrome.storage.local.set({ blacklist: list }, () => {
          renderList(list);
          keywordInput.value = '';
        });
      }
    });
  });

  function renderList(list) {
    keywordList.innerHTML = '';
    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.textContent = item;

      const delBtn = document.createElement('button');
      delBtn.textContent = 'x';
      delBtn.addEventListener('click', () => {
        const updated = list.filter(k => k !== item);
        chrome.storage.local.set({ blacklist: updated }, () => {
          renderList(updated);
        });
      });

      div.appendChild(delBtn);
      keywordList.appendChild(div);
    });
  }
});