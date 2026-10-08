// ======================================================
// LIFE JOURNAL - COMPLETE APP.JS
// ======================================================


// ======================================================
// STORAGE
// ======================================================

const STORAGE_KEY = "lifejournal";
const THEME_KEY = "journalTheme";
const FILTER_KEY = "journalFilter";
const TRASH_KEY = "lifeJournalTrash";
const GOALS_KEY = "lifeJournalGoals";
const HABITS_KEY = "lifeJournalHabits";


// ======================================================
// BASIC STORAGE FUNCTIONS
// ======================================================

function getEntries() {
  try {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!Array.isArray(entries)) {
      return [];
    }

    // ===== NEW =====
    // Make old entries compatible with new features
    return entries.map(entry => ({
      id: entry.id || Date.now() + Math.random(),
      date: entry.date || getToday(),
      mood: entry.mood || "😐",
      text: entry.text || "",
      gratitude: entry.gratitude || "",
      achievement: entry.achievement || "",
      lesson: entry.lesson || "",
      tomorrow: entry.tomorrow || "",
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      favorite: Boolean(entry.favorite),
      pinned: Boolean(entry.pinned),
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: entry.updatedAt || null
    }));

  } catch (error) {
    console.error("Error reading entries:", error);
    return [];
  }
}


function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}


// ======================================================
// TRASH
// ======================================================

function getTrash() {
  try {
    const trash = JSON.parse(localStorage.getItem(TRASH_KEY));
    return Array.isArray(trash) ? trash : [];
  } catch {
    return [];
  }
}


function saveTrash(trash) {
  localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
}


// ======================================================
// GOALS
// ======================================================

function getGoals() {
  try {
    const goals = JSON.parse(localStorage.getItem(GOALS_KEY));
    return Array.isArray(goals) ? goals : [];
  } catch {
    return [];
  }
}


function saveGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}


// ======================================================
// HABITS
// ======================================================

function getHabits() {
  try {
    const habits = JSON.parse(localStorage.getItem(HABITS_KEY));
    return Array.isArray(habits) ? habits : [];
  } catch {
    return [];
  }
}


function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}


// ======================================================
// DOM ELEMENTS
// ======================================================

const formContainer = document.getElementById("formContainer");
const entryForm = document.getElementById("entryForm");

const editId = document.getElementById("editId");
const entryDate = document.getElementById("entryDate");
const entryText = document.getElementById("entryText");
const entryTags = document.getElementById("entryTags");

const entryGratitude = document.getElementById("entryGratitude");
const entryAchievement = document.getElementById("entryAchievement");
const entryLesson = document.getElementById("entryLesson");
const entryTomorrow = document.getElementById("entryTomorrow");

const moodPicker = document.getElementById("moodPicker");
const cardsGrid = document.getElementById("cardsGrid");

const journalPrompt = document.getElementById("journalPrompt");

