// Configuration for the Teams and their specific puzzles/keys
const teamsConfig = {
    1: {
        name: "Team 1",
        logical: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? (Count the letters in the answer for Digit 1)", // Echo -> 4
        visual: "Look closely at the provided map artifact. Count the number of red X marks indicating false paths.", // Placeholder -> 7
        visualImage: "1.jpeg", // Add your team 1 image to the folder and verify name
        physical: "Examine the underside of the main game table. Find the hidden sticker and read its number.", // Placeholder -> 2
        key: "472"
    },
    2: {
        name: "Team 2",
        logical: "The more of this there is, the less you see. What is it? (Count the letters in the answer for Digit 1)", // Darkness -> 8
        visual: "Find the hidden symbol in the constellation painting. How many points does the star have?", // Placeholder -> 5
        visualImage: "team2_visual.jpg", // Add your team 2 image to the folder and verify name
        physical: "Unlock the wooden box using the brass key. Inside, a number is etched on the bottom.", // Placeholder -> 3
        key: "853"
    },
    3: {
        name: "Team 3",
        logical: "I have keys but no locks. I have space but no room. You can enter but not go outside. What am I? (First letter's alphabetical position module 9)", // Keyboard -> K(11) -> 2
        visual: "Align the transparent overlays on the window. A digit will formed by the intersection of lines.", // Placeholder -> 9
        visualImage: "team3_visual.jpg", // Add your team 3 image to the folder and verify name
        physical: "Weigh the three metal gears. The heaviest gear has a number stamped on its side.", // Placeholder -> 1
        key: "291"
    },
    4: {
        name: "Team 4",
        logical: "What runs around the whole yard without moving? (Count the syllables)", // Fence -> 1
        visual: "Check the UV markings on the blank poster. A single digit is illuminated.", // Placeholder -> 6
        visualImage: "team4_visual.jpg", // Add your team 4 image to the folder and verify name
        physical: "Assemble the fragmented tile puzzle. The completed image reveals a hidden number.", // Placeholder -> 4
        key: "164"
    },
    5: {
        name: "Team 5",
        logical: "I am always hungry, I must always be fed. The finger I touch, will soon turn red. What am I? (Count the letters in the answer for Digit 1)", // Fire -> 4
        visual: "Shine the flashlight through the prism. How many distinct red bars appear on the wall?", // Placeholder -> 2
        visualImage: "team5_visual.jpg", // Add your team 5 image to the folder and verify name
        physical: "Pour the sand into the scale until it balances perfectly. The weight in grams starts with this number.", // Placeholder -> 8
        key: "428"
    },
    6: {
        name: "Team 6",
        logical: "Forward I am heavy, backward I am not. What am I? (Count the vowels in the answer)", // Ton -> 1
        visual: "Observe the pendulum's shadow on the marked floor at exactly 3:00 PM. Which number does it point to?", // Placeholder -> 7
        visualImage: "team6_visual.jpg", // Add your team 6 image to the folder and verify name
        physical: "Unscrew the bottom panel of the wooden chair. A marked digit is stamped inside.", // Placeholder -> 5
        key: "175"
    }
};

// Global State
let timerInterval = null;
let startTime = 0;
let currentEnteredPin = "";
let timerRunning = false;

// DOM Elements
const timerDisplay = document.getElementById('global-timer');
const finalTimerDisplay = document.getElementById('final-timer-display');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

// Team Selection Elements
const teamSelectionOverlay = document.getElementById('team-selection-overlay');
const mainApp = document.getElementById('main-app');
const selectTeamBtns = document.querySelectorAll('.select-team-btn');

// Team Section Elements
const teamTitle = document.getElementById('team-title');
const puzzleLogical = document.getElementById('puzzle-logical');
const puzzleVisual = document.getElementById('puzzle-visual');
const puzzleVisualImage = document.getElementById('puzzle-visual-image');
const puzzlePhysical = document.getElementById('puzzle-physical');

// Vault Elements
const pinBoxes = [
    document.getElementById('pin-1'),
    document.getElementById('pin-2'),
    document.getElementById('pin-3')
];
const keyBtns = document.querySelectorAll('.key-btn[data-val]');
const btnClear = document.getElementById('btn-clear');
const btnEnter = document.getElementById('btn-enter');
const errorMessage = document.getElementById('error-message');
const vaultDoor = document.getElementById('vault-door');
const vaultStatusText = document.getElementById('vault-status-text');

// Success Overlay Elements
const successOverlay = document.getElementById('success-overlay');
const winningTeamText = document.getElementById('winning-team-text');
const btnReset = document.getElementById('btn-reset');

// --- Timer Logic ---
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimer() {
    const now = Date.now();
    const elapsed = now - startTime;
    timerDisplay.textContent = formatTime(elapsed);
}

function startTimer() {
    if (timerRunning) return;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    timerRunning = true;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    return timerDisplay.textContent;
}

// --- Navigation Logic ---
function switchSection(targetId, teamId = null) {
    // Update active nav button
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Find matching button
    const activeBtn = Array.from(navButtons).find(btn => {
        if (teamId) return btn.getAttribute('data-team') == teamId;
        return btn.getAttribute('data-target') === targetId;
    });
    if (activeBtn) activeBtn.classList.add('active');

    // Update active section
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');

    // If it's a team section, populate content
    if (targetId === 'team-section' && teamId) {
        loadTeamContent(teamId);
    }
}

