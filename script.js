// === TIMER STATE ===
let timer;
let timeLeft = 1500;
let mode = "focus";
let isRunning = false;

const modes = {
  focus: 1500,
  short: 300,
  long: 900,
};




// === DOM ELEMENTS ===
const display = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const modeButtons = document.querySelectorAll(".mode-button");
const musicBtn = document.getElementById("music-btn");
const ambientBtn = document.getElementById("ambient-btn");
const toggleTimerBtn = document.getElementById("toggle-timer");
const timerContainer = document.querySelector(".timer-container");
const modalContainer = document.getElementById("modal-container");

// ✅ Background DOM
const bgVideo = document.getElementById("bgvid");
const backgroundVideoWrapper = document.getElementById("background-video");
const dayNightBtn = document.getElementById("day-night-btn");
const backgroundBtn = document.getElementById("background-btn");

// ✅ Clock/Date DOM (new)
const timeContainer = document.querySelector(".time-container");
const dateDisplay = document.getElementById("date-display");
const timeDisplay = document.getElementById("time-display");

// 🌞🌙 Day/Night Toggle – switch backgrounds
const dayMode = document.getElementById("day-mode");
const nightMode = document.getElementById("night-mode");

dayMode.addEventListener("change", () => {
  if (dayMode.checked) {
    isDay = true;
    toggleDayNight();
  }
});

nightMode.addEventListener("change", () => {
  if (nightMode.checked) {
    isDay = false;
    toggleDayNight();
  }
});

// === FULLSCREEN ===
const fullscreenBtn = document.getElementById("fullscreen-btn");

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn("Fullscreen failed:", err);
    });
    fullscreenBtn.classList.add("active");
  } else {
    document.exitFullscreen();
    fullscreenBtn.classList.remove("active");
  }
});

// === MODE TOGGLE (Ambient / Home / Focus) ===
const ambientRadio = document.getElementById("ambient-mode");
const homeRadio = document.getElementById("home-mode");
const focusRadio = document.getElementById("focus-mode");

const timerDisplay = document.getElementById("timer-display");
const startButton = document.getElementById("start-btn");

let clockInterval;

function showClock() {
  function updateClock() {
    const now = new Date();

    // Date: e.g., Sunday, Sep 14
    const options = { weekday: "long", month: "short", day: "numeric" };
    dateDisplay.textContent = now.toLocaleDateString("en-US", options);

    // Time: 12-hour with AM/PM
    let hrs = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, "0");
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;
    timeDisplay.textContent = `${hrs}:${mins} ${ampm}`;
  }

  updateClock(); // run immediately
  clockInterval = setInterval(updateClock, 1000);
}

function stopClock() {
  clearInterval(clockInterval);
  clockInterval = null;
}

function setModeToggle() {
  // 🌌 AMBIENT MODE
  if (ambientRadio.checked) {
    timerContainer.classList.add("hidden"); 
    timeContainer.classList.add("hidden");  
    stopClock();
  }

  // 🏠 HOME MODE (Clock + Date)
  else if (homeRadio.checked) {
    timerContainer.classList.add("hidden");    
    timeContainer.classList.remove("hidden");  
    stopClock();
    showClock();
  }

  // 🎯 FOCUS MODE (Pomodoro)
  else if (focusRadio.checked) {
    timerContainer.classList.remove("hidden"); 
    timeContainer.classList.add("hidden");     
    stopClock();
    updateDisplay(); 
  }
}

// === Hook up events ===
[ambientRadio, homeRadio, focusRadio].forEach((radio) => {
  radio.addEventListener("change", setModeToggle);
});

// Default state = Home
homeRadio.checked = true;
setModeToggle();