const newEntryBtn = document.getElementById("newEntryBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

const searchBox = document.getElementById("searchBox");
const moodFilters = document.getElementById("moodFilters");
const tagFilters = document.getElementById("tagFilters");
const dateRange = document.getElementById("dateRange");

const themeToggle = document.getElementById("themeToggle");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

const surpriseBtn = document.getElementById("surpriseBtn");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");


// ======================================================
// STATS ELEMENTS
// ======================================================

const totalEntries = document.getElementById("totalEntries");
const favoriteCount = document.getElementById("favoriteCount");
const pinnedCount = document.getElementById("pinnedCount");
const wordCount = document.getElementById("wordCount");

const longestStreakInfo = document.getElementById("longestStreakInfo");
const moodDist = document.getElementById("moodDist");
const streakInfo = document.getElementById("streakInfo");
const topTagInfo = document.getElementById("topTagInfo");
const monthCount = document.getElementById("monthCount");


// ======================================================
// GOALS & HABITS ELEMENTS
// ======================================================

const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalsList = document.getElementById("goalsList");

const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitsList = document.getElementById("habitsList");


// ======================================================
// STATE
// ======================================================

let selectedMood = "";

let filterState = {
  mood: "all",
  tag: "all",
  range: "all",
  search: ""
};


// ======================================================
// RESTORE FILTER STATE
// ======================================================

// ===== NEW =====
try {
  const savedFilter = JSON.parse(sessionStorage.getItem(FILTER_KEY));

  if (savedFilter) {
    filterState = {
      ...filterState,
      ...savedFilter
    };
  }
} catch {
  console.log("No valid filter state found.");
}


// ======================================================
// CONSTANTS
// ======================================================

const MOODS = ["😄", "😐", "😢", "😡", "🤩"];

const JOURNAL_PROMPTS = [
  "💭 What made you happy today?",
  "🌱 What did you learn today?",
  "🙏 What are you grateful for?",
  "🏆 What was your biggest achievement?",
  "❤️ Who made your day better?",
  "🧠 What would you like to improve?",
  "🔥 What made you proud today?",
  "🌟 What was the best moment of your day?",
  "🎯 What do you want to accomplish tomorrow?",
  "😊 What made you smile today?"
];


// ======================================================
// HELPER FUNCTIONS
// ======================================================

function getToday() {
  return new Date().toISOString().split("T")[0];
}


function getRandomPrompt() {
  return JOURNAL_PROMPTS[
    Math.floor(Math.random() * JOURNAL_PROMPTS.length)
  ];
}


function saveFilterState() {
  try {
    sessionStorage.setItem(
      FILTER_KEY,
      JSON.stringify(filterState)
    );
  } catch {
    console.log("Could not save filter state.");
  }
}


function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}


function escapeHTML(value = "") {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}


function getWordCount(text = "") {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}


function getAllText(entry) {
  return [
    entry.text,
    entry.gratitude,
    entry.achievement,
    entry.lesson,
    entry.tomorrow,
    ...(entry.tags || [])
  ]
    .join(" ")
    .toLowerCase();
}


// ======================================================
// MOOD PICKER
// ======================================================

const moodBtns = document.querySelectorAll(".mood-btn");


function resetMoodSelection() {
  selectedMood = "";

  moodBtns.forEach(button => {
    button.classList.remove("selected");
  });
}


function setMood(mood) {
  selectedMood = mood;

  moodBtns.forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.mood === mood
    );
  });
}


moodBtns.forEach(button => {
  button.addEventListener("click", () => {
    setMood(button.dataset.mood);
  });
});


// ======================================================
// FORM
// ======================================================

function showForm(entry = null) {

  formContainer.classList.remove("hidden");

  if (entry) {

    editId.value = entry.id;

    entryDate.value = entry.date;
    entryText.value = entry.text;

    entryTags.value = (entry.tags || []).join(", ");

    entryGratitude.value = entry.gratitude || "";
    entryAchievement.value = entry.achievement || "";
    entryLesson.value = entry.lesson || "";
    entryTomorrow.value = entry.tomorrow || "";

    setMood(entry.mood);

    saveBtn.textContent = "Update";

    if (journalPrompt) {
      journalPrompt.textContent = "✏️ Editing your memory...";
    }

  } else {

    editId.value = "";

    entryDate.value = getToday();

    entryText.value = "";
    entryTags.value = "";

    entryGratitude.value = "";
    entryAchievement.value = "";
    entryLesson.value = "";
    entryTomorrow.value = "";

    resetMoodSelection();

    saveBtn.textContent = "Save";

    if (journalPrompt) {
      journalPrompt.textContent = getRandomPrompt();
    }
  }

  entryText.focus();
}


function hideForm() {
  formContainer.classList.add("hidden");
  entryForm.reset();

  editId.value = "";

  entryDate.value = getToday();

  resetMoodSelection();

  saveBtn.textContent = "Save";

  if (journalPrompt) {
    journalPrompt.textContent = getRandomPrompt();
  }
}


newEntryBtn.addEventListener("click", () => {
  showForm();
});


