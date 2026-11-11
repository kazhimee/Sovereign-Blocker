# Changelog

Project release history for GitHub. For user-facing Firefox Add-ons notes, see [FIREFOX_ADDONS_NOTES.md](FIREFOX_ADDONS_NOTES.md).

## [5.1.0] - 2026-11-11

### Added

- Added a full-page settings screen, opened in its own tab, with navigation for filtering, services, custom keywords, and About.
- Added 63 individually selectable service filters in five groups:
  - **Google (13):** Search, Drive, Docs, Sheets, Slides, Gmail, Maps, YouTube, Photos, Play, Calendar, Meet, and Chrome.
  - **Apple (10):** Apple, iCloud, Music, TV+, App Store, Support, Maps, Podcasts, Pay, and iCloud Mail.
  - **Microsoft (12):** Microsoft, Bing, Outlook, OneDrive, Microsoft 365, Word, Excel, PowerPoint, Teams, Windows, Xbox, and Azure.
  - **Social media (18):** Facebook, Instagram, WhatsApp, Threads, X/Twitter, TikTok, Reddit, Discord, Snapchat, Pinterest, LinkedIn, Mastodon, Bluesky, Telegram, Twitch, Tumblr, Threads media, and Vimeo.
  - **Other platforms (10):** Amazon, Netflix, Spotify, Steam, Epic Games, OpenAI, Snap, Yahoo, Dropbox, and Zoom.
- Added a selected-service count for each service group.
- Added 16, 32, 48, and 96 pixel toolbar and extension icons.

### Changed

- Replaced the old crowded popup with a compact status panel and an **Open settings** button.
- Service filters and custom keywords now start empty. No listed company or platform is filtered unless the user selects it.
- Filtering is enabled by default, but with no filters selected it does not change search results. A master switch can pause or resume filtering.
- Updated the extension to version 5.1.0 and removed the unused `tabs` permission; the manifest requests only local storage.

### Filtering behavior

- Selected services match their listed website domains in supported search result cards.
- Custom keywords match when they occur at least three times as whole words, or when the keyword is followed by `.com` or `.org` in the result text.
- On a match, the extension replaces that result card's contents with a notice.
- Content filtering runs on Brave Search, Google Search, Bing Search, and SearX pages matched by the extension manifest.
- Preferences are stored with the browser's local extension storage.

## [5.0.0] - 2026-11-11

### Added

- Added a master filtering on/off switch.
- Added a custom keyword list with add and remove controls.
- Added an About section with developer and contact information, including the Patreon support link.

### Changed

- Moved detailed filtering controls out of the small toolbar popup and into a full-page settings interface.
- Removed the automatically populated Apple, Microsoft, and Google blacklist so new installs would not filter those companies by default.
