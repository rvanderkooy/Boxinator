---
name: Boxing Timer Web Application
overview: Create a web application for a boxing timer, with PWA support, hosted on GitHub Pages. The timer will allow users to configure round duration, break duration, number of rounds, and a 10-second warning bell.
todos:
  - id: createa_index-html
    content: Create `index.html` with the provided structure.
    status: pending
  - id: create-style-css
    content: Create `style.css` with the provided styling.
    status: pending
  - id: create-script-js
    content: Create `script.js` with the timer logic.
    status: pending
  - id: create-manifest-json
    content: Create `manifest.json` for PWA capabilities.
    status: pending
  - id: create-service-worker-js
    content: Create `service-worker.js` for offline support.
    status: pending
  - id: createa_icons
    content: Create `icons` directory and add `icon-192x192.png` and `icon-512x512.png` for the PWA.
    status: pending
  - id: add-audio-files
    content: Obtain (or create simple) audio files for start/end bells and the warning bell, and update their paths in `script.js` and `service-worker.js`.
    status: pending
  - id: deploy-to-github-pages
    content: Deploy the application to GitHub Pages.
    status: pending
isProject: false
---

# Boxing Timer Web Application Plan

This plan outlines the steps to create a boxing timer as an HTML webpage, installable as a Progressive Web App (PWA), and hosted on GitHub Pages.

## Project Structure

The project will follow a standard web application structure:

- `index.html`: The main HTML file for the application.
- `style.css`: For styling the application.
- `script.js`: For the application logic and timer functionality.
- `manifest.json`: For PWA configuration.
- `service-worker.js`: For PWA offline capabilities.

## Core Features

### 1. User Interface (HTML & CSS)

- **Main Layout:** A clean, responsive layout to display timer controls and current round/time.
- **Configuration Controls:**
    - Round Duration (1 Min, 2 Min, 3 Min)
    - Break Duration (10s, 20s, 30s, 1 Min, 2 Min)
    - Number of Rounds (1-8 Rounds)
    - 10-second Warning Bell (Toggle ON/OFF)
- **Display Area:** Clearly show the current round, time remaining, and status (e.g., "Round 1", "Break", "Prepare").
- **Control Buttons:** Start, Pause, Reset.

### 2. Timer Logic (JavaScript)

- **Configuration Management:** Store and retrieve user preferences for round time, break time, rounds, and warning bell.
- **Timer Countdown:** Implement accurate countdown logic for rounds and breaks.
- **State Management:** Track the current round, time remaining, and overall timer state (running, paused, stopped).
- **Audio Cues:**
    - Single bell (🔔) at the start of each round (including the initial delay phase).
    - Triple bells (🔔🔔🔔) at the end of each round.
    - 10-second warning bell (if enabled).
- **Progressive Web App (PWA) Features:**
    - **Manifest File:** `manifest.json` will define app name, icons, start URL, display mode, etc.
    - **Service Worker:** `service-worker.js` will enable offline access and caching of assets.

### 3. Deployment (GitHub Pages)

- The application will be deployed to GitHub Pages for easy access.

## Implementation Details