// === AUDIO ===
let audio = new Audio();
let currentPlaylist = "cozylofi";
let currentTrack = 1;
let isPlaying = false;
const maxTracks = 10;
let autoShuffle = false; // ✅ Fix: defined so skipTrack() works
// 🎵 Available playlists (must match folder names + dropdown values in HTML)
const playlists = [
  "deepdive",
  "chillstep",
  "innerglow",
  "forestflute",
  "focusstate",
  "zengarden",
  "peacefulpiano",
  "summerlofi",
  "guitarvibes",
  "chillhop",
  "classical",
  "jazzhop",
  "rainydayjazz",
  "cozylofi",
  "deepwork",
  "synthwave",
  "darkacademia"
];

const ambientAudio = {};




// === AMBIENT SOUND LIST ===
const ambientSounds = [
  { file: "thunder.mp3", name: "Thunder", emoji: "🌩️" },
  { file: "ticking-clock.mp3", name: "Clock", emoji: "⏰" },
  { file: "calming-water.mp3", name: "Calm Water", emoji: "💧" },
  { file: "morning-birds.mp3", name: "Morning Birds", emoji: "🐦" },
  { file: "countryside-at-night.mp3", name: "Countryside", emoji: "🌌" },
  { file: "in-space.mp3", name: "In Space", emoji: "🚀" },
  { file: "city-street.mp3", name: "City Street", emoji: "🚗" },
  { file: "crickets.mp3", name: "Crickets", emoji: "🦗" },
  { file: "rainforest.mp3", name: "Rainforest", emoji: "🌳" },
  { file: "underwater.mp3", name: "Underwater", emoji: "🐠" },
  { file: "restaurant.mp3", name: "Restaurant", emoji: "🍽️" },
  { file: "city-park.mp3", name: "City Park", emoji: "🌆" },
  { file: "flowing-river.mp3", name: "Flowing River", emoji: "🏞️" },
  { file: "wetlands.mp3", name: "Wetlands", emoji: "🪷" },
  { file: "coffee-shop.mp3", name: "Coffee Shop", emoji: "☕" },
  { file: "flowing-stream.mp3", name: "Stream", emoji: "🌊" },
  { file: "ocean-waves.mp3", name: "Ocean Waves", emoji: "🌊" },
  { file: "bubbling-creek.mp3", name: "Creek", emoji: "🫧" },
  { file: "waterfall.mp3", name: "Waterfall", emoji: "🌁" },
  { file: "gentle-lake.mp3", name: "Gentle Lake", emoji: "🏞️" },
  { file: "driving.mp3", name: "Driving", emoji: "🚙" },
  { file: "light-rain.mp3", name: "Light Rain", emoji: "🌧️" },
  { file: "city-rain.mp3", name: "City Rain", emoji: "🌆" },
  { file: "fireplace.mp3", name: "Fireplace", emoji: "🔥" },
  { file: "campfire.mp3", name: "Campfire", emoji: "🏕️" },
  { file: "snow-storm.mp3", name: "Snowstorm", emoji: "❄️" },
  { file: "white-noise.mp3", name: "White Noise", emoji: "📢" },
  { file: "pink-noise.mp3", name: "Pink Noise", emoji: "🔊" },
  { file: "heartbeat.mp3", name: "Heartbeat", emoji: "❤️" },
  { file: "alpha-waves.mp3", name: "Alpha Waves", emoji: "🧠" },
  { file: "theta-waves.mp3", name: "Theta Waves", emoji: "🔮" },
  { file: "beta-waves.mp3", name: "Beta Waves", emoji: "💡" },
  { file: "delta-waves.mp3", name: "Delta Waves", emoji: "🌙" },
  { file: "purring-cat.mp3", name: "Purring Cat", emoji: "🐱" },
  { file: "rain-on-tent.mp3", name: "Rain on Tent", emoji: "⛺" },
  { file: "night-owl.mp3", name: "Night Owl", emoji: "🦉" },
  { file: "inside-a-cave.mp3", name: "Inside Cave", emoji: "🕳️" },
  { file: "local-pond.mp3", name: "Local Pond", emoji: "🪨" },
  { file: "morning-meadow.mp3", name: "Soft Meadow", emoji: "🌼" },
  { file: "summer-night.mp3", name: "Cozy Night", emoji: "🌠" },
  { file: "spaceship.mp3", name: "Spaceship", emoji: "🛸" }
];




