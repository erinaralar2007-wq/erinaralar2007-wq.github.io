// Patch: All event bindings now check for element existence before assignment.

//navbar

const burger = document.getElementById('burgerMenu');
const nav = document.getElementById('navbar');
if (burger && nav) {
    burger.onclick = () => {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    };
}

// The following navbar dropdown elements do NOT exist in your HTML.
// Only bind event handlers if they exist.
// You can safely remove these if not needed, but keeping null-safe for future use.

const homeDropdown = document.getElementById("home-dropdown");
const studyDropdown = document.getElementById("study-dropdown");
const subjectsButton = document.getElementById('subjects-button');
const dropdown = document.getElementById('dropdown');
const mathDropdown = document.getElementById('math-dropdown');
const physicsDropdown = document.getElementById('physics-dropdown');
const chemistryDropdown = document.getElementById('chemistry-dropdown');
const mathButton = document.getElementById('math-button');
const physicsButton = document.getElementById('physics-button');
const chemistryButton = document.getElementById('chemistry-button');
const mathDropdown2 = document.getElementById('math-dropdown2');
const physicsDropdown2 = document.getElementById("physics-dropdown2");
const chemistryDropdown2 = document.getElementById("chemistry-dropdown2");

// Patch: Only assign if elements exist
if (subjectsButton && dropdown && homeDropdown && studyDropdown) {
    subjectsButton.onclick = () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        homeDropdown.style.display = homeDropdown.style.display === 'none' ? 'block' : 'none';
        studyDropdown.style.display = studyDropdown.style.display === 'none' ? 'block' : 'none';
    };
}
if (mathButton && mathDropdown2 && physicsDropdown && chemistryDropdown) {
    mathButton.onclick = () => {
        mathDropdown2.style.display = mathDropdown2.style.display === 'flex' ? 'none' : 'flex';
        physicsDropdown.style.display = physicsDropdown.style.display === 'none' ? 'flex' : 'none';
        chemistryDropdown.style.display = chemistryDropdown.style.display === 'none' ? 'flex' : 'none';
    };
}
if (physicsButton && physicsDropdown2 && mathDropdown && chemistryDropdown) {
    physicsButton.onclick = () => {
        physicsDropdown2.style.display = physicsDropdown2.style.display === 'flex' ? 'none' : 'flex';
        mathDropdown.style.display = mathDropdown.style.display === 'none' ? 'flex' : 'none';
        chemistryDropdown.style.display = chemistryDropdown.style.display === 'none' ? 'flex' : 'none';
    };
}
if (chemistryButton && chemistryDropdown2 && mathDropdown && physicsDropdown) {
    chemistryButton.onclick = () => {
        chemistryDropdown2.style.display = chemistryDropdown2.style.display === 'flex' ? 'none' : 'flex';
        mathDropdown.style.display = mathDropdown.style.display === 'none' ? 'flex' : 'none';
        physicsDropdown.style.display = physicsDropdown.style.display === 'none' ? 'flex' : 'none';
    };
}

//tasks
const inputBox = document.getElementById("taskInput");
const listContainer = document.getElementById("tasksContainer");

// Patch: Use JS event binding for add task button, not inline HTML.
// If you still use <button onclick="addTask()">, this is safe.
// Otherwise, you can give it an id and bind here:
const addTaskButton = document.querySelector("#taskList button");
if (addTaskButton) {
    addTaskButton.onclick = addTask;
}

function addTask() {
    if (!inputBox || !listContainer) return;
    if (inputBox.value === '') {
        alert("Error: You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        li.classList.add("unchecked");
    }
    inputBox.value = "";
    saveData();
}

// Patch: Only bind to listContainer if it exists
if (listContainer) {
    listContainer.addEventListener("click", function(e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("checked");
            saveData();
        } else if (e.target.tagName === "SPAN") {
            e.target.parentElement.remove();
            saveData();
        }
    }, false);
}

function saveData() {
    if (listContainer)
        localStorage.setItem("tasksData", listContainer.innerHTML);
}

function showTasks() {
    if (listContainer)
        listContainer.innerHTML = localStorage.getItem("tasksData");
}
showTasks();

