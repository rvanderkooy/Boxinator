// Initial values and DOM elements
const timeDisplay = document.getElementById('time');
const statusDisplay = document.getElementById('status');
const roundDisplay = document.getElementById('round');

const unlockSoundsButton = document.getElementById("unlockSoundsButton");
const wakeLockButton = document.getElementById("wakeLockButton"); // NEW

const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

const roundDurationSelect = document.getElementById('roundDuration');
const breakDurationSelect = document.getElementById('breakDuration');
const numRoundsSelect = document.getElementById('numRounds');
const warningBellCheckbox = document.getElementById('warningBell');
const initialDelaySelect = document.getElementById('initialDelay');
const skipBreakButton = document.getElementById('skipBreakButton');

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

// Audio setup
const startRoundBell = new Audio('assets/boxing-bell-single.mp3');
const endRoundBell = new Audio('assets/boxing-bell-triple.mp3');
const warningBell = new Audio('assets/boxing-warning-double.mp3');

// =======================
// Wake Lock (Prevent Sleep)
// =======================
let wakeLockSentinel = null;
let wakeLockEnabled = false;

function updateWakeLockButtonUI() {
    if (!wakeLockButton) return;
    wakeLockButton.textContent = `Keep Screen Awake: ${wakeLockEnabled ? "On" : "Off"}`;
}

function wakeLockSupported() {
    return "wakeLock" in navigator && typeof navigator.wakeLock?.request === "function";
}

async function requestWakeLock() {
    if (!wakeLockSupported()) return false;

    try {
        wakeLockSentinel = await navigator.wakeLock.request("screen");
        wakeLockSentinel.addEventListener("release", () => {
            wakeLockSentinel = null;
        });
        return true;
    } catch (err) {
        wakeLockSentinel = null;
        return false;
    }
}

async function enableWakeLock() {
    wakeLockEnabled = true;

    // Only request when visible (iOS/Safari can be picky)
    if (document.visibilityState === "visible") {
        return await requestWakeLock();
    }
    return true;
}

async function disableWakeLock() {
    wakeLockEnabled = false;
    try {
        if (wakeLockSentinel) await wakeLockSentinel.release();
    } catch (_) { }
    wakeLockSentinel = null;
}

document.addEventListener("visibilitychange", async () => {
    // Re-request when coming back to the page
    if (wakeLockEnabled && document.visibilityState === "visible" && !wakeLockSentinel) {
        await requestWakeLock();
    }
});

// =======================
// Timer logic
// =======================
function initializeTimer() {
    roundDuration = parseInt(roundDurationSelect.value, 10);
    breakDuration = parseInt(breakDurationSelect.value, 10);
    totalRounds = parseInt(numRoundsSelect.value, 10);
    warningBellEnabled = warningBellCheckbox.checked;
    initialDelay = parseInt(initialDelaySelect.value, 10);

    currentRound = 0;
    isBreak = false;
    isRunning = false;

    clearInterval(timer);
    updateDisplay("Prepare", 0, roundDuration);
    startButton.textContent = "Start";

    // Optional: keep wake lock state, just refresh UI
    updateWakeLockButtonUI();
}

