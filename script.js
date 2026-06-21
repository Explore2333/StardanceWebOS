const windowElement = document.getElementById("window");
const appIcons = document.querySelectorAll(".appicon");
const quickAppButtons = document.querySelectorAll(".quick-app-button");
const closeButton = document.getElementById("closeButton");
const openButton = document.getElementById("openButton");
const windowOpenButton = document.getElementById("windowOpenButton");
const topClock = document.getElementById("topClock");
const mainClock = document.getElementById("mainClock");
const mainDate = document.getElementById("mainDate");
const libraryList = document.getElementById("libraryList");
const newSongForm = document.getElementById("newSongForm");
const newSongTitle = document.getElementById("newSongTitle");
const newSongArtist = document.getElementById("newSongArtist");
const playlistList = document.getElementById("playlistList");
const newPlaylistForm = document.getElementById("newPlaylistForm");
const newPlaylistName = document.getElementById("newPlaylistName");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const currentTimeLabel = document.getElementById("currentTime");
const durationTimeLabel = document.getElementById("durationTime");
const progressSlider = document.getElementById("progressSlider");
const playPauseButton = document.getElementById("playPauseButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const volumeSlider = document.getElementById("volumeSlider");
const backgroundOpacity = document.getElementById("backgroundOpacity");

const songs = [
  { title: "Blinding Lights", artist: "The Weeknd", duration: 242 },
  { title: "Midnight City", artist: "M83", duration: 240 },
  { title: "Get Lucky", artist: "Daft Punk", duration: 248 },
  { title: "Electric Feel", artist: "MGMT", duration: 230 },
  { title: "Levitating", artist: "Dua Lipa", duration: 203 },
  { title: "Titanium", artist: "David Guetta ft. Sia", duration: 245 },
  { title: "Sunflower", artist: "Post Malone & Swae Lee", duration: 158 },
  { title: "Heroes", artist: "David Bowie", duration: 364 },
];

const playlists = [
  "Morning Vibes",
  "Studio Flow",
  "Late Night",
  "Workout Beats",
  "Chill Retro",
];
let activeTrackIndex = 0;
let isPlaying = false;
let currentPlayback = 0;
let playbackInterval = null;

if (windowElement) {
  dragElement(windowElement);
}

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
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
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
  topClock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  mainClock.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  mainDate.textContent = now.toLocaleDateString([], options);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function renderLibrary() {
  if (!libraryList) return;
  libraryList.innerHTML = "";
  songs.forEach((track) => {
    const item = document.createElement("li");
    item.textContent = `${track.title} - ${track.artist}`;
    libraryList.appendChild(item);
  });
}

function renderPlaylists() {
  if (!playlistList) return;
  playlistList.innerHTML = "";
  playlists.forEach((name) => {
    const item = document.createElement("li");
    item.textContent = name;
    playlistList.appendChild(item);
  });
}

function refreshNowPlaying() {
  const activeSong = songs[activeTrackIndex];
  if (!activeSong) return;
  if (songTitle) songTitle.textContent = activeSong.title;
  if (songArtist) songArtist.textContent = activeSong.artist;
  if (nowPlayingTitle) nowPlayingTitle.textContent = `${activeSong.title} - ${activeSong.artist}`;
  if (durationTimeLabel) durationTimeLabel.textContent = formatTime(activeSong.duration);
  if (currentTimeLabel) currentTimeLabel.textContent = formatTime(currentPlayback);
  if (progressSlider) progressSlider.value = activeSong.duration ? (currentPlayback / activeSong.duration) * 100 : 0;
  if (playPauseButton) playPauseButton.textContent = isPlaying ? "Pause" : "Play";
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

function setActiveScreen(screenId) {
  const allScreens = document.querySelectorAll(".app-screen");
  allScreens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });
  quickAppButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screenId);
  });
}

function handleTrackSelect(index) {
  activeTrackIndex = index;
  currentPlayback = 0;
  refreshNowPlaying();
}

function playTrack() {
  if (isPlaying) return;
  isPlaying = true;
  refreshNowPlaying();
  playbackInterval = setInterval(() => {
    const activeSong = songs[activeTrackIndex];
    currentPlayback = Math.min(currentPlayback + 1, activeSong.duration);
    refreshNowPlaying();
    if (currentPlayback >= activeSong.duration) {
      nextTrack();
    }
  }, 1000);
}

function pauseTrack() {
  isPlaying = false;
  if (playbackInterval) {
    clearInterval(playbackInterval);
    playbackInterval = null;
  }
  refreshNowPlaying();
}

function togglePlayPause() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function previousTrack() {
  activeTrackIndex = (activeTrackIndex - 1 + songs.length) % songs.length;
  currentPlayback = 0;
  refreshNowPlaying();
}

function nextTrack() {
  activeTrackIndex = (activeTrackIndex + 1) % songs.length;
  currentPlayback = 0;
  refreshNowPlaying();
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

if (newSongForm) {
  newSongForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!newSongTitle || !newSongArtist) return;
    const title = newSongTitle.value.trim();
    const artist = newSongArtist.value.trim();
    if (!title || !artist) return;
    songs.push({ title, artist, duration: 200 });
    newSongTitle.value = "";
    newSongArtist.value = "";
    renderLibrary();
  });
}

if (newPlaylistForm) {
  newPlaylistForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!newPlaylistName) return;
    const value = newPlaylistName.value.trim();
    if (!value) return;
    playlists.push(value);
    newPlaylistName.value = "";
    renderPlaylists();
  });
}

if (progressSlider) {
  progressSlider.addEventListener("input", () => {
    const activeSong = songs[activeTrackIndex];
    currentPlayback = Math.round((progressSlider.value / 100) * activeSong.duration);
    refreshNowPlaying();
  });
}

if (volumeSlider) {
  volumeSlider.addEventListener("input", () => {
    // placeholder: volume control visual only
    volumeSlider.style.filter = `brightness(${0.75 + parseFloat(volumeSlider.value) * 0.25})`;
  });
}

if (backgroundOpacity) {
  backgroundOpacity.addEventListener("input", () => {
    document.documentElement.style.setProperty("--window-opacity", backgroundOpacity.value);
  });
}

if (playPauseButton) {
  playPauseButton.addEventListener("click", togglePlayPause);
}

if (prevButton) {
  prevButton.addEventListener("click", previousTrack);
}

if (nextButton) {
  nextButton.addEventListener("click", nextTrack);
}

updateClock();
setInterval(updateClock, 1000);
renderLibrary();
renderPlaylists();
refreshNowPlaying();
setActiveScreen("homeScreen");