cancelBtn.addEventListener("click", () => {
  hideForm();
});


// ======================================================
// SAVE / UPDATE ENTRY
// ======================================================

// ===== NEW =====
// Main Save button logic fixed and compatible with new HTML.

entryForm.addEventListener("submit", event => {

  event.preventDefault();

  const text = entryText.value.trim();

  if (!text) {
    alert("Please write something in your memory.");
    entryText.focus();
    return;
  }

  if (!selectedMood) {
    alert("Please select your mood.");
    return;
  }

  const date = entryDate.value || getToday();

  const tags = entryTags.value
    .split(",")
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean);

  const entryData = {
    date,
    mood: selectedMood,
    text,

    gratitude: entryGratitude.value.trim(),
    achievement: entryAchievement.value.trim(),
    lesson: entryLesson.value.trim(),
    tomorrow: entryTomorrow.value.trim(),

    tags
  };


  const entries = getEntries();

  const currentEditId = editId.value;


  // ====================================================
  // UPDATE EXISTING ENTRY
  // ====================================================

  if (currentEditId) {

    const index = entries.findIndex(
      entry => String(entry.id) === String(currentEditId)
    );

    if (index !== -1) {

      entries[index] = {
        ...entries[index],
        ...entryData,
        updatedAt: new Date().toISOString()
      };

    }

  }

  // ====================================================
  // CREATE NEW ENTRY
  // ====================================================

  else {

    const newEntry = {
      id: Date.now().toString(),

      ...entryData,

      favorite: false,
      pinned: false,

      createdAt: new Date().toISOString(),
      updatedAt: null
    };

    entries.push(newEntry);
  }


  saveEntries(entries);

  refresh();

  hideForm();

});


// ======================================================
// RENDER CARDS
// ======================================================

function renderCards(entries = getEntries()) {

  if (!cardsGrid) return;

  cardsGrid.innerHTML = "";


  if (entries.length === 0) {

    cardsGrid.innerHTML = `
      <div class="empty-state">
        <h3>📭 No memories found</h3>
        <p>Start writing your first life memory.</p>
      </div>
    `;

    return;
  }


  // Pinned entries first
  const sortedEntries = [...entries].sort((a, b) => {

    if (a.pinned !== b.pinned) {
      return Number(b.pinned) - Number(a.pinned);
    }

    return new Date(b.date) - new Date(a.date);
  });


  sortedEntries.forEach(entry => {

    const card = document.createElement("article");

    card.className = "card";

    card.dataset.id = entry.id;


    if (entry.pinned) {
      card.classList.add("pinned");
    }


    const tagsHTML = (entry.tags || [])
      .map(tag => `
        <span class="tag">#${escapeHTML(tag)}</span>
      `)
      .join("");


    let extraSections = "";


    if (entry.gratitude) {
      extraSections += `
        <div class="entry-extra">
          <strong>🙏 Gratitude</strong>
          <p>${escapeHTML(entry.gratitude)}</p>
        </div>
      `;
    }


    if (entry.achievement) {
      extraSections += `
        <div class="entry-extra">
          <strong>🏆 Achievement</strong>
          <p>${escapeHTML(entry.achievement)}</p>
        </div>
      `;
    }


    if (entry.lesson) {
      extraSections += `
        <div class="entry-extra">
          <strong>🧠 Lesson</strong>
          <p>${escapeHTML(entry.lesson)}</p>
        </div>
      `;
    }


    if (entry.tomorrow) {
      extraSections += `
        <div class="entry-extra">
          <strong>🎯 Tomorrow</strong>
          <p>${escapeHTML(entry.tomorrow)}</p>
        </div>
      `;
    }


    const updatedText = entry.updatedAt
      ? `
        <small class="updated-time">
          Edited: ${new Date(entry.updatedAt).toLocaleString("en-IN")}
        </small>
      `
      : "";


    card.innerHTML = `

      <div class="card-header">

        <div>

          <span class="card-date">
            ${formatDate(entry.date)}
          </span>

          <span class="card-mood">
            ${entry.mood}
          </span>

        </div>

        <div class="card-status">

          ${entry.pinned ? "📌" : ""}

          ${entry.favorite ? "⭐" : ""}

        </div>

      </div>


      <div class="card-body">

        <p class="entry-text">
          ${escapeHTML(entry.text)}
        </p>

        ${extraSections}

        <div class="tags">
          ${tagsHTML}
        </div>

        ${updatedText}

      </div>


      <div class="card-actions">

        <button
          type="button"
          class="favorite-btn"
          data-id="${entry.id}"
          title="Favorite"
        >
          ${entry.favorite ? "⭐" : "☆"}
        </button>


        <button
          type="button"
          class="pin-btn"
          data-id="${entry.id}"
          title="Pin"
        >
          ${entry.pinned ? "📌" : "📍"}
        </button>


        <button
          type="button"
          class="edit-btn"
          data-id="${entry.id}"
        >
          ✏️ Edit
        </button>


        <button
          type="button"
          class="delete-btn"
          data-id="${entry.id}"
        >
          🗑 Delete
        </button>

      </div>
    `;


    cardsGrid.appendChild(card);
  });
}


