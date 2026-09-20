document.addEventListener('DOMContentLoaded', () => {
    const keywordInput = document.getElementById('keywordInput');
    const addBtn = document.getElementById('addBtn');
    const listContainer = document.getElementById('listContainer');

    const defaultBlacklist = [
        "macbook", "apple", "iphone", "imac", "mac os",
        "microsoft", "windows", "xbox", "surface", "bing",
        "google", "pixel", "chrome"
    ];

    function loadBlacklist() {
        chrome.storage.local.get(['blacklist'], (result) => {
            let list = result.blacklist;
            if (!list) {
                list = defaultBlacklist;
                chrome.storage.local.set({ blacklist: list });
            }
            renderList(list);
        });
    }

    function renderList(list) {
        // innerHTML yerine güvenli temizleme
        listContainer.replaceChildren();
        
        if (list.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = "text-align:center; color:#6c7086; font-size:11px; padding:10px;";
            emptyDiv.textContent = "Blacklist is empty";
            listContainer.appendChild(emptyDiv);
            return;
        }

        list.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item';

            const span = document.createElement('span');
            span.textContent = item;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.setAttribute('data-index', index);
            deleteBtn.textContent = 'X';
            
            deleteBtn.addEventListener('click', () => {
                removeItem(index);
            });

            div.appendChild(span);
            div.appendChild(deleteBtn);
            listContainer.appendChild(div);
        });
    }

    function addItem() {
        const val = keywordInput.value.trim().toLowerCase();
        if (!val) return;
        chrome.storage.local.get(['blacklist'], (result) => {
            let list = result.blacklist || defaultBlacklist;
            if (!list.includes(val)) {
                list.push(val);
                chrome.storage.local.set({ blacklist: list }, () => {
                    keywordInput.value = '';
                    loadBlacklist();
                });
            }
        });
    }

    function removeItem(index) {
        chrome.storage.local.get(['blacklist'], (result) => {
            let list = result.blacklist || defaultBlacklist;
            list.splice(index, 1);
            chrome.storage.local.set({ blacklist: list }, () => {
                loadBlacklist();
            });
        });
    }

    addBtn.addEventListener('click', addItem);
    keywordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });

    loadBlacklist();
});