### HTML Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boxing Timer</title>
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <div class="container">
        <h1>Boxing Timer</h1>
        <div class="timer-display">
            <h2 id="status">Prepare</h2>
            <div id="time">00:00</div>
            <div id="round">Round 0 / 0</div>
        </div>
        <div class="controls">
            <div class="setting">
                <label for="roundDuration">Round Duration:</label>
                <select id="roundDuration">
                    <option value="60">1 Minute</option>
                    <option value="120">2 Minutes</option>
                    <option value="180">3 Minutes</option>
                </select>
            </div>
            <div class="setting">
                <label for="breakDuration">Break Duration:</label>
                <select id="breakDuration">
                    <option value="10">10 Seconds</option>
                    <option value="20">20 Seconds</option>
                    <option value="30">30 Seconds</option>
                    <option value="60">1 Minute</option>
                    <option value="120">2 Minutes</option>
                </select>
            </div>
            <div class="setting">
                <label for="numRounds">Number of Rounds:</label>
                <select id="numRounds">
                    <option value="1">1 Round</option>
                    <option value="2">2 Rounds</option>
                    <option value="3">3 Rounds</option>
                    <option value="4">4 Rounds</option>
                    <option value="5">5 Rounds</option>
                    <option value="6">6 Rounds</option>
                    <option value="7">7 Rounds</option>
                    <option value="8">8 Rounds</option>
                </select>
            </div>
            <div class="setting">
                <label for="initialDelay">Delay before first Round:</label>
                <select id="initialDelay">
                    <option value="5">5 Seconds</option>
                    <option value="10">10 Seconds</option>
                    <option value="20">20 Seconds</option>
                    <option value="30">30 Seconds</option>
                    <option value="60">1 Minute</option>
                </select>
            </div>
            <div class="setting checkbox">
                <input type="checkbox" id="warningBell" checked>
                <label for="warningBell">10-second Warning Bell</label>
            </div>
            <div class="action-buttons">
                <button id="startButton">Start</button>
                <button id="pauseButton">Pause</button>
                <button id="resetButton">Reset</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered: ', registration);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed: ', error);
                    });
            });
        }
    </script>
</body>
</html>
```

### CSS Styling (`style.css`)

Basic styling for a modern, clean look.

```css
/* Placeholder for styling */
body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #282c34;
    color: #fff;
    margin: 0;
}

.container {
    background-color: #3a3f4a;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    text-align: center;
}

h1 {
    color: #61dafb;
}

.timer-display {
    margin: 20px 0;
}

#status {
    font-size: 2em;
    margin-bottom: 10px;
}

#time {
    font-size: 4em;
    font-weight: bold;
}

#round {
    font-size: 1.2em;
    margin-top: 5px;
}

.controls {
    margin-top: 30px;
}