// ======================================================
// TAG FILTERS
// ======================================================

function renderTagFilters() {

  if (!tagFilters) return;

  const entries = getEntries();

  const tagSet = new Set();


  entries.forEach(entry => {

    (entry.tags || []).forEach(tag => {
      tagSet.add(tag);
    });

  });


  tagFilters.innerHTML = "";


  if (tagSet.size === 0) {

    tagFilters.innerHTML = `
      <small>No tags yet</small>
    `;

    return;
  }


  [...tagSet]
    .sort()
    .forEach(tag => {

      const button = document.createElement("button");

      button.type = "button";
      button.className = "filter-btn";

      button.dataset.tag = tag;

      button.textContent = `#${tag}`;

      if (filterState.tag === tag) {
        button.classList.add("active");
      }

      tagFilters.appendChild(button);

    });
}


// ======================================================
// ACTIVE FILTER UI
// ======================================================

function updateFilterButtons() {

  document
    .querySelectorAll("#moodFilters .filter-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.mood === filterState.mood
      );

    });


  document
    .querySelectorAll("#dateRange .filter-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.range === filterState.range
      );

    });


  document
    .querySelectorAll("#tagFilters .filter-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.tag === filterState.tag
      );

    });
}


// ======================================================
// FILTER LOGIC
// ======================================================

function applyFilters() {

  let entries = getEntries();

  // ==============================
  // SEARCH
  // ==============================

  if (filterState.search) {

    const search = filterState.search.toLowerCase();

    entries = entries.filter(entry =>
      getAllText(entry).includes(search)
    );
  }


  // ==============================
  // MOOD FILTER
  // ==============================

  if (
    filterState.mood &&
    filterState.mood !== "all"
  ) {

    entries = entries.filter(
      entry => entry.mood === filterState.mood
    );
  }


  // ==============================
  // TAG FILTER
  // ==============================

  if (
    filterState.tag &&
    filterState.tag !== "all"
  ) {

    entries = entries.filter(entry =>
      (entry.tags || []).includes(filterState.tag)
    );
  }


  // ==============================
  // DATE FILTER
  // ==============================

  if (
    filterState.range &&
    filterState.range !== "all"
  ) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    if (filterState.range === "week") {

      const weekStart = new Date(today);

      const day = weekStart.getDay();

      weekStart.setDate(
        weekStart.getDate() - day
      );


      entries = entries.filter(entry => {

        const date =
          new Date(entry.date + "T00:00:00");

        return date >= weekStart && date <= today;

      });
    }


    if (filterState.range === "month") {

      entries = entries.filter(entry => {

        const date =
          new Date(entry.date + "T00:00:00");

        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );

      });
    }
  }


  renderCards(entries);
}


// ======================================================
// FILTER EVENTS
// ======================================================

