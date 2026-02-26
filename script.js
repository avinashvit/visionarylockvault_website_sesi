// Configuration for the Teams and their specific puzzles/keys
const teamsConfig = {
    1: {
        name: "Team 1",
        logical: "The Book: A book costs $20 plus half its own price. How much does the book cost? solve the derive answer in this equation to get the first pin.(3x^2−4x)/5x​−(x/8)​=4.", // Echo -> 4
        visual: "Which Way Leads To the center", // Placeholder -> 7
        visualImage: "1phy.jpeg", // Add your team 1 image to the folder and verify name
        physical: "Kill and laugh 5 times", // Placeholder -> 2
        key: "442"
    },
    2: {
        name: "Team 2",
        logical: "A lily pad doubles in size every day. If it takes 48 days to cover the entire lake, how many days does it take to cover half the lake? use the last digit as the first pin.", // Darkness -> 8
        visual: "Find the answer and only use the last digit from the answer?", // Placeholder -> 5
        visualImage: "2phy.jpeg", // Add your team 2 image to the folder and verify name
        physical: "Say A movie Dialogue", // Placeholder -> 3
        key: "741"
    },
    3: {
        name: "Team 3",
        logical: "A snail is at the bottom of a 20-foot well. Each day he climbs up 3 feet, but each night he slips back 2 feet. How many days will it take him to reach the top?solve this equation to get the first digit x^2−13x+36/(x-2)-(x/6)", // Keyboard -> K(11) -> 2
        visual: "Find the Odd One Out", // Placeholder -> 9
        visualImage: "3phy.jpeg", // Add your team 3 image to the folder and verify name
        physical: "Slow Motion Walk Race", // Placeholder -> 1
        key: "549"
    },
    4: {
        name: "Team 4",
        logical: "What runs around the whole yard without moving? (Count the syllables)", // Fence -> 1
        visual: "Find the Number Of Triangles and use the first digit", // Placeholder -> 6
        visualImage: "4phy.jpeg", // Add your team 4 image to the folder and verify name
        physical: "Stare Your Teammates For 1min", // Placeholder -> 4
        key: "144"
    },
    5: {
        name: "Team 5",
        logical: "I am always hungry, I must always be fed. The finger I touch, will soon turn red. What am I? (Count the letters in the answer for Digit 1)", // Fire -> 4
        visual: "Which Bottle Fills First", // Placeholder -> 2
        visualImage: "5phy.jpeg", // Add your team 5 image to the folder and verify name
        physical: "Invisible Chair + Arm Raise", // Placeholder -> 8
        key: "438"
    },
    6: {
        name: "Team 6",
        logical: "Forward I am heavy, backward I am not. What am I? (Count the vowels in the answer)", // Ton -> 1
        visual: "Which Key Fits In?", // Placeholder -> 7
        visualImage: "6phy.jpeg", // Add your team 6 image to the folder and verify name
        physical: "Dance A Hook Step", // Placeholder -> 5
        key: "145"
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
