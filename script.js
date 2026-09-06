document.addEventListener('DOMContentLoaded', () => {
 
    const passwordDisplay = document.getElementById('password-display');
    const visibilityToggle = document.getElementById('visibility-toggle');
    const copyButton = document.getElementById('copy-button');
    const copyMessage = document.getElementById('copy-message');

    const strengthText = document.getElementById('strength-text');
    const strengthBar = document.getElementById('strength-bar');
    const entropyValue = document.getElementById('entropy-value');

    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');

    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const excludeAmbiguousCheckbox = document.getElementById('exclude-ambiguous');

    const presetButtons = document.querySelectorAll('.preset-button');
    const generateButton = document.getElementById('generate-button');

    const historyList = document.getElementById('history-list');
    const clearHistoryButton = document.getElementById('clear-history');
    const themeToggle = document.getElementById('theme-toggle');

    const CHAR_SETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const AMBIGUOUS_CHARS = new Set(['O', '0', 'I', 'l', '1', '|', 'o', 'i']);

    const MAX_HISTORY = 10;
    let history = JSON.parse(localStorage.getItem('pw_gen_history') || '[]');
    let isMasked = false;

    // SVG Icons
    const ICONS = {
        eye: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`,
        eyeOff: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 2.49-4.242"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
        copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
        check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#12b76a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
        sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
    };

    // Helper to get a random integer from 0 up to (max - 1)
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // Standard Fisher-Yates shuffle using a temporary variable
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = getRandomInt(i + 1);
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    // Generate a random password based on user choices
    function generatePassword(saveToHistory = true) {
        const length = parseInt(lengthSlider.value, 10);
        const includeUpper = uppercaseCheckbox.checked;
        const includeLower = lowercaseCheckbox.checked;
        const includeNumbers = numbersCheckbox.checked;
        const includeSymbols = symbolsCheckbox.checked;
        const excludeAmbiguous = excludeAmbiguousCheckbox.checked;

        // Ensure at least one character set is selected
        if (!includeUpper && !includeLower && !includeNumbers && !includeSymbols) {
            lowercaseCheckbox.checked = true;
        }

        let charPool = '';
        const guaranteedChars = [];

        function filterAmbiguous(str) {
            if (!excludeAmbiguous) return str;
            return str.split('').filter(char => !AMBIGUOUS_CHARS.has(char)).join('');
        }

        // Add character sets and guarantee at least one character from each
        if (includeUpper) {
            const set = filterAmbiguous(CHAR_SETS.uppercase);
            if (set.length > 0) {
                charPool += set;
                guaranteedChars.push(set[getRandomInt(set.length)]);
            }
        }
        if (includeLower) {
            const set = filterAmbiguous(CHAR_SETS.lowercase);
            if (set.length > 0) {
                charPool += set;
                guaranteedChars.push(set[getRandomInt(set.length)]);
            }
        }
        if (includeNumbers) {
            const set = filterAmbiguous(CHAR_SETS.numbers);
            if (set.length > 0) {
                charPool += set;
                guaranteedChars.push(set[getRandomInt(set.length)]);
            }
        }
        if (includeSymbols) {
            const set = filterAmbiguous(CHAR_SETS.symbols);
            if (set.length > 0) {
                charPool += set;
                guaranteedChars.push(set[getRandomInt(set.length)]);
            }
        }

        // Fallback in case pool is empty
        if (charPool.length === 0) {
            charPool = 'abcdefghjkmnpqrstuvwxyz23456789';
        }

        const passwordChars = [...guaranteedChars];

        // Fill remaining length with random characters from the pool
        while (passwordChars.length < length) {
            const randChar = charPool[getRandomInt(charPool.length)];
            passwordChars.push(randChar);
        }

        // Shuffle the characters so guaranteed characters aren't all at the start
        const finalPassword = shuffleArray(passwordChars).slice(0, length).join('');

        // Update UI display
        passwordDisplay.value = finalPassword;

        // Evaluate and update strength and entropy
        updateStrengthAndEntropy(finalPassword, charPool.length);

        // Add to history if requested
        if (saveToHistory && finalPassword) {
            addToHistory(finalPassword);
        }

        return finalPassword;
    }

    function updateStrengthAndEntropy(password, poolSize) {
        if (!password) {
            strengthText.textContent = 'Not Generated';
            strengthBar.style.width = '0%';
            strengthBar.style.backgroundColor = 'var(--danger)';
            entropyValue.textContent = '0 bits';
            return;
        }

        const length = password.length;
        const effectivePoolSize = poolSize > 0 ? poolSize : 10;
        
        // Shannon Entropy formula: H = L * log2(N)
        const entropy = Math.round(length * Math.log2(effectivePoolSize));

        let strengthLabel = 'Very Weak';
        let barColor = 'var(--danger)';
        let barWidth = '20%';

        if (entropy < 30 || length < 7) {
            strengthLabel = 'Very Weak';
            barColor = '#f04438';
            barWidth = '20%';
        } else if (entropy < 50 || length < 10) {
            strengthLabel = 'Weak';
            barColor = '#f79009';
            barWidth = '40%';
        } else if (entropy < 70 || length < 14) {
            strengthLabel = 'Medium';
            barColor = '#eab308';
            barWidth = '65%';
        } else if (entropy < 90 || length < 18) {
            strengthLabel = 'Strong';
            barColor = '#5b5bd6';
            barWidth = '85%';
        } else {
            strengthLabel = 'Very Strong';
            barColor = '#12b76a';
            barWidth = '100%';
        }

        strengthText.textContent = strengthLabel;
        strengthBar.style.width = barWidth;
        strengthBar.style.backgroundColor = barColor;
        entropyValue.textContent = `${entropy} bits (${strengthLabel})`;
    }
    async function copyPassword(text, message = 'Password copied to clipboard!') {
        if (!text) return;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            // Visual feedback
            showCopyFeedback(message);

            // Temporarily update copy button icon
            copyButton.innerHTML = ICONS.check;
            setTimeout(() => {
                copyButton.innerHTML = ICONS.copy;
            }, 1800);
        } catch (err) {
            showCopyFeedback('Failed to copy password', true);
        }
    }

    let copyTimeout;
    function showCopyFeedback(msg, isError = false) {
        clearTimeout(copyTimeout);
        copyMessage.textContent = msg;
        copyMessage.style.color = isError ? 'var(--danger)' : 'var(--success)';
        copyTimeout = setTimeout(() => {
            copyMessage.textContent = '';
        }, 2500);
    }

    function renderHistory() {
        if (!history || history.length === 0) {
            historyList.innerHTML = `
                <div id="empty-history" class="empty-history">
                    <span aria-hidden="true">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </span>
                    <p>No passwords generated yet.</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = '';
        history.forEach((pwd, idx) => {
            const item = document.createElement('div');
            item.className = 'history-item';

            const pwdSpan = document.createElement('span');
            pwdSpan.className = 'history-password';
            pwdSpan.textContent = isMasked ? '•'.repeat(Math.min(pwd.length, 20)) : pwd;
            pwdSpan.title = pwd;

            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'history-copy';
            copyBtn.setAttribute('aria-label', `Copy password ${idx + 1}`);
            copyBtn.innerHTML = `Copy`;

            copyBtn.addEventListener('click', () => {
                copyPassword(pwd, 'History password copied!');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 1500);
            });

            item.appendChild(pwdSpan);
            item.appendChild(copyBtn);
            historyList.appendChild(item);
        });
    }

    function addToHistory(pwd) {
        // Prevent duplicate at top
        if (history.length > 0 && history[0] === pwd) return;

        history.unshift(pwd);
        if (history.length > MAX_HISTORY) {
            history.pop();
        }
        localStorage.setItem('pw_gen_history', JSON.stringify(history));
        renderHistory();
    }

    function clearHistory() {
        history = [];
        localStorage.removeItem('pw_gen_history');
        renderHistory();
        showCopyFeedback('Password history cleared.');
    }

    function toggleVisibility() {
        isMasked = !isMasked;
        passwordDisplay.type = isMasked ? 'password' : 'text';
        visibilityToggle.innerHTML = isMasked ? ICONS.eyeOff : ICONS.eye;
        visibilityToggle.setAttribute('aria-label', isMasked ? 'Show password' : 'Hide password');
        renderHistory();
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = ICONS.sun;
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
            localStorage.setItem('pw_gen_theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = ICONS.moon;
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            localStorage.setItem('pw_gen_theme', 'light');
        }
    }

    function toggleTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        applyTheme(isDark ? 'light' : 'dark');
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('pw_gen_theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    const PRESETS = {
        basic: { length: 10, upper: true, lower: true, numbers: true, symbols: false, ambiguous: false },
        strong: { length: 16, upper: true, lower: true, numbers: true, symbols: true, ambiguous: false },
        ultra: { length: 24, upper: true, lower: true, numbers: true, symbols: true, ambiguous: true }
    };

    function applyPreset(presetKey) {
        const preset = PRESETS[presetKey];
        if (!preset) return;

        lengthSlider.value = preset.length;
        lengthValue.textContent = preset.length;

        uppercaseCheckbox.checked = preset.upper;
        lowercaseCheckbox.checked = preset.lower;
        numbersCheckbox.checked = preset.numbers;
        symbolsCheckbox.checked = preset.symbols;
        excludeAmbiguousCheckbox.checked = preset.ambiguous;

        // Trigger generate with spin animation
        triggerGenerateAnimation();
        generatePassword();
    }

    function triggerGenerateAnimation() {
        const icon = generateButton.querySelector('.button-icon');
        if (icon) {
            icon.classList.remove('spinning');
            // Force reflow
            void icon.offsetWidth;
            icon.classList.add('spinning');
        }
    }

    // Password Length Slider
    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
        generatePassword(false);
    });

    lengthSlider.addEventListener('change', () => {
        generatePassword(true);
    });

    // Checkbox Validations (Ensure at least 1 remains checked)
    const optionsCheckboxes = [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox];
    optionsCheckboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            const anyChecked = optionsCheckboxes.some(box => box.checked);
            if (!anyChecked) {
                e.target.checked = true;
                showCopyFeedback('At least one character type must be selected.', true);
                return;
            }
            generatePassword();
        });
    });

    excludeAmbiguousCheckbox.addEventListener('change', () => {
        generatePassword();
    });

    // Generate Button Click
    generateButton.addEventListener('click', () => {
        triggerGenerateAnimation();
        generatePassword(true);
    });

    // Copy Button Click
    copyButton.addEventListener('click', () => {
        copyPassword(passwordDisplay.value);
    });

    // Visibility Toggle Click
    visibilityToggle.addEventListener('click', toggleVisibility);

    // Presets Click
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const presetKey = btn.getAttribute('data-preset');
            applyPreset(presetKey);
        });
    });

    // History Buttons
    clearHistoryButton.addEventListener('click', clearHistory);

    // Theme Toggle Click
    themeToggle.addEventListener('click', toggleTheme);

    initTheme();
    renderHistory();
    generatePassword(false);
});
