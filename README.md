# 🛡️ Sovereign Blocker

[![Firefox Add-on](https://img.shields.io/amo/v/sovereign-blocker?color=%230060df&label=Firefox%20Add-on&style=for-the-badge)](https://addons.mozilla.org/en-US/firefox/addon/sovereign-blocker/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](LICENSE)

> **Sovereign Blocker** is a lightweight, privacy-focused Firefox extension designed to give you absolute digital sovereignty over your search engine results. Say goodbye to unwanted clickbait, AI-generated clutter, and algorithmic noise.

---

## 🚀 Key Features

* **Dynamic Blacklist:** Instantly add or remove unwanted brand terms and keywords on the fly via an intuitive popup interface.
* **100% Local & Private:** Operates entirely locally using browser storage (`chrome.storage.local`). Zero tracking, zero telemetry, and zero external data collection.
* **Targeted Filtering Engine:** Cleanly inspects and filters search engine results (such as Brave and SearXNG) without interfering with your daily web applications.
* **AMO Policy Compliant:** Built with clean, modern DOM manipulation methods (`createElement`, `replaceChildren`) ensuring zero warnings and seamless integration with Mozilla standards.

---

## 📦 Installation & Usage

### Method 1: Direct `.XPI` Installation (Fastest)
1. Head over to the [Releases](../../releases) tab of this repository.
2. Download the latest compiled `.xpi` package (e.g., `sovereign-blocker@arch.linux.xpi`).
3. Drag and drop the downloaded file directly into an open Firefox window and click **Add**.

### Method 2: Official Firefox Add-ons Store (Recommended)
You can install the stable build directly from the official Mozilla repository:
👉 **[Install Sovereign Blocker from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/sovereign-blocker/)**

### Method 3: Manual Developer Mode
1. Clone the repository or download the source code zip.
2. Open Firefox and navigate to `about:debugging#/runtime`.
3. Click on **"Load Temporary Add-on..."** and select the `manifest.json` file inside the project directory.

---

## 💻 How It Works

Sovereign Blocker dynamically reads your custom blacklisted keywords from local storage and inspects search result DOM nodes. When a match is detected, it cleanly replaces the unwanted container with a neutral **"Content Purified"** marker, keeping your digital environment distraction-free.

---

## 📄 License

This project is open-source and licensed under the **GNU General Public License v3.0 (GPLv3)**. See the [LICENSE](LICENSE) file for details.
