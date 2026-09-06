# 🔐 Password Generator

A sleek, modern, and customizable password generator web application built with pure **HTML5, CSS3, and JavaScript**.

---

## ✨ Features

- **🎲 Customizable Random Generation**: Generates randomized passwords across configurable character pools (Uppercase, Lowercase, Numbers, and Symbols).
- **🔀 Fisher-Yates Shuffle Algorithm**: Ensures unbiased character distribution and guarantees at least one character from each selected category.
- **📊 Shannon Entropy & Strength Analyzer**: Dynamically calculates entropy bits ($H = L \cdot \log_2(N)$) with color-coded strength meters.
- **⚡ Quick Presets**:
  - **Basic**: 10 characters (Letters + Numbers)
  - **Strong**: 16 characters (Letters + Numbers + Symbols)
  - **Ultra Strong**: 24 characters (All sets, excluding ambiguous characters)
- **🌓 Dark & Light Mode**: Automatic system theme detection (`prefers-color-scheme`) with persistent `localStorage` saving.
- **👁️ Password Masking**: Toggle visibility between plain text and masked characters.
- **📋 One-Click Copy**: Instant clipboard copying with visual feedback.
- **🕘 Password History**: Tracks your last 10 generated passwords locally in your browser.
- **📱 Fully Responsive**: Modern glassmorphism UI optimized for desktops, tablets, and mobile screens.
- **⚡ Zero External Dependencies**: Lightweight, self-contained, and privacy-friendly.

---

## 🚀 How to Run & Deploy

### Run Locally
Simply open `main.html` in any modern web browser.

### Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and `/root` folder, then click **Save**.
4. Access the live app at:
   ```
   https://<your-username>.github.io/<your-repo-name>/main.html
   ```

---

## 🛠️ Project Structure

```
├── main.html        # Application markup with modern vector icons
├── style1.css       # Responsive styling, glassmorphism design, and dark theme
├── script.js        # Generation logic, Fisher-Yates shuffle, UI events, and history
├── .gitignore       # Git ignore rules for system and editor files
└── README.md        # Documentation and project overview
```

---

## 🔒 Privacy

All passwords are generated locally within your browser. **No data is ever sent to or stored on any external server.**