// pomodoro
var pomodoroClock = {
    started: false,
    minutes: 0,
    seconds: 0,
    sessionLength: 15,
    sessionDOM: null,
    breakLength: 5,
    breakDOM: null,
    interval: null,
    minutesDom: null,
    secondsDom: null,
    runs: 1,

    init: function () {
        var self = this;

        this.minutesDom = document.querySelector("#minutes");
        this.secondsDom = document.querySelector("#seconds");
        this.sessionDOM = document.querySelector("#sessionTime");
        this.breakDOM = document.querySelector("#breakTime");

        const startBtn = document.querySelector("#start");
        const resetBtn = document.querySelector("#reset");
        if (startBtn) {
            startBtn.addEventListener("click", function () {
                if (self.started) {
                    self.stopCount.apply(self);
                } else {
                    self.startCount.apply(self);
                }
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                self.resetTimer();
            });
        }

        document.querySelectorAll(".timeAdjust").forEach(function (e) {
            e.addEventListener("click", function () {
                if (this.id === "seshPlus") {
                    self.adjustValue(true);
                } else if (this.id === "seshMinus") {
                    self.adjustValue(false);
                } else if (this.id === "breakMinus") {
                    self.adjustValue(false, true);
                } else if (this.id === "breakPlus") {
                    self.adjustValue(true, true);
                }
            });
        });

        this.updateUI();
    },

    startCount: function () {
        this.started = true;
        this.minutes = this.sessionLength;
        this.interval = setInterval(this.intervalFunction.bind(this), 1000);
        const startBtn = document.querySelector("#start");
        if (startBtn) startBtn.innerHTML = "Stop";
    },

    stopCount: function () {
        this.started = false;
        clearInterval(this.interval);
        const startBtn = document.querySelector("#start");
        if (startBtn) startBtn.innerHTML = "Start";
        this.updateUI();
    },

    resetTimer: function () {
        this.stopCount();
        this.minutes = this.sessionLength;
        this.seconds = 0;
        this.runs = 1;
        this.updateUI();
    },

    intervalFunction: function () {
        if (this.seconds == 0) {
            if (this.minutes == 0) {
                this.timerDone();
                return;
            }
            this.seconds = 59;
            this.minutes--;
        } else {
            this.seconds--;
        }
        this.updateUI();
    },

    timerDone: function () {
        this.runs++;
        if (this.runs === 2 || this.runs === 4) {
            this.minutes = this.breakLength;
            var pomodoroSound = document.getElementById("pomodoroSound");
            if (pomodoroSound) pomodoroSound.play();
        } else if (this.runs === 3 || this.runs === 5) {
            this.minutes = this.sessionLength;
            var pomodoroSound = document.getElementById("pomodoroSound");
            if (pomodoroSound) pomodoroSound.play();
        } else {
            this.stopCount();
        }
        this.seconds = 0;
        this.updateUI();
    },

    updateUI: function () {
        if (this.minutesDom) this.minutesDom.innerHTML = this.numberFormat(this.minutes);
        if (this.secondsDom) this.secondsDom.innerHTML = this.numberFormat(this.seconds);
        if (this.sessionDOM) this.sessionDOM.innerHTML = this.sessionLength + " min";
        if (this.breakDOM) this.breakDOM.innerHTML = this.breakLength + " min";
    },

    numberFormat: function (num) {
        return num < 10 ? "0" + num : num;
    },

    adjustValue: function (increment, isBreak) {
        if (isBreak) {
            if (increment) {
                this.breakLength++;
            } else {
                this.breakLength = Math.max(1, this.breakLength - 1);
            }
        } else {
            if (increment) {
                this.sessionLength++;
            } else {
                this.sessionLength = Math.max(1, this.sessionLength - 1);
            }
        }
        this.updateUI();
    }
};

window.onload = function () {
    pomodoroClock.init();
};

// sound
// Patch: Commented out sound player code is unchanged

document.addEventListener("DOMContentLoaded", function () {
    var pomodoroSound = document.getElementById("pomodoroSound");
    if (pomodoroSound) {
        console.log(pomodoroSound.src);
    }
});

//study mode mobile
const settings = document.getElementById("settings");
const backToSettings = document.getElementById("back-to-settings");
const mobileSettings = document.getElementById('mobile-settings');
const tasksNavButton = document.getElementById('tasks-nav-button');
const audioNavButton = document.getElementById('audio-nav-button');
const back = document.getElementById('back');
const pomodoro = document.getElementById("pomodoro");
const tasks = document.getElementById("tasks");
const audio = document.getElementById("sound");

if (settings && mobileSettings && pomodoro) {
    settings.onclick = () => {
        mobileSettings.style.display = mobileSettings.style.display === 'block' ? 'none' : 'block';
        pomodoro.style.display = pomodoro.style.display === 'none' ? 'grid' : 'none';
        settings.style.display = 'none';
    };
}

if (backToSettings && mobileSettings && tasks && audio) {
    backToSettings.onclick = () => {
        mobileSettings.style.display = mobileSettings.style.display === 'block' ? 'none' : 'block';
        backToSettings.style.display = 'none';
        if (tasks.style.display == 'block') {
            tasks.style.display = 'none';
        } else {
            if (audio.style.display == 'block') {
                audio.style.display = 'none';
            }
        }
    }
}

if (back && pomodoro && tasks && audio && mobileSettings && settings) {
    back.onclick = () => {
        pomodoro.style.display = 'grid';
        tasks.style.display = 'none';
        audio.style.display = 'none';
        mobileSettings.style.display = 'none';
        settings.style.display = 'block';
    };
}

if (tasksNavButton && mobileSettings && tasks && backToSettings) {
    tasksNavButton.onclick = () => {
        mobileSettings.style.display = 'none';
        tasks.style.display = 'block';
        backToSettings.style.display = 'block';
    };
}

if (audioNavButton && mobileSettings && audio && backToSettings) {
    audioNavButton.onclick = () => {
        mobileSettings.style.display = 'none';
        audio.style.display = 'block';
        backToSettings.style.display = 'block';
    };
}
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // If no element is in fullscreen, request it on the whole page
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    });
  } else {
    // If already fullscreen, exit
    document.exitFullscreen();
  }
}

// Optional: Listen for fullscreen changes to update button text/icon style
document.addEventListener('fullscreenchange', () => {
  const btn = document.getElementById('fullscreen-btn');
  if (document.fullscreenElement) {
    btn.innerHTML = '<span class="fs-icon">⤶</span> Exit Fullscreen';
  } else {
    btn.innerHTML = '<span class="fs-icon">⛶</span> Fullscreen';
  }
});