moodFilters.addEventListener("click", event => {

  const button = event.target.closest(".filter-btn");

  if (!button) return;

  filterState.mood = button.dataset.mood;

  saveFilterState();

  updateFilterButtons();

  applyFilters();

});


tagFilters.addEventListener("click", event => {

  const button = event.target.closest(".filter-btn");

  if (!button) return;

  filterState.tag = button.dataset.tag;

  saveFilterState();

  updateFilterButtons();

  applyFilters();

});


dateRange.addEventListener("click", event => {

  const button = event.target.closest(".filter-btn");

  if (!button) return;

  filterState.range = button.dataset.range;

  saveFilterState();

  updateFilterButtons();

  applyFilters();

});


searchBox.addEventListener("input", event => {

  filterState.search = event.target.value.trim();

  saveFilterState();

  applyFilters();

});


// ======================================================
// CARD ACTIONS
// ======================================================

cardsGrid.addEventListener("click", event => {

  const button = event.target.closest("button");

  if (!button) return;

  const id = button.dataset.id;

  if (!id) return;


  const entries = getEntries();

  const index = entries.findIndex(
    entry => String(entry.id) === String(id)
  );

  if (index === -1) return;


  // Favorite
  if (button.classList.contains("favorite-btn")) {

    entries[index].favorite =
      !entries[index].favorite;

    saveEntries(entries);

    refresh();

    return;
  }


  // Pin
  if (button.classList.contains("pin-btn")) {

    entries[index].pinned =
      !entries[index].pinned;

    saveEntries(entries);

    refresh();

    return;
  }


  // Edit
  if (button.classList.contains("edit-btn")) {

    showForm(entries[index]);

    return;
  }


  // Delete
  if (button.classList.contains("delete-btn")) {

    const confirmDelete = confirm(
      "Are you sure you want to delete this memory?"
    );

    if (!confirmDelete) return;


    const deletedEntry = entries.splice(index, 1)[0];

    const trash = getTrash();

    trash.push({
      ...deletedEntry,
      deletedAt: new Date().toISOString()
    });

    saveTrash(trash);

    saveEntries(entries);

    refresh();

  }

});


// ======================================================
// STATS
// ======================================================

function calculateCurrentStreak(entries) {

  if (!entries.length) return 0;


  const dates = [
    ...new Set(
      entries.map(entry => entry.date)
    )
  ]
    .sort()
    .reverse();


  let streak = 0;

  let currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);


  // If there is no entry today,
  // allow streak to start from yesterday.
  const todayString = getToday();


  if (!dates.includes(todayString)) {
    currentDate.setDate(
      currentDate.getDate() - 1
    );
  }


  for (const dateString of dates) {

    const expected =
      currentDate.toISOString().split("T")[0];


    if (dateString === expected) {

      streak++;

      currentDate.setDate(
        currentDate.getDate() - 1
      );

    } else {

      break;

    }

  }


  return streak;
}


// ======================================================
// LONGEST STREAK
// ======================================================

// ===== NEW =====

function calculateLongestStreak(entries) {

  if (!entries.length) return 0;


  const dates = [
    ...new Set(
      entries.map(entry => entry.date)
    )
  ]
    .sort();


  let longest = 1;
  let current = 1;


  for (let i = 1; i < dates.length; i++) {

    const previous =
      new Date(dates[i - 1] + "T00:00:00");

    const currentDate =
      new Date(dates[i] + "T00:00:00");


    const difference =
      (currentDate - previous) /
      (1000 * 60 * 60 * 24);


    if (difference === 1) {

      current++;

      longest = Math.max(
        longest,
        current
      );

    } else {

      current = 1;

    }

  }


  return longest;
}


// ======================================================
// RENDER STATS
// ======================================================

