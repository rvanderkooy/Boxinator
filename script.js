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

// Audio setup (placeholders)
const startRoundBell = new Audio('assets/boxing-bell-single.mp3');
const endRoundBell = new Audio('assets/boxing-bell-triple.mp3');
const warningBell = new Audio('assets/boxing-warning-double.mp3');

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
                updateDisplay("Finished! ", totalRounds, 0);
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

// Event Listeners
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