// === BACKGROUNDS ===
let currentScene = null;
let isDay = true;

const backgrounds = {
  // 🌞 Day/Night folders (now with covers)
  seoul: { 
    type: "daynight", 
    day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/seoul/day.mp4", 
    night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/seoul/night.mp4", 
    cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/seoul/cover.png" 
  },
  citytrain: { 
    type: "daynight", 
    day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/citytrain/day.mp4", 
    night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/citytrain/night.mp4", 
    cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/citytrain/cover.png" 
  },
  countrysidetrain: { 
    type: "daynight", 
    day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/countrysidetrain/day.mp4", 
    night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/countrysidetrain/night.mp4", 
    cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/countrysidetrain/cover.png" 
  },
  lakesidecamping: { 
    type: "daynight", 
    day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/lakesidecamping/day.mp4", 
    night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/lakesidecamping/night.mp4", 
    cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/lakesidecamping/cover.png" 
  },

  treehouse: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/treehouse/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/treehouse/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/treehouse/cover.png" },
  beachvilla: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/beachvilla/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/beachvilla/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/beachvilla/cover.png" },
  plane: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/plane/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/plane/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/plane/cover.png" },
  centralpark: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/centralpark/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/centralpark/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/centralpark/cover.png" },
  lakehouse: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/lakehouse/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/lakehouse/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/lakehouse/cover.png" },
  kyotopark: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/kyotopark/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/kyotopark/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/kyotopark/cover.png" },
  studyinthewoods: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/studyinthewoods/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/studyinthewoods/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/studyinthewoods/cover.png" },
  inthewoods: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/inthewoods/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/inthewoods/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/inthewoods/cover.png" },
  fuji: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/fuji/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/fuji/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/fuji/cover.png" },
  floating: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/floating/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/floating/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/floating/cover.png" },
  bookcafe: { type: "daynight", day: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/bookcafe/day.mp4", night: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/bookcafe/night.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/bookcafe/cover.png" },

  // 🎥 Single video folders (with covers)
  library: { type: "single", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/library/library.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/library/cover.png" },
  beachstudy: { type: "single", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/beachstudy/beachstudy.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/beachstudy/cover.png" },
  snowystudy: { type: "single", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/snowystudy/snowystudy.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/snowystudy/cover.png" },
  tokyo: { type: "single", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/tokyo/tokyo.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/tokyo/cover.png" },
  ramenshop: { type: "single", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/ramenshop/ramenshop.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/ramenshop/cover.png" },
  winternight: { type: "single", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/winternight/winternight.mp4", cover: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/winternight/cover.png" },

  // 🖼️ Static backgrounds (images only, no covers needed)
  sunsetmountain: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/sunsetmountain.png" },
  galaxy: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/galaxy.png" },
  pinksunset: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/pinksunset.png" },
  ocean: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/ocean.png" },
  beigepastel: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/beigepastel.png" },
  pinkpastel: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/pinkpastel.png" },
  nightpalm: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/nightpalm.png" },
  leaves: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/leaves.png" },
  pastelmountain: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/pastelmountain.jpg" },
  warmlandscape: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/warmlandscape.png" },
  deepgradient: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/deepgradient.png" },
  purplegradient: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/purplegradient.png" },
  burntmountains: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/burntmountains.png" },
  chillyskies: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/chillyskies.png" },
  mistytreetops: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/mistytreetops.png" },
  rainbowsunset: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/rainbowsunset.png" },
  northernlights: { type: "static", file: "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/backgrounds/staticbackgrounds/northernlights.png" }

};

function setScene(sceneKey) {
  const scene = backgrounds[sceneKey];
  if (!scene) return;

  currentScene = sceneKey;

  if (scene.type === "daynight") {
    bgVideo.src = isDay ? scene.day : scene.night;
    bgVideo.style.display = "block";
    bgVideo.style.width = "100%";   // ✅ force full width
    bgVideo.style.height = "100%";  // ✅ force full height
    bgVideo.style.objectFit = "cover"; // ✅ crop/cover
    backgroundVideoWrapper.style.background = "black"; // ✅ no white flash
    document.getElementById("theme-switch").style.display = "flex";
    bgVideo.load();
    bgVideo.play().catch(() => {});
  } 
  else if (scene.type === "single") {
    bgVideo.src = scene.file;
    bgVideo.style.display = "block";
    bgVideo.style.width = "100%";
    bgVideo.style.height = "100%";
    bgVideo.style.objectFit = "cover";
    backgroundVideoWrapper.style.background = "black";
    document.getElementById("theme-switch").style.display = "none";
    bgVideo.load();
    bgVideo.play().catch(() => {});
  } 
  else if (scene.type === "static") {
    bgVideo.pause();
    bgVideo.removeAttribute("src");
    bgVideo.style.display = "none";
    backgroundVideoWrapper.style.background = `url('${scene.file}') center/cover no-repeat`;
    document.getElementById("theme-switch").style.display = "none";
  }
}

function toggleDayNight() {
  if (!currentScene) return;
  const scene = backgrounds[currentScene];
  if (scene.type !== "daynight") return;

  // ✅ Flip + save day/night state
  isDay = !isDay;
  localStorage.setItem("isDay", JSON.stringify(isDay));

  const video = document.querySelector("#bgvid");
  if (video) {
    video.src = isDay ? scene.day : scene.night;
    video.load();
    video.play().catch(() => {});
  }
}

// === TIMER FUNCTIONS ===
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateDisplay() {
  display.textContent = formatTime(timeLeft);
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.textContent = "Pause";
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = "Start";
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  startBtn.textContent = "Start";
}




// === TIMER EVENTS ===
startBtn.addEventListener("click", () => {
  if (isRunning) pauseTimer();
  else startTimer();
});

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    mode = btn.dataset.mode;
    timeLeft = modes[mode];
    updateDisplay();
    pauseTimer();
  });
});

// Initial display
updateDisplay();




// === MUSIC ===
function loadTrack() {
  audio.src = `https://pub-236e707462434f9c85349197ad4239bb.r2.dev/music/${currentPlaylist}.mp3`;
  audio.load();
}

function playPauseTrack() {
  if (!audio.src) {
    loadTrack();
  }

  if (audio.paused) {
    audio.play();
    isPlaying = true;
  } else {
    audio.pause();
    isPlaying = false;
  }
  updatePlayIcon();
}

// ✅ Skip forward through playlists
function skipTrack() {
  let index = playlists.indexOf(currentPlaylist);
  index = (index + 1) % playlists.length; // move forward
  currentPlaylist = playlists[index];

  loadTrack();
  audio.play();
  isPlaying = true;
  updatePlayIcon();
  syncDropdown();
}

function skipBackward() {
  let index = playlists.indexOf(currentPlaylist);
  index = (index - 1 + playlists.length) % playlists.length; // move backward
  currentPlaylist = playlists[index];

  loadTrack();
  audio.play();
  isPlaying = true;
  updatePlayIcon();
  syncDropdown();
}

function changePlaylist(newPlaylist) {
  currentPlaylist = newPlaylist;

  loadTrack();              // ✅ only reload on playlist change
  audio.play();
  isPlaying = true;
  updatePlayIcon();
  syncDropdown();
}

function updatePlayIcon() {
  const icon = document.getElementById("play-pause-icon");
  if (!icon) return;

  if (!audio.src || audio.paused) {
    icon.src = "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/icons/play.svg";
    icon.alt = "Play";
  } else {
    icon.src = "https://pub-236e707462434f9c85349197ad4239bb.r2.dev/icons/pause.svg";
    icon.alt = "Pause";
  }
}

// === MUSIC: DROPDOWN SYNC ===
function syncDropdown() {
  const dropdown = document.querySelector(".music-dropdown");
  if (dropdown) {
    dropdown.value = currentPlaylist;
  }
}




// === MODALS ===
function showModal(type) {
  modalContainer.innerHTML = "";

  const modal = document.createElement("div");
  modal.classList.add("modal-overlay");

  const contentBox = document.createElement("div");
  contentBox.classList.add("modal-content");

  // Add specific modal type class
  if (type === "music") {
    contentBox.classList.add("music-modal");
  } else if (type === "ambient") {
    contentBox.classList.add("ambient-modal");
  } else if (type === "backgrounds") {
    contentBox.classList.add("scene-modal");
  }

  // Close when clicking outside modal overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // MUSIC MODAL
  if (type === "music") {
    contentBox.innerHTML += `
      <h2>Choose Playlist</h2>
      <select class="music-dropdown" onchange="changePlaylist(this.value)">
        <option value="deepdive">Deep Dive</option>
        <option value="chillstep">Chill Step</option>
        <option value="innerglow">Inner Glow</option>
        <option value="forestflute">Forest Flute</option>
        <option value="focusstate">Focus State</option>
        <option value="zengarden">Zen Garden</option>
        <option value="peacefulpiano">Peaceful Piano</option>
        <option value="summerlofi">Summer Lo-Fi</option>
        <option value="guitarvibes">Guitar Vibes</option>
        <option value="chillhop">Chill Hop</option>
        <option value="classical">Classical</option>
        <option value="jazzhop">Jazz Hop</option>
        <option value="rainydayjazz">Rainy Day Jazz</option>
        <option value="cozylofi">Cozy Lo-Fi</option>
        <option value="deepwork">Deep Work</option>
        <option value="synthwave">Synth Wave</option>
        <option value="darkacademia">Dark Academia</option>
      </select>
      <div class="music-row">
        <button class="icon-control" onclick="skipBackward()"><img src="https://pub-236e707462434f9c85349197ad4239bb.r2.dev/icons/back.svg" alt="Back"></button>
        <button class="icon-control play" onclick="playPauseTrack()"><img id="play-pause-icon" src="https://pub-236e707462434f9c85349197ad4239bb.r2.dev/icons/play.svg" alt="Play"></button>
        <button class="icon-control" onclick="skipTrack()"><img src="https://pub-236e707462434f9c85349197ad4239bb.r2.dev/icons/next.svg" alt="Next"></button>
      </div>
      <div class="volume-row">
        <input type="range" class="volume" id="volumeSlider" min="0" max="1" step="0.01" value="1" />
      </div>
    `;
  }

  // AMBIENT MODAL
  if (type === "ambient") {
    contentBox.innerHTML += `
      <h2>Ambient Sounds</h2>
      <div class="ambient-grid"></div>
      <button class="clear-all-btn" onclick="stopAllAmbient()">Stop All</button>
    `;
  }

  // BACKGROUNDS MODAL (carousel style)
  if (type === "backgrounds") {
    contentBox.classList.add("scene-modal");
    contentBox.innerHTML += `
      <div class="carousel-wrapper">
        <button class="carousel-btn left">&#10094;</button>
        <div class="scene-carousel-inner"></div>
        <button class="carousel-btn right">&#10095;</button>
      </div>
    `;
  }

  modal.appendChild(contentBox);
  modalContainer.appendChild(modal);

  // Initialize panel contents
  if (type === "music") {
    syncDropdown();       // ✅ only sync dropdown
    updatePlayIcon();     // ✅ fix play/pause mismatch
    applyVolumeStyle();
  } else if (type === "ambient") {
    renderAmbientPanel();
  } else if (type === "backgrounds") {
    renderScenePanel();

    // Attach carousel scroll buttons only for backgrounds
    const carouselInner = contentBox.querySelector(".scene-carousel-inner");
    const scrollAmount = 340; // width of card + gap
    contentBox.querySelector(".carousel-btn.left").addEventListener("click", () => {
      carouselInner.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    contentBox.querySelector(".carousel-btn.right").addEventListener("click", () => {
      carouselInner.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }
}

function closeModal() {
  modalContainer.innerHTML = "";
}

function applyVolumeStyle() {
  const volumeSlider = document.getElementById("volumeSlider");
  if (!volumeSlider) return;

  const updateStyle = () => {
    const val = volumeSlider.value * 100;
    volumeSlider.style.background = `linear-gradient(to right, #f25cd9 ${val}%, #ccc ${val}%)`;
  };

  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
    updateStyle();
  });

  updateStyle();
}




// === SCENE PANEL ===

// 🎬 Custom Scene Order (arrange however you like)
const sceneOrder = [
  "lakesidecamping",
  "winternight",
  "snowystudy",
  "treehouse",
  "beachvilla",
  "citytrain",
  "centralpark",
  "lakehouse",
  "tokyo",
  "seoul",
  "studyinthewoods",
  "plane",
  "kyotopark",
  "inthewoods",
  "fuji",
  "floating",
  "bookcafe",
  "library",
  "beachstudy",
  "ramenshop",
  "countrysidetrain",
  "sunsetmountain",
  "warmlandscape",
  "galaxy",
  "pinksunset",
  "ocean",
  "burntmountains",
  "chillyskies",
  "rainbowsunset",
  "northernlights",
  "mistytreetops",
  "leaves",
  "pastelmountain",
  "beigepastel",
  "pinkpastel",
  "deepgradient",
  "purplegradient",
];

function renderScenePanel() {
  const carousel = document.querySelector(".scene-carousel-inner");
  carousel.innerHTML = "";

  // ✅ Custom overrides for tricky names
  const customNames = {
    seoul: "Seoul",
    citytrain: "City Train",
    countrysidetrain: "Countryside Train",
    lakesidecamping: "Lakeside Camping",
    treehouse: "Treehouse",
    beachvilla: "Beach Villa",
    plane: "Plane",
    centralpark: "Central Park",
    lakehouse: "Lakehouse",
    kyotopark: "Kyoto Park",
    studyinthewoods: "Study in the Woods",
    inthewoods: "In the Woods",
    fuji: "Fuji",
    floating: "Floating",
    bookcafe: "Book Cafe",
    library: "Library",
    beachstudy: "Beach Study",
    snowystudy: "Snowy Study",
    tokyo: "Tokyo",
    ramenshop: "Ramen Shop",
    winternight: "Winter Night",
    sunsetmountain: "Sunset Mountain",
    galaxy: "Galaxy",
    pinksunset: "Pink Sunset",
    ocean: "Ocean",
    beigepastel: "Beige Gradient",
    pinkpastel: "Pink Gradient",
    leaves: "Leaves",
    pastelmountain: "Pastel Mountain",
    warmlandscape: "Warm Landscape",
    deepgradient: "Deep Gradient",
    purplegradient: "Purple Gradient",
    burntmountains: "Burnt Mountains",
    chillyskies: "Chilly Skies",
    mistytreetops: "Misty Treetops",
    rainbowsunset: "Rainbow Sunset",
    northernlights: "Northern Lights",
  };

  // 🔑 Loop in the exact order from sceneOrder
  sceneOrder.forEach((key) => {
    const scene = backgrounds[key];
    if (!scene) return; // skip if missing from backgrounds object

    const card = document.createElement("div");
    card.className = "scene-carousel-card";

    // ✅ Human-readable title (custom override first, fallback regex second)
    const title = customNames[key] || key
      .replace(/([a-z])([A-Z])/g, "$1 $2")   // camelCase → spaced
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // split ALLCAPS properly
      .replace(/^./, (str) => str.toUpperCase());

    const type = scene.type === "static" ? "Static" : "Animated";

    // ✅ Pick preview image
    const preview = scene.cover || scene.file || scene.day;

    // ✅ Build card with overlay
    card.innerHTML = `
      <img src="${preview}" alt="${title}">
      <div class="scene-overlay">
        <div class="scene-title">${title.trim()}</div>
        <div class="scene-type">${type}</div>
      </div>
    `;

    // ✅ Click to set scene
    card.addEventListener("click", () => {
      setScene(key);
      closeModal();
    });
    
     // ✅ When user picks a scene:
    card.addEventListener("click", () => {
      setScene(key);                                // change background
      localStorage.setItem("selectedScene", key);   // save their choice
      closeModal();
    });

    carousel.appendChild(card);
  });
}



// === AMBIENT PANEL ===
function renderAmbientPanel() {
  const grid = document.querySelector(".ambient-grid");
  grid.innerHTML = "";

  ambientSounds.forEach(({ file, name, emoji }) => {
    const wrapper = document.createElement("div");
    wrapper.className = "ambient-item";

    const icon = document.createElement("div");
    icon.className = "ambient-emoji";
    icon.textContent = emoji;

    const label = document.createElement("div");
    label.className = "ambient-label";
    label.textContent = name;

    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "ambient-slider";
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = 1;
    slider.style.display = "none";

    // ✅ Reuse existing sound if it already exists
    let sound = ambientAudio[file];
    if (!sound) {
      sound = new Audio(`https://pub-236e707462434f9c85349197ad4239bb.r2.dev/ambient/${file}`);
      sound.loop = true;
      ambientAudio[file] = sound;
    }

    // ✅ Restore slider + playing state if sound is active
    if (!sound.paused) {
      slider.value = sound.volume;
      slider.style.display = "block";
    }

    wrapper.addEventListener("click", () => {
      if (sound.paused) {
        sound.volume = slider.value;
        sound.play();
        slider.style.display = "block";
      } else {
        sound.pause();
        sound.currentTime = 0;
        slider.style.display = "none";
      }
    });

    slider.addEventListener("input", () => {
      sound.volume = slider.value;
    });

    wrapper.appendChild(icon);
    wrapper.appendChild(label);
    wrapper.appendChild(slider);
    grid.appendChild(wrapper);
  });
}

function stopAllAmbient() {
  Object.values(ambientAudio).forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
  renderAmbientPanel(); // ✅ will refresh panel with all sliders hidden
}

// === EVENT LISTENERS ===
musicBtn.addEventListener("click", () => showModal("music"));
ambientBtn.addEventListener("click", () => showModal("ambient"));
backgroundBtn.addEventListener("click", () => showModal("backgrounds")); // ✅ New

toggleTimerBtn.addEventListener("click", () => {
  if (timerContainer.style.display === "none") {
    timerContainer.style.display = ""; // restore CSS default
  } else {
    timerContainer.style.display = "none";
  }
});

// === RESTORE LAST SCENE OR FALLBACK DEFAULT ===
window.addEventListener("DOMContentLoaded", () => {
  const savedScene = localStorage.getItem("selectedScene");
  const savedDayNight = localStorage.getItem("isDay");

  // Restore last known day/night state
  if (savedDayNight !== null) {
    isDay = savedDayNight === "true";
    dayMode.checked = isDay;
    nightMode.checked = !isDay;
  }

  // Pick the correct scene
  const initialScene = (savedScene && backgrounds[savedScene])
    ? savedScene
    : "bookcafe";   // 👈 your fallback

  // ✅ Force scene load AFTER one tick
  setTimeout(() => {
    setScene(initialScene);

    // ✅ Explicitly re-apply day/night so first load shows correctly
    if (backgrounds[initialScene].type === "daynight") {
      const scene = backgrounds[initialScene];
      bgVideo.src = isDay ? scene.day : scene.night;
      bgVideo.load();
      bgVideo.play().catch(() => {});
    }
  }, 50);  // small delay lets DOM/video element initialize
});