function renderStats() {

  const entries = getEntries();


  // Total
  if (totalEntries) {
    totalEntries.innerHTML = `
      📝 Total Memories:
      <strong>${entries.length}</strong>
    `;
  }


  // Favorites
  if (favoriteCount) {

    const count =
      entries.filter(entry => entry.favorite).length;

    favoriteCount.innerHTML = `
      ⭐ Favorites:
      <strong>${count}</strong>
    `;
  }


  // Pinned
  if (pinnedCount) {

    const count =
      entries.filter(entry => entry.pinned).length;

    pinnedCount.innerHTML = `
      📌 Pinned:
      <strong>${count}</strong>
    `;
  }


  // Word count
  if (wordCount) {

    const count = entries.reduce(
      (total, entry) =>
        total +
        getWordCount(
          [
            entry.text,
            entry.gratitude,
            entry.achievement,
            entry.lesson,
            entry.tomorrow
          ].join(" ")
        ),
      0
    );

    wordCount.innerHTML = `
      ✍️ Words Written:
      <strong>${count}</strong>
    `;
  }


  // Current streak
  const currentStreak =
    calculateCurrentStreak(entries);


  if (streakInfo) {

    streakInfo.innerHTML = `
      🔥 Current Streak:
      <strong>${currentStreak} day${currentStreak === 1 ? "" : "s"}</strong>
    `;
  }


  // Longest streak
  const longestStreak =
    calculateLongestStreak(entries);


  if (longestStreakInfo) {

    longestStreakInfo.innerHTML = `
      🏆 Longest Streak:
      <strong>${longestStreak} day${longestStreak === 1 ? "" : "s"}</strong>
    `;
  }


  // Mood distribution
  if (moodDist) {

    const moodCounts = {};

    MOODS.forEach(mood => {
      moodCounts[mood] = 0;
    });


    entries.forEach(entry => {

      if (moodCounts[entry.mood] !== undefined) {
        moodCounts[entry.mood]++;
      }

    });


    moodDist.innerHTML = `
      <strong>😊 Mood Distribution</strong>
      <div class="mood-stats">
        ${MOODS.map(mood => `
          <span>
            ${mood}
            ${moodCounts[mood]}
          </span>
        `).join("")}
      </div>
    `;
  }


  // Top tag
  if (topTagInfo) {

    const tagCounts = {};


    entries.forEach(entry => {

      (entry.tags || []).forEach(tag => {

        tagCounts[tag] =
          (tagCounts[tag] || 0) + 1;

      });

    });


    const sortedTags =
      Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1]);


    if (sortedTags.length) {

      const [tag, count] =
        sortedTags[0];

      topTagInfo.innerHTML = `
        🏷️ Top Tag:
        <strong>#${escapeHTML(tag)}</strong>
        (${count})
      `;

    } else {

      topTagInfo.innerHTML = `
        🏷️ Top Tag:
        <strong>None yet</strong>
      `;

    }
  }


  // Monthly count
  if (monthCount) {

    const currentMonth = new Date();

    const count = entries.filter(entry => {

      const date =
        new Date(entry.date + "T00:00:00");

      return (
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
      );

    }).length;


    monthCount.innerHTML = `
      📅 This Month:
      <strong>${count} memories</strong>
    `;
  }

}


// ======================================================
// GOALS
// ======================================================

// ===== NEW =====

function renderGoals() {

  if (!goalsList) return;

  const goals = getGoals();

  goalsList.innerHTML = "";


  if (!goals.length) {

    goalsList.innerHTML = `
      <p class="empty-small">
        No goals yet. Add your first goal!
      </p>
    `;

    return;
  }


  goals.forEach(goal => {

    const item = document.createElement("div");

    item.className =
      `goal-item ${goal.completed ? "completed" : ""}`;


    item.innerHTML = `

      <label>

        <input
          type="checkbox"
          class="goal-check"
          data-id="${goal.id}"
          ${goal.completed ? "checked" : ""}
        >

        <span>
          ${escapeHTML(goal.text)}
        </span>

      </label>

      <button
        type="button"
        class="delete-goal"
        data-id="${goal.id}"
      >
        ✕
      </button>

    `;


    goalsList.appendChild(item);

  });

}


