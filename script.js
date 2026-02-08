document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES ---
    const terminalWindow = document.getElementById('terminal-window');
    const terminalOutput = document.getElementById('terminal-output');
    const commandInput = document.getElementById('command-input');
    const inputDisplay = document.getElementById('input-display');
    const asciiAnimContainer = document.getElementById('ascii-anim');

    // --- GUI TRANSITION LOGIC ---
    const guiToggle = document.getElementById('gui-toggle');

    if (guiToggle) {
        guiToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Stop immediate navigation
            
            // 1. Detect OS
            const platform = navigator.platform.toLowerCase();
            const userAgent = navigator.userAgent.toLowerCase();
            let osMessage = "Initializing Graphical Interface..."; // Default

            if (platform.includes('win') || userAgent.includes('windows')) {
                osMessage = "Average Windows user detected. Loading GUI... 🪟";
            } else if (platform.includes('mac') || userAgent.includes('macintosh')) {
                osMessage = "macOS detected. Switching to GUI view... 🍎";
            } else if (platform.includes('linux') || userAgent.includes('linux')) {
                if (userAgent.includes('android')) {
                    osMessage = "Mobile user detected. Optimizing for touch... 📱";
                } else {
                    osMessage = "Linux user detected... you sure about GUI? 😉 🐧";
                }
            } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
                osMessage = "iOS detected. Switching to Retina view... 📱";
            }

            // 2. Show Toast Notification
            showToast(osMessage);

            // 3. Optional: Also log to terminal for history
            const terminalOutput = document.getElementById('terminal-output');
            if(terminalOutput) {
                const msg = document.createElement('div');
                msg.className = 'response-block';
                msg.innerHTML = `System: <span style="color: var(--accent-secondary);">${osMessage}</span>`;
                terminalOutput.appendChild(msg);
                // Force scroll to bottom to see message
                requestAnimationFrame(() => {
                   terminalWindow.scrollTop = terminalWindow.scrollHeight;
                });
            }

            // 4. Play Fade Out Animation & Redirect
            document.body.classList.add('fade-out');

            // Wait 1.5s so they can read the toast, then switch
            setTimeout(() => {
                window.location.href = guiToggle.href;
            }, 2000);
        });
    }

    // Helper function for the Toast
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Create the toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        
        // Build inner HTML to match reference image structure
        // checkmark icon - message - vertical line - close X
        toast.innerHTML = `
            <div class="toast-icon-box">
                <i class="ri-checkbox-circle-fill"></i> <span>✔</span> 
            </div>
            <span class="toast-message">${message}</span>
            <div class="toast-separator"></div>
            <div class="toast-close" onclick="this.parentElement.remove()">×</div>
        `;
        
        // Note: I added a fallback '✔' span just in case you don't have an icon library loaded.
        // If you are using RemixIcon (as per your GUI file), you can remove the <span>✔</span> part.

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000); // 4 seconds
    }
    
    // Command History
    let commandHistory = [];
    let historyIndex = -1;

    // Available Commands & Mapping to Templates
    const commandMap = {
        'whoami': 'tpl-whoami',
        'ls skills': 'tpl-skills',
        'ls projects': 'tpl-projects',
        'cat experience': 'tpl-experience',
        'cat education': 'tpl-education',
        'ls certifications': 'tpl-certifications',
        'contact': 'tpl-contact'
    };

    // --- INITIALIZATION ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    let startTime = new Date();
    const uptimeElement = document.getElementById('uptime');
    if(uptimeElement) {
        setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now - startTime) / 60000); 
            uptimeElement.innerText = `${diff} mins`;
        }, 60000);
    }

    // Focus Input on Click
    document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && !window.getSelection().toString()) {
            commandInput.focus();
        }
    });

    // Focus management
    // document.addEventListener('click', (e) => {
    //     // If user clicks a link or button, don't hijack focus
    //     if (e.target.tagName !== 'A' && e.target.closest('.sidebar') === null && !window.getSelection().toString()) {
    //         commandInput.focus();
    //     }
    // });

    // --- ASCII ANIMATION (Server Rack Pulse) ---
    const frames = [
`
 [=     ]
 [      ]
 [      ]
`,
`
 [ =    ]
 [=     ]
 [      ]
`,
`
 [  =   ]
 [ =    ]
 [=     ]
`,
`
 [   =  ]
 [  =   ]
 [ =    ]
`,
`
 [    = ]
 [   =  ]
 [  =   ]
`,
`
 [     =]
 [    = ]
 [   =  ]
`
    ];
    
    // Reverse the frames to create a bounce effect
    const animationFrames = [...frames, ...[...frames].reverse()];
    let frameIndex = 0;

    setInterval(() => {
        asciiAnimContainer.innerText = animationFrames[frameIndex];
        frameIndex = (frameIndex + 1) % animationFrames.length;
    }, 150); // Speed of animation

    // --- INPUT SYNC (Fake Block Cursor) ---
    commandInput.addEventListener('input', () => {
        inputDisplay.innerText = commandInput.value;
    });

    // --- CORE FUNCTIONS ---
    window.runCommand = function(cmd) {
        // Visual feedback for clicking
        inputDisplay.innerText = cmd;
        commandInput.value = cmd;
        
        // Small delay to make it feel like "typing"
        setTimeout(() => {
            handleCommand(cmd);
        }, 100);
    };

    function handleCommand(cmd) {
        const cleanCmd = cmd.trim().toLowerCase();
        
        // 1. Create the "Past Command" Line
        const historyLine = document.createElement('div');
        historyLine.className = 'command-line';
        historyLine.innerHTML = `
            <span class="prompt-user">immanuel@ubuntu</span>:<span class="prompt-path">~</span>$ 
            <span class="command-text">${cmd}</span>
        `;
        terminalOutput.appendChild(historyLine);

        // 2. Process Command
        if (cleanCmd === 'clear') {
            terminalOutput.innerHTML = '';
        } 
        else if (cleanCmd === 'gui') {
            document.getElementById('gui-toggle').click(); // Trigger the click handler we wrote earlier
            return;
        }
        else if (cleanCmd === 'theme toggle') {
            toggleTheme();
        } 
        else if (commandMap[cleanCmd]) {
            const template = document.getElementById(commandMap[cleanCmd]);
            if (template) {
                const clone = template.content.cloneNode(true);
                terminalOutput.appendChild(clone);
            }
        } 
        else if (cleanCmd !== '') {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'response-block';
            errorMsg.innerHTML = `<span style="color: var(--text-error);">Command not found: ${cmd}</span>. Check the guide.`;
            terminalOutput.appendChild(errorMsg);
        }

        // 3. Add to History
        if (cleanCmd && commandHistory[commandHistory.length - 1] !== cmd) {
            commandHistory.push(cmd);
            historyIndex = commandHistory.length;
        }

        commandInput.value = '';
        inputDisplay.innerText = '';

        // 4. FORCE SCROLL TO BOTTOM (The Fix)
        // We use requestAnimationFrame to ensure the DOM has updated before scrolling
        requestAnimationFrame(() => {
            terminalWindow.scrollTop = terminalWindow.scrollHeight;
        });
        
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        
        const msg = document.createElement('div');
        msg.className = 'response-block';
        msg.innerHTML = `Theme set to <span style="color: var(--accent-highlight);">${next}</span> mode.`;
        terminalOutput.appendChild(msg);
    }

    // --- EVENT LISTENERS ---
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleCommand(commandInput.value);
            historyIndex = commandHistory.length; 
        } 
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex];
                inputDisplay.innerText = commandInput.value;
            }
        } 
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex];
                inputDisplay.innerText = commandInput.value;
            } else {
                historyIndex = commandHistory.length;
                commandInput.value = '';
                inputDisplay.innerText = '';
            }
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            const currentVal = commandInput.value.toLowerCase();
            const allCommands = Object.keys(commandMap).concat(['clear', 'theme toggle', 'download resume']);
            const match = allCommands.find(c => c.startsWith(currentVal));
            if (match) {
                commandInput.value = match;
                inputDisplay.innerText = match;
            }
        }
    });

    // --- BOOT SEQUENCE ---
    function autoType(text, index = 0) {
        if (index < text.length) {
            const char = text.charAt(index);
            commandInput.value += char;
            inputDisplay.innerText += char; // Update visual
            setTimeout(() => autoType(text, index + 1), 50 + Math.random() * 50);
        } else {
            setTimeout(() => handleCommand(text), 400);
        }
    }

    setTimeout(() => autoType('whoami'), 800);
});