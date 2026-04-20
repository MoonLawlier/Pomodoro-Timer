const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const statusText = document.getElementById('status-text');

// Timer configurations in minutes
const MODES = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
};

let currentMode = 'pomodoro';
let timeLeft = MODES[currentMode] * 60;
let timerId = null;

// Messages
const MESSAGES = {
    pomodoro: "Time to focus!",
    shortBreak: "Take a short break!",
    longBreak: "Time for a longer break!"
};

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
        mins: mins.toString().padStart(2, '0'),
        secs: secs.toString().padStart(2, '0')
    };
}

function updateDisplay() {
    const time = formatTime(timeLeft);
    minutesDisplay.textContent = time.mins;
    secondsDisplay.textContent = time.secs;
    
    // Update document title
    const modeName = currentMode === 'pomodoro' ? 'Focus' : 'Break';
    document.title = `${time.mins}:${time.secs} - ${modeName}`;
}

function startTimer() {
    if (timerId !== null) return;
    
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            
            // Revert buttons
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            
            // Play notification sound if desired
            // new Audio('notification.mp3').play();
            alert(`${MESSAGES[currentMode]}\nTime is up!`);
            
            // Optionally auto-switch mode or just wait
        }
    }, 1000);
}

function pauseTimer() {
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
    
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    pauseTimer();
    timeLeft = MODES[currentMode] * 60;
    updateDisplay();
}

function switchMode(e) {
    const mode = e.target.dataset.mode;
    if (mode === currentMode) return;
    
    // Update UI active state
    modeBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Change logic state
    currentMode = mode;
    statusText.textContent = MESSAGES[currentMode];
    resetTimer(); // Also pauses timer and sets precise time
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
    btn.addEventListener('click', switchMode);
});

// Initialize Display
updateDisplay();

// Background Audio Toggling Logic
const bgAudio = document.getElementById('bg-audio');
const audioToggleBtn = document.getElementById('audio-toggle-btn');

// Lower the volume a bit so it's not too loud
bgAudio.volume = 0.4;

audioToggleBtn.addEventListener('click', () => {
    if (bgAudio.paused) {
        bgAudio.play();
    } else {
        bgAudio.pause();
    }
});

// Update icon based on audio state (especially helpful for autoplay policies)
bgAudio.addEventListener('play', () => {
    audioToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
});

bgAudio.addEventListener('pause', () => {
    audioToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
});

// For autoplay policy: if autoplay fails, start muted or show paused icon
document.addEventListener('DOMContentLoaded', () => {
    if (bgAudio.paused) {
        audioToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});
