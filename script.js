const windowElement = document.getElementById("window");
const appIcons = document.querySelectorAll(".appicon");
const quickAppButtons = document.querySelectorAll(".quick-app-button");
const closeButton = document.getElementById("closeButton");
const openButton = document.getElementById("openButton");
const windowOpenButton = document.getElementById("windowOpenButton");
const topClock = document.getElementById("topClock");
const mainClock = document.getElementById("mainClock");
const mainDate = document.getElementById("mainDate");
const backgroundOpacity = document.getElementById("backgroundOpacity");

let startGameButton;
let quizScreen;
let roundDisplay;
let scoreDisplay;
let pairCard;
let yesButton;
let noButton;
let endScreen;
let finalScoreText;
let replayButton;
let gameDomInitialized = false;

function initGameDom() {
    if (gameDomInitialized) return;
    gameDomInitialized = true;
    // No Popular Songs UI by default; legacy game wiring follows.

    // Backwards-compatible: wire old game elements if they exist
    startGameButton = document.getElementById("startGameButton");
    quizScreen = document.getElementById("quizScreen");
    roundDisplay = document.getElementById("roundDisplay");
    scoreDisplay = document.getElementById("scoreDisplay");
    pairCard = document.getElementById("pairCard");
    yesButton = document.getElementById("yesButton");
    noButton = document.getElementById("noButton");
    endScreen = document.getElementById("endScreen");
    finalScoreText = document.getElementById("finalScoreText");
    replayButton = document.getElementById("replayButton");

    if (startGameButton) startGameButton.addEventListener("click", startGame);
    if (yesButton) yesButton.addEventListener("click", () => handleAnswer(true));
    if (noButton) noButton.addEventListener("click", () => handleAnswer(false));
    if (replayButton) replayButton.addEventListener("click", startGame);

    if (quizScreen) quizScreen.classList.add("hidden");
    if (endScreen) endScreen.classList.add("hidden");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGameDom);
} else {
    initGameDom();
}
window.addEventListener("load", initGameDom);

const songPairs = [
    { song: "Blinding Lights", genre: "Synthpop" },
    { song: "Bohemian Rhapsody", genre: "Rock" },
    { song: "Lose Yourself", genre: "Hip-Hop" },
    { song: "One More Time", genre: "Electronic" },
    { song: "Clair de Lune", genre: "Classical" },
    { song: "Bad Guy", genre: "Pop" },
    { song: "Take Five", genre: "Jazz" },
    { song: "Smells Like Teen Spirit", genre: "Grunge" },
    { song: "Shape of You", genre: "Pop" },
    { song: "Billie Jean", genre: "Pop" }
];

let currentRoundIndex = 0;
let score = 0;
let rounds = [];
let currentPair = null;
let inputEnabled = false;

// Popular songs feature removed; functions cleaned up.

if (windowElement) dragElement(windowElement);

function dragElement(element) {
    let initialX = 0;
    let initialY = 0;
    const header = document.getElementById(element.id + "header");
    if (header) {
        header.onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }
    function startDragging(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e.preventDefault();
        const dx = e.clientX - initialX;
        const dy = e.clientY - initialY;
        initialX = e.clientX;
        initialY = e.clientY;
        element.style.top = `${element.offsetTop + dy}px`;
        element.style.left = `${element.offsetLeft + dx}px`;
    }
    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function updateClock() {
    const now = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    if (topClock) topClock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (mainClock) mainClock.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (mainDate) mainDate.textContent = now.toLocaleDateString([], options);
}

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function createRounds() {
    const shuffled = shuffle([...songPairs]);
    rounds = shuffled.slice(0, 3).map((pair) => {
        const shouldMatch = Math.random() > 0.5;
        if (shouldMatch) {
            return {
                song: pair.song,
                genre: pair.genre,
                correct: true
            };
        }

        const wrongGenre = songPairs
            .filter((item) => item.genre !== pair.genre)
            .map((item) => item.genre);
        const randomGenre = wrongGenre[Math.floor(Math.random() * wrongGenre.length)];
        return {
            song: pair.song,
            genre: randomGenre,
            correct: false
        };
    });
}

function startGame() {
    score = 0;
    currentRoundIndex = 0;
    inputEnabled = true;
    createRounds();
    updateStatus();
    endScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    renderPair();
}

function updateStatus() {
    roundDisplay.textContent = `Set ${currentRoundIndex + 1}`;
    scoreDisplay.textContent = `Score: ${score}`;
}

function renderPair() {
    currentPair = rounds[currentRoundIndex];
    pairCard.innerHTML = `
    <div class="pair-entry">
      <p class="pair-label">Song</p>
      <div class="pair-text">${currentPair.song}</div>
    </div>
    <div class="pair-entry">
      <p class="pair-label">Genre</p>
      <div class="pair-text">${currentPair.genre}</div>
    </div>
  `;
    quizScreen.classList.remove("hidden");
    endScreen.classList.add("hidden");
    inputEnabled = true;
}

function handleAnswer(answerYes) {
    if (!inputEnabled) return;
    inputEnabled = false;

    const isCorrect = answerYes === currentPair.correct;
    if (isCorrect) {
        score += 1;
    }

    scoreDisplay.textContent = `Score: ${score}`;

    if (currentRoundIndex >= rounds.length - 1) {
        showEndScreen();
        return;
    }

    currentRoundIndex += 1;
    updateStatus();
    renderPair();
}

function showEndScreen() {
    quizScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
    finalScoreText.textContent = `You scored ${score} / ${rounds.length} Correct`;
}

function setActiveScreen(screenId) {
    const allScreens = document.querySelectorAll(".app-screen");
    allScreens.forEach((screen) => {
        screen.classList.toggle("active", screen.id === screenId);
    });
    quickAppButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.screen === screenId);
    });
}

if (closeButton) {
    closeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        closeWindow();
    });
}

if (openButton) {
    openButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openWindow();
    });
}

if (windowOpenButton) {
    windowOpenButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openWindow();
    });
}

appIcons.forEach((icon) => {
    icon.addEventListener("click", (event) => {
        event.stopPropagation();
        const targetScreen = icon.dataset.screen;
        if (targetScreen) {
            setActiveScreen(targetScreen);
        }
        openWindow();
    });
});

quickAppButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const screenId = button.dataset.screen;
        if (screenId) {
            setActiveScreen(screenId);
        }
    });
});

if (backgroundOpacity) {
    backgroundOpacity.addEventListener("input", () => {
        document.documentElement.style.setProperty("--window-opacity", backgroundOpacity.value);
    });
}


function openWindow() {
    if (!windowElement) return;
    windowElement.style.display = "flex";
    windowElement.style.top = "50%";
    windowElement.style.left = "50%";
    windowElement.style.transform = "translate(-50%, -50%)";
}

function closeWindow() {
    if (!windowElement) return;
    windowElement.style.display = "none";
}

updateClock();
setInterval(updateClock, 1000);
setActiveScreen("homeScreen");