function loadTeamContent(teamId) {
    const team = teamsConfig[teamId];
    if (!team) return;

    teamTitle.textContent = `${team.name} Protocol`;
    puzzleLogical.textContent = team.logical;
    puzzleVisual.textContent = team.visual;
    puzzlePhysical.textContent = team.physical;

    // Handle Visual Image
    if (team.visualImage) {
        puzzleVisualImage.src = team.visualImage;
        puzzleVisualImage.classList.remove('hidden');
    } else {
        puzzleVisualImage.classList.add('hidden');
        puzzleVisualImage.src = "";
    }
}

// Event Listeners for Navigation
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        const team = btn.getAttribute('data-team');
        switchSection(target, team);
    });
});

// --- Vault Logic ---
function updatePinDisplay() {
    for (let i = 0; i < 3; i++) {
        pinBoxes[i].textContent = currentEnteredPin[i] || "";
        pinBoxes[i].classList.remove('active', 'error', 'success');

        // Highlight the current box to type in
        if (i === currentEnteredPin.length) {
            pinBoxes[i].classList.add('active');
        }
    }
    errorMessage.textContent = "";
}

function handleKeyPress(val) {
    if (currentEnteredPin.length < 3) {
        currentEnteredPin += val;
        updatePinDisplay();
    }
}

function handleClear() {
    currentEnteredPin = "";
    updatePinDisplay();
    pinBoxes.forEach(box => box.classList.remove('error'));
}

function triggerError() {
    pinBoxes.forEach(box => box.classList.add('error'));
    errorMessage.textContent = "ACCESS DENIED. INCORRECT KEY.";
    setTimeout(() => {
        handleClear();
    }, 1000);
}

function triggerSuccess(winningTeamName) {
    pinBoxes.forEach(box => box.classList.add('success'));
    errorMessage.style.color = "var(--success)";
    errorMessage.textContent = "ACCESS GRANTED.";

    // Handle vault animation
    vaultDoor.classList.add('unlocking');

    setTimeout(() => {
        vaultDoor.classList.remove('unlocking');
        vaultDoor.classList.add('open');
        vaultStatusText.textContent = "UNLOCKED";

        // Stop timer
        const finalTime = stopTimer();

        // Show overlay after a short delay for dramatic effect
        setTimeout(() => {
            winningTeamText.textContent = `${winningTeamName} successfully breached the vault!`;
            finalTimerDisplay.textContent = finalTime;
            successOverlay.classList.remove('hidden');
            // Slight delay to trigger opacity transition
            setTimeout(() => {
                successOverlay.classList.add('show');
            }, 50);
        }, 1500);

    }, 1000); // Wait for wheel spin animation
}

function handleEnter() {
    if (currentEnteredPin.length !== 3) {
        errorMessage.textContent = "PLEASE ENTER 3 DIGITS.";
        return;
    }

    // Check if the pin matches ANY team's key
    let matchedTeam = null;
    for (const [id, team] of Object.entries(teamsConfig)) {
        if (team.key === currentEnteredPin) {
            matchedTeam = team;
            break;
        }
    }

    if (matchedTeam) {
        triggerSuccess(matchedTeam.name);
    } else {
        triggerError();
    }
}

// Event Listeners for Keypad
keyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        handleKeyPress(btn.getAttribute('data-val'));
    });
});

btnClear.addEventListener('click', handleClear);
btnEnter.addEventListener('click', handleEnter);

// Handle Keyboard input
document.addEventListener('keydown', (e) => {
    // Only process if vault section is active
    if (!document.getElementById('vault-section').classList.contains('active')) return;

    // Don't process if overlay is shown
    if (!successOverlay.classList.contains('hidden')) return;

    if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        currentEnteredPin = currentEnteredPin.slice(0, -1);
        updatePinDisplay();
    } else if (e.key === 'Enter') {
        handleEnter();
    }
});

// --- Reset Logic ---
btnReset.addEventListener('click', () => {
    // Hide overlay
    successOverlay.classList.remove('show');
    setTimeout(() => {
        successOverlay.classList.add('hidden');

        // Reset Vault Door
        vaultDoor.classList.remove('open');
        vaultStatusText.textContent = "SECURE";
        vaultStatusText.style.color = "var(--danger)";

        // Reset UI States
        handleClear();
        errorMessage.style.color = "var(--danger)";

        // Reset Timer
        stopTimer();
        timerDisplay.textContent = "00:00:00";

        // Go back to Team Selection
        teamSelectionOverlay.classList.remove('hidden');
        mainApp.classList.add('hidden');
        navButtons.forEach(btn => btn.classList.remove('active'));
    }, 1000);
});

// --- Team Selection Logic ---
selectTeamBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const teamId = btn.getAttribute('data-team');

        // Hide overlay, show main app
        teamSelectionOverlay.classList.add('hidden');
        mainApp.classList.remove('hidden');

        // Setup navigation to ONLY show the selected team and Vault
        navButtons.forEach(navBtn => {
            if (navBtn.classList.contains('vault-btn') || navBtn.getAttribute('data-team') == teamId) {
                navBtn.style.display = ''; // Restore default
            } else {
                navBtn.style.display = 'none'; // Hide
            }
        });

        // Initialize state for the selected team
        switchSection('team-section', teamId);
        updatePinDisplay();

        // Start timer when team is selected
        startTimer();
    });
});

// --- Initialization ---
function init() {
    // Show team selection overlay by default, hide main app
    teamSelectionOverlay.classList.remove('hidden');
    mainApp.classList.add('hidden');
}

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