function updateDisplay(status, currentRoundNum, time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    timeDisplay.textContent =
        `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    statusDisplay.textContent = status;
    roundDisplay.textContent = `Round ${currentRoundNum} / ${totalRounds}`;
}

function unlockSounds() {
    // On iOS, audio needs user gesture. This helps.
    startRoundBell.play().catch(() => { });
    warningBell.play().catch(() => { });
    endRoundBell.play().catch(() => { });
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startButton.textContent = "Resume";

        // If user enabled wake lock, request it here (user gesture)
        if (wakeLockEnabled && !wakeLockSentinel) {
            requestWakeLock();
        }

        if (currentRound === 0) { // First start (initial delay)
            currentRound = 0;
            timeLeft = initialDelay;
            isBreak = true; // Use isBreak to signify initial delay phase
            statusDisplay.textContent = "Prepare (Delay)";
        }

        timer = setInterval(countdown, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
    startButton.textContent = "Resume";

    // NOTE: I am NOT disabling wake lock on pause,
    // because people often pause mid-round and still want screen awake.
    // If you want pause to allow sleep, uncomment the next 2 lines:
    // if (wakeLockEnabled) disableWakeLock();
    // updateWakeLockButtonUI();
}

function resetTimer() {
    initializeTimer();

    // Optional: disable wake lock on reset (common expectation)
    // If you want wake lock to stay on after reset, remove these:
    if (wakeLockEnabled) {
        disableWakeLock();
        updateWakeLockButtonUI();
    }
}

function skipBreak() {
    console.log("Skip Break button clicked");
    if (isRunning && isBreak) {
        clearInterval(timer);
        timeLeft = initialDelay;
        isBreak = true;
        statusDisplay.textContent = "Prepare (Delay)";
        timer = setInterval(countdown, 1000);
        updateDisplay(statusDisplay.textContent, currentRound, timeLeft); // Update display immediately
    }
}

function countdown() {
    timeLeft--;

    if (warningBellEnabled && !isBreak && timeLeft === 10) {
        warningBell.play().catch(() => { });
    }

    if (timeLeft <= 0) {
        clearInterval(timer);

        if (isBreak) { // Transitioning from initial delay or break to a round
            if (currentRound === 0) { // Initial delay is over, start first round
                currentRound = 1;
                timeLeft = roundDuration;
                isBreak = false;

                startRoundBell.play().catch(() => { });
                statusDisplay.textContent = "Round";

                timer = setInterval(countdown, 1000);
            } else { // Break is over, start next round
                currentRound++;

                if (currentRound <= totalRounds) {
                    timeLeft = roundDuration;
                    isBreak = false;

                    startRoundBell.play().catch(() => { });
                    statusDisplay.textContent = "Round";

                    timer = setInterval(countdown, 1000);
                } else {
                    endRoundBell.play().catch(() => { });
                    updateDisplay("Finished!", totalRounds, 0);
                    isRunning = false;
                    startButton.textContent = "Start";
                }
            }
        } else { // Round is over, transition to break or finish
            endRoundBell.play().catch(() => { });

            if (currentRound < totalRounds) {
                timeLeft = breakDuration;
                isBreak = true;
                statusDisplay.textContent = "Break";
                timer = setInterval(countdown, 1000);
            } else {
                updateDisplay("Finished!", totalRounds, 0);
                isRunning = false;
                startButton.textContent = "Start";
            }
        }
    }

    updateDisplay(statusDisplay.textContent, currentRound, timeLeft);

    if (isBreak && isRunning && currentRound > 0) {
        skipBreakButton.style.display = 'block';
    } else {
        skipBreakButton.style.display = 'none';
    }
}

// =======================
// Event Listeners
// =======================
unlockSoundsButton.addEventListener('click', unlockSounds);

wakeLockButton.addEventListener('click', async () => {
    if (!wakeLockEnabled) {
        if (!wakeLockSupported()) {
            alert("Keep Screen Awake isn’t supported in this browser/iOS version. Try updating iOS/Safari or using Add to Home Screen.");
            return;
        }

        const ok = await enableWakeLock();
        updateWakeLockButtonUI();

        if (!ok) {
            alert("Couldn’t enable Keep Screen Awake. Try again and keep the page in the foreground.");
        }
    } else {
        await disableWakeLock();
        updateWakeLockButtonUI();
    }
});

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
skipBreakButton.addEventListener('click', skipBreak);

roundDurationSelect.addEventListener('change', initializeTimer);
breakDurationSelect.addEventListener('change', initializeTimer);
numRoundsSelect.addEventListener('change', initializeTimer);
warningBellCheckbox.addEventListener('change', initializeTimer);
initialDelaySelect.addEventListener('change', initializeTimer);

initializeTimer(); // Initial setup
updateWakeLockButtonUI();
