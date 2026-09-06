# 🔐 Secure Password Generator

A sleek, modern, and cryptographically secure password generator web application built with pure **HTML5, CSS3, and JavaScript**.

---

## ✨ Features

- **🛡️ Cryptographically Secure**: Uses `window.crypto.getRandomValues()` (Web Crypto API) for secure random character generation.
- **📊 Shannon Entropy & Strength Analyzer**: Dynamically calculates entropy bits ($H = L \cdot \log_2(N)$) with color-coded strength meters.
- **⚡ Quick Presets**:
  - **Basic**: 10 characters (Letters + Numbers)
  - **Strong**: 16 characters (Letters + Numbers + Symbols)
  - **Ultra Strong**: 24 characters (All sets, excluding ambiguous characters)
- **🌓 Dark & Light Mode**: Automatic system theme detection (`prefers-color-scheme`) with persistent `localStorage` saving.
- **👁️ Password Masking**: Toggle visibility between plain text and masked characters.
- **📋 One-Click Copy**: Instant clipboard copying with feedback.
- **🕘 Password History**: Tracks your last 10 generated passwords locally without sending any data over the internet.
- **📱 Fully Responsive**: Optimized for desktops, tablets, and mobile devices.
- **⚡ Zero External Dependencies**: Blazing fast, self-contained, and privacy-focused.

---

## 🚀 How to Run & Deploy

### Run Locally
Open `main.html` directly in any web browser.

### Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and `/root` folder, then click **Save**.
4. Since the file is named `main.html`, access it directly at:
   ```
   https://<your-username>.github.io/<your-repo-name>/main.html
   ```

---

## 🛠️ Project Structure

```
├── main.html        # Main application page
├── style1.css       # Complete modern styling and dark mode
├── script.js        # Core cryptographic generation, UI events, and history logic
├── .gitignore       # Git ignore rules for system/editor files
└── README.md        # Documentation and guide
```

---

## 🔒 Privacy & Security

All passwords are generated locally within your browser. **No data is ever stored on or transmitted to any external server.**