function addGoal() {

  const text = goalInput.value.trim();

  if (!text) return;


  const goals = getGoals();


  goals.push({
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  });


  saveGoals(goals);

  goalInput.value = "";

  renderGoals();

}


addGoalBtn.addEventListener("click", addGoal);


goalInput.addEventListener("keydown", event => {

  if (event.key === "Enter") {
    event.preventDefault();
    addGoal();
  }

});


goalsList.addEventListener("click", event => {

  const goals = getGoals();

  const id = event.target.dataset.id;

  if (!id) return;


  // Delete goal
  if (event.target.classList.contains("delete-goal")) {

    const updatedGoals =
      goals.filter(
        goal => String(goal.id) !== String(id)
      );

    saveGoals(updatedGoals);

    renderGoals();

    return;
  }


  // Complete goal
  if (event.target.classList.contains("goal-check")) {

    const goal =
      goals.find(
        goal => String(goal.id) === String(id)
      );

    if (!goal) return;

    goal.completed =
      event.target.checked;

    saveGoals(goals);

    renderGoals();

  }

});


// ======================================================
// HABITS
// ======================================================

// ===== NEW =====

function renderHabits() {

  if (!habitsList) return;

  const habits = getHabits();

  habitsList.innerHTML = "";


  if (!habits.length) {

    habitsList.innerHTML = `
      <p class="empty-small">
        No habits yet. Build a better routine!
      </p>
    `;

    return;
  }


  habits.forEach(habit => {

    const item = document.createElement("div");

    item.className = "habit-item";


    item.innerHTML = `

      <label>

        <input
          type="checkbox"
          class="habit-check"
          data-id="${habit.id}"
          ${habit.completedToday ? "checked" : ""}
        >

        <span>
          ${escapeHTML(habit.text)}
        </span>

      </label>

      <button
        type="button"
        class="delete-habit"
        data-id="${habit.id}"
      >
        ✕
      </button>

    `;


    habitsList.appendChild(item);

  });

}


function resetDailyHabits() {

  const habits = getHabits();

  const today = getToday();

  let changed = false;


  habits.forEach(habit => {

    if (habit.lastCompletedDate !== today) {

      if (habit.completedToday) {
        habit.completedToday = false;
        changed = true;
      }

    }

  });


  if (changed) {
    saveHabits(habits);
  }

}


function addHabit() {

  const text = habitInput.value.trim();

  if (!text) return;


  const habits = getHabits();


  habits.push({

    id: Date.now().toString(),

    text,

    completedToday: false,

    lastCompletedDate: null,

    createdAt: new Date().toISOString()

  });


  saveHabits(habits);

  habitInput.value = "";

  renderHabits();

}


addHabitBtn.addEventListener("click", addHabit);


habitInput.addEventListener("keydown", event => {

  if (event.key === "Enter") {

    event.preventDefault();

    addHabit();

  }

});


habitsList.addEventListener("click", event => {

  const id = event.target.dataset.id;

  if (!id) return;


  const habits = getHabits();

  const habit =
    habits.find(
      item => String(item.id) === String(id)
    );


  if (!habit) return;


  // Delete
  if (
    event.target.classList.contains(
      "delete-habit"
    )
  ) {

    const updatedHabits =
      habits.filter(
        item => String(item.id) !== String(id)
      );

    saveHabits(updatedHabits);

    renderHabits();

    return;

  }


  // Toggle
  if (
    event.target.classList.contains(
      "habit-check"
    )
  ) {

    const today = getToday();

    habit.completedToday =
      event.target.checked;

    habit.lastCompletedDate =
      event.target.checked
        ? today
        : null;

    saveHabits(habits);

    renderHabits();

  }

});


// ======================================================
// THEME
// ======================================================

function loadTheme() {

  const savedTheme =
    localStorage.getItem(THEME_KEY);


  if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀️";

  } else {

    document.body.classList.remove("dark");

    themeToggle.textContent = "🌙";

  }

}


themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");


  const dark =
    document.body.classList.contains("dark");


  localStorage.setItem(
    THEME_KEY,
    dark ? "dark" : "light"
  );


  themeToggle.textContent =
    dark ? "☀️" : "🌙";

});


// ======================================================
// EXPORT
// ======================================================

exportBtn.addEventListener("click", () => {

  const entries = getEntries();

  const data =
    JSON.stringify(entries, null, 2);


  const blob = new Blob(
    [data],
    { type: "application/json" }
  );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    `life-journal-${getToday()}.json`;


  link.click();


  URL.revokeObjectURL(url);

});


// ======================================================
// IMPORT
// ======================================================

importBtn.addEventListener("click", () => {

  importFile.click();

});


importFile.addEventListener("change", event => {

  const file =
    event.target.files[0];

  if (!file) return;


  const reader =
    new FileReader();


  reader.onload = () => {

    try {

      const imported =
        JSON.parse(reader.result);


      if (!Array.isArray(imported)) {

        alert(
          "Invalid journal backup file."
        );

        return;
      }


      const currentEntries =
        getEntries();


      // Backup current data before import
      localStorage.setItem(
        "lifeJournalBeforeImport",
        JSON.stringify(currentEntries)
      );


      saveEntries(imported);


      refresh();


      alert(
        "Journal imported successfully!"
      );


    } catch (error) {

      console.error(error);

      alert(
        "Could not import this file."
      );

    }

  };


  reader.readAsText(file);

  event.target.value = "";

});


// ======================================================
// SURPRISE MEMORY
// ======================================================

// ======================================================
// SURPRISE MEMORY
// ======================================================

surpriseBtn.addEventListener("click", () => {

  const entries = getEntries();

  if (!entries.length) {
    alert("You don't have any memories yet. Write your first one!");
    return;
  }

  const randomEntry =
    entries[Math.floor(Math.random() * entries.length)];

  modalText.innerHTML = `
    <strong>
      ${formatDate(randomEntry.date)}
      ${randomEntry.mood}
    </strong>

    <br><br>

    ${escapeHTML(randomEntry.text)}

    ${
      randomEntry.gratitude
        ? `
          <br><br>
          <strong>🙏 Gratitude:</strong>
          <br>
          ${escapeHTML(randomEntry.gratitude)}
        `
        : ""
    }
  `;

  modal.classList.remove("hidden");
});


// ===== FIX =====
// Close button
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});


// Close when clicking outside the modal box
modal.addEventListener("click", (event) => {

  if (event.target === modal) {
    modal.classList.add("hidden");
  }

});


// Close with Escape key
document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {
    modal.classList.add("hidden");
  }

});


// ======================================================
// KEYBOARD SHORTCUTS
// ======================================================

// ===== NEW =====

document.addEventListener("keydown", event => {

  // Ctrl + N
  if (
    event.ctrlKey &&
    event.key.toLowerCase() === "n"
  ) {

    event.preventDefault();

    showForm();

  }


  // Ctrl + K
  if (
    event.ctrlKey &&
    event.key.toLowerCase() === "k"
  ) {

    event.preventDefault();

    searchBox.focus();

  }


  // Escape
  if (event.key === "Escape") {

    if (
      modal &&
      !modal.classList.contains("hidden")
    ) {

      modal.classList.add("hidden");

    }

    else if (
      formContainer &&
      !formContainer.classList.contains("hidden")
    ) {

      hideForm();

    }

  }

});


// ======================================================
// REFRESH EVERYTHING
// ======================================================

function refresh() {

  applyFilters();

  renderTagFilters();

  updateFilterButtons();

  renderStats();

  renderGoals();

  resetDailyHabits();

  renderHabits();

}


// ======================================================
// INITIAL LOAD
// ======================================================

loadTheme();

entryDate.value = getToday();

if (journalPrompt) {
  journalPrompt.textContent = getRandomPrompt();
}

if (searchBox) {
  searchBox.value = filterState.search || "";
}

resetDailyHabits();

refresh();