.setting {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.setting label {
    margin-right: 10px;
}

.setting select, .setting input[type="checkbox"] {
    padding: 8px;
    border-radius: 5px;
    border: none;
    background-color: #4a4f59;
    color: #fff;
}

.checkbox {
    justify-content: center;
}

.action-buttons button {
    background-color: #61dafb;
    color: #282c34;
    border: none;
    padding: 10px 20px;
    margin: 0 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
}

.action-buttons button:hover {
    background-color: #21a1f1;
}
```

### JavaScript Logic (`script.js`)

This file will contain the main timer logic.

```javascript
// Initial values and DOM elements
const timeDisplay = document.getElementById('time');
const statusDisplay = document.getElementById('status');
const roundDisplay = document.getElementById('round');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const roundDurationSelect = document.getElementById('roundDuration');
const breakDurationSelect = document.getElementById('breakDuration');
const numRoundsSelect = document.getElementById('numRounds');
const warningBellCheckbox = document.getElementById('warningBell');
const initialDelaySelect = document.getElementById('initialDelay');

let timer;
let currentRound = 0;
let timeLeft;
let isRunning = false;
let isBreak = false;
let totalRounds;
let roundDuration;
let breakDuration;
let warningBellEnabled;
let initialDelay;

// Audio setup (placeholders)
const startRoundBell = new Audio('path/to/single-bell.mp3'); // Replace with actual paths for single bell
const endRoundBell = new Audio('path/to/triple-bells.mp3'); // Replace with actual paths for triple bells
const warningBell = new Audio('path/to/warning-bell.mp3');   // Replace with actual paths for warning bell

function initializeTimer() {
    roundDuration = parseInt(roundDurationSelect.value);
    breakDuration = parseInt(breakDurationSelect.value);
    totalRounds = parseInt(numRoundsSelect.value);
    warningBellEnabled = warningBellCheckbox.checked;
    initialDelay = parseInt(initialDelaySelect.value);

    currentRound = 0;
    isBreak = false;
    isRunning = false;
    clearInterval(timer);
    updateDisplay("Prepare", 0, roundDuration);
    startButton.textContent = "Start";
}

function updateDisplay(status, currentRoundNum, time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    statusDisplay.textContent = status;
    roundDisplay.textContent = `Round ${currentRoundNum} / ${totalRounds}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startButton.textContent = "Resume";
        if (currentRound === 0) { // First start (initial delay)
            currentRound = 0;
            timeLeft = initialDelay;
            isBreak = true; // Use isBreak to signify initial delay phase
            statusDisplay.textContent = "Prepare (Delay)";
            startRoundBell.play(); // Play single bell for initial prep start
        }
        timer = setInterval(countdown, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
    startButton.textContent = "Resume";
}

function resetTimer() {
    initializeTimer();
}

function countdown() {
    timeLeft--;

    if (warningBellEnabled && !isBreak && timeLeft === 10) {
        warningBell.play();
    }

    if (timeLeft <= 0) {
        clearInterval(timer);
        if (isBreak) { // Transitioning from initial delay or break to a round
            if (currentRound === 0) { // Initial delay is over, start first round
                currentRound = 1;
                timeLeft = roundDuration;
                isBreak = false;
                startRoundBell.play(); // Single bell for round start
                statusDisplay.textContent = "Round";
                timer = setInterval(countdown, 1000);
            } else { // Break after a round is over, start next round
                currentRound++;
                if (currentRound <= totalRounds) {
                    timeLeft = roundDuration;
                    isBreak = false;
                    startRoundBell.play(); // Single bell for round start
                    statusDisplay.textContent = "Round";
                    timer = setInterval(countdown, 1000);
                } else { // All rounds finished
                    endRoundBell.play(); // Triple bells for session end
                    updateDisplay("Finished!", totalRounds, 0);
                    isRunning = false;
                    startButton.textContent = "Start";
                }
            }
        } else { // Round is over, transition to break or finish
            endRoundBell.play(); // Triple bells for round end
            if (currentRound < totalRounds) {
                timeLeft = breakDuration;
                isBreak = true;
                statusDisplay.textContent = "Break";
                timer = setInterval(countdown, 1000); // No bell for break start (transition from 3 bells)
            } else { // All rounds finished
                updateDisplay("Finished!", totalRounds, 0);
                isRunning = false;
                startButton.textContent = "Start";
            }
        }
    }
    updateDisplay(statusDisplay.textContent, currentRound, timeLeft);
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

roundDurationSelect.addEventListener('change', initializeTimer);
breakDurationSelect.addEventListener('change', initializeTimer);
numRoundsSelect.addEventListener('change', initializeTimer);
warningBellCheckbox.addEventListener('change', initializeTimer);

initialDelaySelect.addEventListener('change', initializeTimer);

initializeTimer(); // Initial setup
```

### PWA Configuration (`manifest.json`)

```json
{
    "name": "Boxing Timer",
    "short_name": "BoxTimer",
    "description": "A simple boxing timer for heavy bag sessions.",
    "start_url": "./index.html",
    "display": "standalone",
    "background_color": "#282c34",
    "theme_color": "#61dafb",
    "icons": [
        {
            "src": "icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

### Service Worker (`service-worker.js`)

```javascript
const CACHE_NAME = 'boxing-timer-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // Add paths to your audio files here
    // '/path/to/single-bell.mp3',
    // '/path/to/triple-bells.mp3',
    // '/path/to/warning-bell.mp3'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
```

## To-Dos:

- [ ] Create `index.html` with the provided structure.
- [ ] Create `style.css` with the provided styling.
- [ ] Create `script.js` with the timer logic.
- [ ] Create `manifest.json` for PWA capabilities.
- [ ] Create `service-worker.js` for offline support.
- [ ] Create `icons` directory and add `icon-192x192.png` and `icon-512x512.png` for the PWA.
- [ ] Obtain (or create simple) audio files for single bells (round start), triple bells (round end), and the warning bell, and update their paths in `script.js` and `service-worker.js`.
- [ ] Deploy the application to GitHub Pages.
- [ ] Update `index.html`, `script.js` to include the 'initial delay' option.

I'm ready to proceed with creating these files. Let me know if you'd like any adjustments to the plan!