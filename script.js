const C = window.PROJECT_FLIGHT_CONFIG || {};

const sb =
  window.supabase &&
  C.supabasePublishableKey &&
  C.supabasePublishableKey !== "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"
    ? window.supabase.createClient(
        C.supabaseUrl,
        C.supabasePublishableKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      )
    : null;


/* =========================
   MAIN CHECKLIST
========================= */

const sections = {
  "PREFLIGHT / FLIGHT SETUP": [
    "Flight information entered",
    "Aircraft selected",
    "Server confirmed",
    "Gate confirmed",
    "Date confirmed",
    "Aircraft ready for flight"
  ],

  "STARTUP": [
    "Aircraft powered on",
    "Systems started",
    "Engines started",
    "Flight controls checked"
  ],

  "PUSHBACK": [
    "Pushback clearance confirmed",
    "Parking brake released when ready",
    "Pushback started",
    "Pushback completed",
    "Engines stable"
  ],

  "BEFORE TAXI": [
    "Parking brake released",
    "Flight controls checked",
    "Lights set as required",
    "Taxi route confirmed"
  ],

  "TAXI": [
    "Taxi started",
    "Taxi speed controlled",
    "Turns controlled",
    "Runway entry area checked"
  ],

  "BEFORE TAKEOFF": [
    "Takeoff runway confirmed",
    "Takeoff configuration checked",
    "Flight controls checked",
    "Lights set as required",
    "Takeoff clearance confirmed"
  ],

  "TAKEOFF": [
    "Takeoff roll started",
    "Throttle set as required",
    "Rotate using pitch control",
    "Positive climb established",
    "Landing gear retracted"
  ],

  "AFTER TAKEOFF": [
    "Landing gear confirmed up",
    "Climb established",
    "Lights adjusted as required",
    "Aircraft configuration checked"
  ],

  "CLIMB": [
    "Climb established",
    "Climb speed controlled",
    "Autopilot engaged if used",
    "Monitor autopilot operation while in use"
  ],

  "CRUISE": [
    "Cruise altitude established",
    "Cruise speed established",
    "Autopilot operation checked if used",
    "Flight path monitored",
    "Systems monitored"
  ],

  "DESCENT": [
    "Descent started",
    "Descent speed controlled",
    "Altitude controlled",
    "Autopilot adjusted or disengaged as required"
  ],

  "APPROACH": [
    "Approach established",
    "Approach speed controlled",
    "Landing configuration prepared",
    "Landing gear extended when required",
    "Landing lights set as required"
  ],

  "FINAL APPROACH": [
    "Final approach established",
    "Approach path stable",
    "Speed controlled",
    "Landing configuration confirmed",
    "Runway confirmed"
  ],

  "LANDING": [
    "Landing clearance confirmed",
    "Touchdown completed",
    "Braking applied as required",
    "Landing gear confirmed down"
  ],

  "AFTER LANDING": [
    "Aircraft slowed",
    "Runway vacated",
    "Landing lights adjusted",
    "Taxi lights set as required"
  ],

  "TAXI TO GATE": [
    "Taxi to gate started",
    "Taxi route followed",
    "Taxi speed controlled",
    "Gate confirmed"
  ],

  "AT GATE / PARKING": [
    "Aircraft positioned at gate",
    "Parking brake set",
    "Engines shut down",
    "Ground services completed if used",
    "Lights set as required"
  ],

  "SHUTDOWN / FLIGHT COMPLETE": [
    "Aircraft systems shut down",
    "Final flight information checked",
    "Flight complete",
    "Checklist complete"
  ]
};


/* =========================
   ADVANCED CONTROLS
========================= */

const advanced = [
  "Throttle responds correctly",
  "Pitch responds correctly",
  "Roll responds correctly",
  "Yaw responds correctly",
  "Braking responds correctly",
  "Ground handling checked",
  "Pitch - checked",
  "Roll - checked",
  "Yaw - checked",
  "Throttle - checked",
  "Brakes - checked",
  "Control pitch",
  "Control roll",
  "Control yaw",
  "Adjust throttle as required"
];


/* =========================
   PRACTICE MANEUVERS
========================= */

const practiceManeuvers = [
  {
    id: "steep-turns",
    category: "In-Flight Practice Maneuvers",
    title: "Steep Turns (30° to 45° Bank Angle)",
    description:
      "Roll into a sustained bank turn while maintaining altitude. Adjust pitch and slightly increase throttle to compensate for lost lift.",
    success:
      "Complete a 360-degree turn maintaining target altitude within ±100 feet."
  },

  {
    id: "slow-flight",
    category: "In-Flight Practice Maneuvers",
    title: "Slow Flight Setup & Handling",
    description:
      "Reduce throttle and lower gear and full flaps to fly just above stall speed. Practice subtle bank turns and pitch changes at low airspeed.",
    success:
      "Aircraft remains stable without triggering a stall or losing control."
  },

  {
    id: "stall-recovery",
    category: "In-Flight Practice Maneuvers",
    title: "Stall Entry & Recovery Practice",
    description:
      "Pitch up with low throttle until the wing stalls. Recover immediately: pitch nose down below the horizon, apply full throttle, level wings, and clean up flaps as airspeed recovers.",
    success:
      "Control is restored with minimal altitude loss."
  },

  {
    id: "holding-patterns",
    category: "In-Flight Practice Maneuvers",
    title: "Holding Patterns",
    description:
      "Fly a timed racetrack pattern over a fixed location or waypoint using 1-minute legs.",
    success:
      "Standard rate turns complete exact 180-degree turn segments smoothly."
  },

  {
    id: "engine-failure",
    category: "In-Flight Practice Maneuvers",
    title: "Engine Failure Glide & Trim",
    description:
      "Reduce engine power to idle at high altitude to simulate engine loss. Trim pitch for best glide speed and maneuver toward the nearest runway.",
    success:
      "Aircraft reaches the runway threshold with sufficient altitude to land."
  },

  {
    id: "pattern-entry",
    category: "Circuit & Touch-and-Go Practice",
    title: "Pattern Entry & Approach",
    description:
      "Enter the downwind leg parallel to the runway. Establish glideslope on final approach using pitch for speed and power for descent rate.",
    success:
      "Line up cleanly with the runway centerline on final."
  },

  {
    id: "touch-and-go",
    category: "Circuit & Touch-and-Go Practice",
    title: "Touch-and-Go Execution",
    description:
      "Touch down main landing gear smoothly on the touchdown zone. Do not engage reverse thrust or brakes. Advance throttle to full power, set flaps to takeoff position, and rotate back into a climb.",
    success:
      "Smooth transition back into climb without runway overrun."
  }
];


/* =========================
   STATE
========================= */

let user = null;
let guest = false;

let currentMode = "full";
let advancedOpen = false;
let notesOpen = false;

let flightStartedAt = null;
let flightTimerInterval = null;
let completionSummary = null;

let practiceBuilderOpen = false;
let activePracticeId = null;

let state = {
  checks: {},
  skipped: {},
  advanced: {},
  info: {},
  notes: "",
  mode: "full"
};

let practiceState = {
  selected: [],
  checks: {},
  info: {},
  notes: "",
  title: "Practice Flight",
  createdAt: null
};


/* =========================
   HELPERS
========================= */

const $ = id => document.getElementById(id);

function mainKey() {
  return `pf9-${user ? user.id : "guest"}`;
}

function savedKey() {
  return `pf9-saved-${user ? user.id : "guest"}`;
}

function practiceKey() {
  return `pf9-practice-${user ? user.id : "guest"}`;
}

function save() {
  localStorage.setItem(mainKey(), JSON.stringify(state));
}

function formatTimer(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  return [
    hours,
    String(minutes).padStart(2, "0"),
    String(secs).padStart(2, "0")
  ].join(":");
}

function updateFlightTimer() {
  if (!$("flightTimer")) return;

  const seconds = completionSummary?.duration ??
    (state.finishedAt && state.durationSeconds != null
      ? state.durationSeconds
      : (flightStartedAt ? Math.floor((Date.now() - flightStartedAt) / 1000) : 0));

  $("flightTimer").textContent = formatTimer(seconds);
}

function updateStartFlightButtons() {
  const active = Boolean(flightStartedAt) && !state.finishedAt;
  const buttons = [$("startFlight")].filter(Boolean);

  buttons.forEach(button => {
    button.textContent = active ? "Flight Started" : "Start Flight";
    button.disabled = currentMode === "practice" || active || Boolean(state.finishedAt);
  });
}

function startFlight() {
  if (currentMode === "practice" || flightStartedAt || state.finishedAt) {
    return;
  }

  flightStartedAt = Date.now();
  state.startedAt = new Date(flightStartedAt).toISOString();
  state.finishedAt = null;
  state.durationSeconds = null;
  completionSummary = null;

  save();
  updateStartFlightButtons();
  startFlightTimer();
}

function startFlightTimer() {
  clearInterval(flightTimerInterval);
  updateFlightTimer();
  flightTimerInterval = setInterval(updateFlightTimer, 1000);
}

function stopFlightTimer() {
  clearInterval(flightTimerInterval);
  flightTimerInterval = null;
  updateFlightTimer();
  updateStartFlightButtons();
}

function savePracticeState() {
  localStorage.setItem(
    `pf9-active-practice-${user ? user.id : "guest"}`,
    JSON.stringify(practiceState)
  );
}


/* =========================
   CLOUD STORAGE
========================= */

async function syncCloudData() {
  if (!sb || !user) return;

  try {
    const [
      { data: cloudSaved, error: savedError },
      { data: cloudPractice, error: practiceError }
    ] = await Promise.all([
      sb.from("saved_flights")
        .select("id,title,state,completed,created_at,updated_at")
        .order("updated_at", { ascending: false }),
      sb.from("practice_flights")
        .select("id,title,data,created_at,updated_at")
        .order("updated_at", { ascending: false })
    ]);

    if (savedError) throw savedError;
    if (practiceError) throw practiceError;

    const localSaved = getSavedFlights();
    const localPractice = getPracticeFlights();

    if ((!cloudSaved || cloudSaved.length === 0) && localSaved.length) {
      for (const flight of localSaved) {
        await sb.from("saved_flights").insert({
          title: flight.title || "Saved Flight",
          state: flight.state || {},
          completed: Boolean(flight.state?.finishedAt || flight.completed)
        });
      }
    }

    if ((!cloudPractice || cloudPractice.length === 0) && localPractice.length) {
      for (const flight of localPractice) {
        await sb.from("practice_flights").insert({
          title: flight.title || "Practice Flight",
          data: flight.state || {}
        });
      }
    }

    const { data: savedRows, error: savedReloadError } = await sb
      .from("saved_flights")
      .select("id,title,state,completed,created_at,updated_at")
      .order("updated_at", { ascending: false })
      .limit(30);

    if (savedReloadError) throw savedReloadError;

    const { data: practiceRows, error: practiceReloadError } = await sb
      .from("practice_flights")
      .select("id,title,data,created_at,updated_at")
      .order("updated_at", { ascending: false })
      .limit(10);

    if (practiceReloadError) throw practiceReloadError;

    localStorage.setItem(
      savedKey(),
      JSON.stringify((savedRows || []).map(row => ({
        id: row.id,
        title: row.title,
        timestamp: row.updated_at || row.created_at,
        state: row.state || {},
        completed: Boolean(row.completed),
        cloudId: row.id
      })))
    );

    localStorage.setItem(
      practiceKey(),
      JSON.stringify((practiceRows || []).map(row => ({
        id: row.id,
        title: row.title,
        timestamp: row.updated_at || row.created_at,
        state: row.data || {},
        cloudId: row.id
      })))
    );

    renderSavedFlights();
    renderPracticeFlights();
  } catch (error) {
    console.error("Cloud flight sync failed:", error);
  }
}

async function syncSavedFlightsToCloud(flights) {
  if (!sb || !user) return;

  try {
    const { data: remote, error } = await sb
      .from("saved_flights")
      .select("id");

    if (error) throw error;

    const keepIds = new Set();

    for (const flight of flights.slice(0, 30)) {
      if (flight.cloudId) {
        keepIds.add(flight.cloudId);

        await sb
          .from("saved_flights")
          .update({
            title: flight.title || "Saved Flight",
            state: flight.state || {},
            completed: Boolean(flight.completed || flight.state?.finishedAt)
          })
          .eq("id", flight.cloudId);
      } else {
        const { data, error: insertError } = await sb
          .from("saved_flights")
          .insert({
            title: flight.title || "Saved Flight",
            state: flight.state || {},
            completed: Boolean(flight.completed || flight.state?.finishedAt)
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        flight.cloudId = data.id;
        keepIds.add(data.id);
      }
    }

    for (const row of remote || []) {
      if (!keepIds.has(row.id)) {
        await sb
          .from("saved_flights")
          .delete()
          .eq("id", row.id);
      }
    }

    localStorage.setItem(savedKey(), JSON.stringify(flights.slice(0, 30)));
  } catch (error) {
    console.error("Saved Flights cloud sync failed:", error);
  }
}

async function syncPracticeFlightsToCloud(flights) {
  if (!sb || !user) return;

  try {
    const { data: remote, error } = await sb
      .from("practice_flights")
      .select("id");

    if (error) throw error;

    const keepIds = new Set();

    for (const flight of flights.slice(0, 10)) {
      if (flight.cloudId) {
        keepIds.add(flight.cloudId);

        await sb
          .from("practice_flights")
          .update({
            title: flight.title || "Practice Flight",
            data: flight.state || {}
          })
          .eq("id", flight.cloudId);
      } else {
        const { data, error: insertError } = await sb
          .from("practice_flights")
          .insert({
            title: flight.title || "Practice Flight",
            data: flight.state || {}
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        flight.cloudId = data.id;
        keepIds.add(data.id);
      }
    }

    for (const row of remote || []) {
      if (!keepIds.has(row.id)) {
        await sb
          .from("practice_flights")
          .delete()
          .eq("id", row.id);
      }
    }

    localStorage.setItem(practiceKey(), JSON.stringify(flights.slice(0, 10)));
  } catch (error) {
    console.error("Practice Flights cloud sync failed:", error);
  }
}

async function touchActivity() {
  if (!sb || !user) return;

  const { error } = await sb.rpc("touch_user_activity", {
    p_user_id: user.id
  });

  if (error) {
    console.error("Activity update failed:", error);
  }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(mainKey()));

    if (saved) {
      state = {
        checks: saved.checks || {},
        skipped: saved.skipped || {},
        advanced: saved.advanced || {},
        info: saved.info || {},
        notes: saved.notes || "",
        mode: saved.mode || "full",
        startedAt: saved.startedAt || null,
        finishedAt: saved.finishedAt || null,
        durationSeconds: saved.durationSeconds || null
      };
    }
  } catch {}

  currentMode = state.mode || "full";

  flightStartedAt =
    state.startedAt
      ? Date.parse(state.startedAt)
      : null;

  if (state.finishedAt) {
    flightStartedAt = null;
  }

  if (flightStartedAt) {
    startFlightTimer();
  } else {
    stopFlightTimer();
  }

  updateStartFlightButtons();

  try {
    const active = JSON.parse(
      localStorage.getItem(
        `pf9-active-practice-${user ? user.id : "guest"}`
      )
    );

    if (active) {
      practiceState = {
        selected: active.selected || [],
        checks: active.checks || {},
        info: active.info || {},
        notes: active.notes || "",
        title: active.title || "Practice Flight",
        createdAt: active.createdAt || null
      };
    }
  } catch {}

  applyMode(false);
  render();
}

function msg(id, text) {
  $(id).textContent = text;
}

function screens(id) {
  ["auth", "registerScreen", "forgotScreen", "recoveryScreen"].forEach(screen => {
    $(screen).classList.toggle("hidden", screen !== id);
  });
}

function app() {
  screens("");
  $("app").classList.remove("hidden");
  load();
}

function guestCookie() {
  return document.cookie.includes("pf9_guest=1");
}

function setGuest() {
  document.cookie =
    "pf9_guest=1; Max-Age=31536000; Path=/; SameSite=Lax";
}

function sectionFor(id) {
  const keys = Object.keys(sections);

  return keys.find(
    title => id.startsWith(title + "-")
  ) || "";
}

function sectionComplete(title) {
  const items = sections[title] || [];

  return items.every((_, index) => {
    const id = `${title}-${index}`;

    return !!state.checks[id] || !!state.skipped[id];
  });
}

function allMainChecklistComplete() {
  return Object.keys(sections).every(sectionComplete);
}

function getFlightDuration() {
  if (!flightStartedAt) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor((Date.now() - flightStartedAt) / 1000)
  );
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs} seconds`;
  }

  if (secs === 0) {
    return `${mins} minute${mins === 1 ? "" : "s"}`;
  }

  return `${mins} minute${mins === 1 ? "" : "s"} ${secs} seconds`;
}


/* =========================
   RENDER MAIN CHECKLIST
========================= */

function render() {
  $("checklist").innerHTML = "";

  Object.entries(sections).forEach(([title, items]) => {
    const section = document.createElement("section");
    section.className = "panel checklist-section";

    if (sectionComplete(title)) {
      section.classList.add("section-complete");
    }

    const heading = document.createElement("div");
    heading.className = "section-heading";

    const headingText = document.createElement("div");

    const h2 = document.createElement("h2");
    h2.textContent = title;

    const status = document.createElement("small");
    status.className = "section-status";
    status.textContent = sectionComplete(title)
      ? "Complete"
      : "In progress";

    headingText.append(h2, status);
    heading.appendChild(headingText);
    section.appendChild(heading);

    const list = document.createElement("div");

    items.forEach((text, index) => {
      list.appendChild(
        item(text, `${title}-${index}`, false)
      );
    });

    section.appendChild(list);
    $("checklist").appendChild(section);
  });

  $("advancedList").innerHTML = "";

  advanced.forEach((text, index) => {
    $("advancedList").appendChild(
      item(text, `a-${index}`, true)
    );
  });

  ["aircraft", "flight", "server", "gate", "date"].forEach(id => {
    $(id).value = state.info[id] || "";
  });

  $("notes").value = state.notes || "";

  renderPracticeBuilder();
  renderActivePractice();
  progress();
}


/* =========================
   CHECKLIST ITEM
========================= */

function item(text, id, isAdvanced) {
  const row = document.createElement("div");
  row.className = "item-row";

  const label = document.createElement("label");
  label.className = "item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const checked = isAdvanced
    ? state.advanced[id]
    : state.checks[id];

  checkbox.checked = !!checked;

  const textSpan = document.createElement("span");
  textSpan.textContent = text;

  label.append(checkbox, textSpan);

  if (!isAdvanced) {
    if (state.skipped[id]) {
      row.classList.add("item-skipped");
    }

    if (checked) {
      row.classList.add("item-complete");
    }

    const skip = document.createElement("button");
    skip.type = "button";
    skip.className = "skip-button";
    skip.textContent = state.skipped[id]
      ? "Unskip"
      : "Skip";

    skip.onclick = event => {
      event.preventDefault();
      event.stopPropagation();

      if (state.skipped[id]) {
        delete state.skipped[id];
      } else {
        state.skipped[id] = true;
        delete state.checks[id];
      }

      save();
      render();

      const title = sectionFor(id);

      if (title && sectionComplete(title)) {
        autoAdvance(title);
      }

      if (allMainChecklistComplete()) {
        completeNormalFlight();
      }
    };

    row.append(label, skip);
  } else {
    row.appendChild(label);
  }

  checkbox.onchange = () => {
    if (isAdvanced) {
      state.advanced[id] = checkbox.checked;
    } else {
      state.checks[id] = checkbox.checked;

      if (checkbox.checked) {
        delete state.skipped[id];
      }
    }

    save();
    render();

    if (!isAdvanced) {
      const title = sectionFor(id);

      if (title && sectionComplete(title)) {
        autoAdvance(title);
      }

      if (allMainChecklistComplete()) {
        completeNormalFlight();
      }
    }
  };

  return row;
}


/* =========================
   AUTO ADVANCE
========================= */

function autoAdvance(title) {
  const titles = Object.keys(sections);
  const index = titles.indexOf(title);

  if (index === -1 || index >= titles.length - 1) {
    return;
  }

  setTimeout(() => {
    const panels =
      document.querySelectorAll(".checklist-section");

    panels[index + 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 150);
}


/* =========================
   PROGRESS
========================= */

function progress() {
  let total = 0;
  let done = 0;

  Object.entries(sections).forEach(([title, items]) => {
    items.forEach((_, index) => {
      total++;

      const id = `${title}-${index}`;

      if (
        state.checks[id] ||
        state.skipped[id]
      ) {
        done++;
      }
    });
  });

  if (advancedOpen) {
    total += advanced.length;

    done += advanced.filter((_, index) => {
      return state.advanced[`a-${index}`];
    }).length;
  }

  const percent = total
    ? Math.round((done / total) * 100)
    : 0;

  $("percent").textContent = percent + "%";
  $("bar").style.width = percent + "%";
  $("count").textContent =
    `${done} of ${total} complete`;
}


/* =========================
   FLIGHT MODES
========================= */

function applyMode(shouldRender = true) {
  const titles = {
    quick: "Quick Flight",
    full: "Full Flight",
    practice: "Practice Flight"
  };

  const descriptions = {
    quick:
      "Main checklist with Flight Information and Notes. Advanced Controls remain available when needed.",
    full:
      "Full checklist with Flight Information, Notes and optional Advanced Controls.",
    practice:
      "Choose specific procedures to practise. Practice flights are kept separate from normal saved flights."
  };

  $("modeTitle").textContent = titles[currentMode];
  $("modeDescription").textContent =
    descriptions[currentMode];
  $("modeLabel").textContent =
    titles[currentMode];

  $("quickMode").classList.toggle(
    "active-mode",
    currentMode === "quick"
  );

  $("fullMode").classList.toggle(
    "active-mode",
    currentMode === "full"
  );

  $("practiceMode").classList.toggle(
    "active-mode",
    currentMode === "practice"
  );

  const isPractice = currentMode === "practice";

  $("checklist").classList.toggle(
    "hidden",
    isPractice && !activePracticeId
  );

  $("practiceBuilder").classList.toggle(
    "hidden",
    !isPractice || !!activePracticeId
  );

  $("practiceChecklistPanel").classList.toggle(
    "hidden",
    !isPractice || !activePracticeId
  );

  $("saveFlight").classList.toggle(
    "hidden",
    isPractice
  );

  $("advanced").classList.remove("hidden");

  if (shouldRender) {
    render();
  }
}

function setMode(mode) {
  if (currentMode === mode) {
    return;
  }

  currentMode = mode;
  state.mode = mode;
  save();

  if (mode !== "practice") {
    activePracticeId = null;
  }

  applyMode(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   PRACTICE BUILDER
========================= */

function renderPracticeBuilder() {
  const container = $("practiceOptions");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const categories = [
    "In-Flight Practice Maneuvers",
    "Circuit & Touch-and-Go Practice"
  ];

  categories.forEach(category => {
    const group = document.createElement("div");
    group.className = "practice-option-group";

    const heading = document.createElement("h3");
    heading.textContent = category;

    group.appendChild(heading);

    practiceManeuvers
      .filter(item => item.category === category)
      .forEach(maneuver => {
        const label = document.createElement("label");
        label.className = "practice-option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked =
          practiceState.selected.includes(
            maneuver.id
          );

        checkbox.onchange = () => {
          if (checkbox.checked) {
            if (
              !practiceState.selected.includes(
                maneuver.id
              )
            ) {
              practiceState.selected.push(
                maneuver.id
              );
            }
          } else {
            practiceState.selected =
              practiceState.selected.filter(
                id => id !== maneuver.id
              );

            delete practiceState.checks[
              maneuver.id
            ];
          }

          savePracticeState();
          renderPracticeBuilder();
        };

        const content =
          document.createElement("div");

        content.className =
          "practice-option-content";

        const title =
          document.createElement("span");

        title.className =
          "practice-option-title";

        title.textContent =
          maneuver.title;

        const description =
          document.createElement("span");

        description.className =
          "practice-option-description";

        description.textContent =
          maneuver.description;

        const success =
          document.createElement("span");

        success.className =
          "practice-success";

        success.textContent =
          `Success Check: ${maneuver.success}`;

        content.append(
          title,
          description,
          success
        );

        label.append(
          checkbox,
          content
        );

        group.appendChild(label);
      });

    container.appendChild(group);
  });

  $("practiceSelectedCount").textContent =
    `${practiceState.selected.length} selected`;

  $("startPractice").disabled =
    practiceState.selected.length === 0;
}


/* =========================
   START PRACTICE
========================= */

function startPracticeFlight() {
  if (!practiceState.selected.length) {
    return;
  }

  const title =
    state.info.flight ||
    state.info.aircraft ||
    "Practice Flight";

  activePracticeId = Date.now();

  practiceState.title = title;
  practiceState.createdAt =
    new Date().toISOString();

  practiceState.checks = {};

  practiceState.selected.forEach(id => {
    practiceState.checks[id] = false;
  });

  savePracticeState();

  currentMode = "practice";
  state.mode = "practice";
  save();

  applyMode(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   ACTIVE PRACTICE
========================= */

function renderActivePractice() {
  const container = $("practiceChecklist");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!activePracticeId) {
    return;
  }

  const selected = practiceState.selected
    .map(id =>
      practiceManeuvers.find(
        maneuver => maneuver.id === id
      )
    )
    .filter(Boolean);

  $("practiceTitle").textContent =
    practiceState.title ||
    "Practice Flight";

  const completed =
    selected.filter(maneuver =>
      practiceState.checks[maneuver.id]
    ).length;

  $("practiceSubtitle").textContent =
    `${completed} of ${selected.length} practice maneuvers complete.`;

  selected.forEach(maneuver => {
    const card =
      document.createElement("div");

    card.className = "practice-item";

    if (practiceState.checks[maneuver.id]) {
      card.classList.add(
        "practice-complete"
      );
    }

    const header =
      document.createElement("div");

    header.className =
      "practice-item-header";

    const title =
      document.createElement("h3");

    title.className =
      "practice-item-title";

    title.textContent =
      maneuver.title;

    const status =
      document.createElement("span");

    status.className =
      "practice-item-status";

    if (practiceState.checks[maneuver.id]) {
      status.classList.add("complete");
      status.textContent = "Complete";
    } else {
      status.textContent = "In progress";
    }

    header.append(title, status);

    const description =
      document.createElement("p");

    description.textContent =
      maneuver.description;

    const success =
      document.createElement("p");

    success.className = "success";

    success.textContent =
      `Success Check: ${maneuver.success}`;

    const checkLabel =
      document.createElement("label");

    checkLabel.className =
      "practice-check";

    const checkbox =
      document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked =
      !!practiceState.checks[
        maneuver.id
      ];

    const checkText =
      document.createElement("span");

    checkText.textContent =
      "Practice maneuver complete";

    checkbox.onchange = () => {
      practiceState.checks[
        maneuver.id
      ] = checkbox.checked;

      savePracticeState();
      renderActivePractice();

      if (
        practiceState.selected.length &&
        practiceState.selected.every(
          id => practiceState.checks[id]
        )
      ) {
        completePracticeFlight();
      }
    };

    checkLabel.append(
      checkbox,
      checkText
    );

    card.append(
      header,
      description,
      success,
      checkLabel
    );

    container.appendChild(card);
  });
}


/* =========================
   PRACTICE COMPLETION
========================= */

function completePracticeFlight() {
  const selected =
    practiceState.selected.length;

  if (!selected) {
    return;
  }

  const completed =
    practiceState.selected.filter(
      id => practiceState.checks[id]
    ).length;

  if (completed !== selected) {
    return;
  }

  const flights =
    getPracticeFlights();

  const existing =
    flights.find(
      flight =>
        flight.id === activePracticeId
    );

  if (!existing) {
    flights.unshift({
      id: activePracticeId,
      title:
        practiceState.title ||
        "Practice Flight",
      timestamp:
        practiceState.createdAt ||
        new Date().toISOString(),
      state: JSON.parse(
        JSON.stringify(practiceState)
      )
    });

    if (flights.length > 10) {
      flights.length = 10;
    }

    setPracticeFlights(flights);
  }

  renderPracticeFlights();

  setTimeout(() => {
    alert(
      "Practice flight complete."
    );
  }, 100);
}


/* =========================
   PRACTICE SAVED FLIGHTS
========================= */

function getPracticeFlights() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(
          practiceKey()
        )
      ) || []
    );
  } catch {
    return [];
  }
}

function setPracticeFlights(flights) {
  localStorage.setItem(
    practiceKey(),
    JSON.stringify(flights)
  );

  if (user) {
    void syncPracticeFlightsToCloud(flights);
  }
}

function savePracticeCurrent() {
  if (!practiceState.selected.length) {
    return;
  }

  const flights =
    getPracticeFlights();

  const saved = {
    id: Date.now(),
    title:
      practiceState.title ||
      "Practice Flight",
    timestamp:
      new Date().toISOString(),
    state: JSON.parse(
      JSON.stringify(practiceState)
    )
  };

  flights.unshift(saved);

  if (flights.length > 10) {
    flights.length = 10;
  }

  setPracticeFlights(flights);
  if (user) {
    void syncPracticeFlightsToCloud(flights);
  }
  renderPracticeFlights();
}

function renderPracticeFlights() {
  const list =
    $("practiceSavedList");

  list.innerHTML = "";

  const flights =
    getPracticeFlights();

  if (!flights.length) {
    const empty =
      document.createElement("div");

    empty.className =
      "empty-saved";

    empty.textContent =
      "No saved practice flights yet.";

    list.appendChild(empty);

    return;
  }

  flights.forEach(flight => {
    const row =
      document.createElement("div");

    row.className =
      "saved-flight";

    const info =
      document.createElement("div");

    const title =
      document.createElement("strong");

    title.textContent =
      flight.title;

    const date =
      document.createElement("small");

    try {
      date.textContent =
        new Date(
          flight.timestamp
        ).toLocaleString();
    } catch {
      date.textContent = "";
    }

    info.append(title, date);

    const actions =
      document.createElement("div");

    actions.className =
      "saved-actions";

    const open =
      document.createElement("button");

    open.type = "button";
    open.textContent = "Open";

    open.onclick = () => {
      practiceState =
        JSON.parse(
          JSON.stringify(
            flight.state
          )
        );

      activePracticeId =
        flight.id;

      currentMode =
        "practice";

      state.mode =
        "practice";

      save();
      savePracticeState();

      applyMode(true);

      $("practiceDialog").close();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

    const edit =
      document.createElement("button");

    edit.type = "button";
    edit.textContent = "Edit";

    edit.onclick = () => {
      practiceState =
        JSON.parse(
          JSON.stringify(
            flight.state
          )
        );

      activePracticeId =
        null;

      currentMode =
        "practice";

      state.mode =
        "practice";

      save();
      savePracticeState();

      applyMode(true);

      $("practiceDialog").close();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

    const remove =
      document.createElement("button");

    remove.type = "button";
    remove.className =
      "delete-button";

    remove.textContent =
      "Delete";

    remove.onclick = () => {
      const updated =
        getPracticeFlights()
          .filter(
            saved =>
              saved.id !==
              flight.id
          );

      setPracticeFlights(
        updated
      );

      renderPracticeFlights();
    };

    actions.append(
      open,
      edit,
      remove
    );

    row.append(
      info,
      actions
    );

    list.appendChild(row);
  });
}


/* =========================
   EDIT PRACTICE
========================= */

$("editPractice").onclick = () => {
  activePracticeId = null;

  currentMode =
    "practice";

  state.mode =
    "practice";

  save();
  applyMode(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};


/* =========================
   NORMAL FLIGHT COMPLETION
========================= */

function getNormalCounts() {
  let completed = 0;
  let skipped = 0;

  Object.entries(sections).forEach(
    ([title, items]) => {
      items.forEach((_, index) => {
        const id =
          `${title}-${index}`;

        if (state.checks[id]) {
          completed++;
        }

        if (state.skipped[id]) {
          skipped++;
        }
      });
    }
  );

  return {
    completed,
    skipped
  };
}

function completeNormalFlight() {
  if (
    currentMode === "practice" ||
    completionSummary ||
    !flightStartedAt
  ) {
    return;
  }

  const counts =
    getNormalCounts();

  const duration =
    getFlightDuration();

  state.finishedAt =
    new Date().toISOString();

  state.durationSeconds =
    duration;

  completionSummary = {
    completed:
      counts.completed,
    skipped:
      counts.skipped,
    duration,
    aircraft:
      state.info.aircraft || "Not entered",
    flight:
      state.info.flight || "Not entered",
    notes:
      state.notes || ""
  };

  save();

  renderSummary();

  stopFlightTimer();

  $("summaryDialog").showModal();
}

function renderSummary() {
  const summary =
    completionSummary;

  if (!summary) {
    return;
  }

  $("summaryContent").innerHTML = "";

  const completeMessage =
    document.createElement("div");

  completeMessage.className =
    "summary-complete";

  const completeStrong =
    document.createElement("strong");

  completeStrong.textContent =
    "All main checklist items are complete.";

  completeMessage.appendChild(
    completeStrong
  );

  const grid =
    document.createElement("div");

  grid.className =
    "summary-grid";

  const rows = [
    ["Aircraft", summary.aircraft],
    ["Flight", summary.flight],
    ["Duration", formatDuration(summary.duration)],
    ["Checklist", "100%"],
    ["Skipped", summary.skipped]
  ];

  rows.forEach(([label, value]) => {
    const row =
      document.createElement("div");

    row.className =
      "summary-row";

    const strong =
      document.createElement("strong");

    strong.textContent =
      label;

    const span =
      document.createElement("span");

    span.textContent =
      value;

    row.append(
      strong,
      span
    );

    grid.appendChild(row);
  });

  const notes =
    document.createElement("div");

  notes.className =
    "summary-notes";

  const notesTitle =
    document.createElement("strong");

  notesTitle.textContent =
    "Notes";

  const notesText =
    document.createElement("p");

  notesText.textContent =
    summary.notes ||
    "No notes entered.";

  notes.append(
    notesTitle,
    notesText
  );

  $("summaryContent").append(
    completeMessage,
    grid,
    notes
  );
}


/* =========================
   SAVED NORMAL FLIGHTS
========================= */

function getSavedFlights() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(
          savedKey()
        )
      ) || []
    );
  } catch {
    return [];
  }
}

function setSavedFlights(flights) {
  localStorage.setItem(
    savedKey(),
    JSON.stringify(flights)
  );

  if (user) {
    void syncSavedFlightsToCloud(flights);
  }
}

function saveCurrentFlight() {
  const flights =
    getSavedFlights();

  const title =
    state.info.flight ||
    state.info.aircraft ||
    state.info.server ||
    "Untitled Flight";

  const saved = {
    id: Date.now(),
    title,
    timestamp:
      new Date().toISOString(),
    state: JSON.parse(
      JSON.stringify(state)
    )
  };

  flights.unshift(saved);

  if (flights.length > 30) {
    flights.length = 30;
  }

  setSavedFlights(flights);

  if (user) {
    void syncSavedFlightsToCloud(flights);
  }

  const button =
    $("saveFlight");

  const original =
    button.textContent;

  button.textContent =
    "Flight Saved";

  setTimeout(() => {
    button.textContent =
      original;
  }, 1500);
}

function saveCompletedSummary() {
  if (!completionSummary) {
    return;
  }

  state.finishedAt =
    state.finishedAt ||
    new Date().toISOString();

  state.durationSeconds =
    completionSummary.duration;

  saveCurrentFlight();

  const button =
    $("saveSummary");

  const original =
    button.textContent;

  button.textContent =
    "Summary Saved";

  setTimeout(() => {
    button.textContent =
      original;
  }, 1500);
}

function renderSavedFlights() {
  const list =
    $("savedList");

  const flights =
    getSavedFlights();

  list.innerHTML = "";

  if (!flights.length) {
    const empty =
      document.createElement("div");

    empty.className =
      "empty-saved";

    empty.textContent =
      "No saved flights yet.";

    list.appendChild(empty);

    return;
  }

  flights.forEach(flight => {
    const row =
      document.createElement("div");

    row.className =
      "saved-flight";

    const info =
      document.createElement("div");

    const title =
      document.createElement("strong");

    title.textContent =
      flight.title;

    const date =
      document.createElement("small");

    try {
      date.textContent =
        new Date(
          flight.timestamp
        ).toLocaleString();
    } catch {
      date.textContent = "";
    }

    info.append(
      title,
      date
    );

    const actions =
      document.createElement("div");

    actions.className =
      "saved-actions";

    const open =
      document.createElement("button");

    open.type = "button";
    open.textContent =
      "Open";

    open.onclick = () => {
      state =
        JSON.parse(
          JSON.stringify(
            flight.state
          )
        );

      currentMode =
        state.mode ||
        "full";

      completionSummary =
        null;

      flightStartedAt =
        state.finishedAt
          ? null
          : (state.startedAt
              ? Date.parse(state.startedAt)
              : null);

      save();

      if (flightStartedAt) {
        startFlightTimer();
      } else {
        stopFlightTimer();
      }

      updateStartFlightButtons();
      applyMode(true);

      $("savedDialog").close();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

    const remove =
      document.createElement("button");

    remove.type = "button";
    remove.className =
      "delete-button";

    remove.textContent =
      "Delete";

    remove.onclick = () => {
      const updated =
        getSavedFlights()
          .filter(
            saved =>
              saved.id !==
              flight.id
          );

      setSavedFlights(
        updated
      );

      renderSavedFlights();
    };

    actions.append(
      open,
      remove
    );

    row.append(
      info,
      actions
    );

    list.appendChild(row);
  });
}


/* =========================
   FLIGHT STATISTICS
========================= */

function formatLongDuration(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function getFlightStatistics() {
  const completedFlights =
    getSavedFlights().filter(flight =>
      Boolean(
        flight.state?.finishedAt ||
        flight.state?.durationSeconds
      )
    );

  const durations =
    completedFlights.map(flight =>
      Number(flight.state?.durationSeconds || 0)
    );

  const totalSeconds =
    durations.reduce(
      (sum, value) => sum + value,
      0
    );

  const aircraftCounts = {};

  completedFlights.forEach(flight => {
    const aircraft =
      String(flight.state?.info?.aircraft || "").trim();

    if (aircraft) {
      aircraftCounts[aircraft] =
        (aircraftCounts[aircraft] || 0) + 1;
    }
  });

  const aircraftEntries =
    Object.entries(aircraftCounts)
      .sort((a, b) => b[1] - a[1]);

  return {
    flightsCompleted:
      completedFlights.length,
    totalSeconds,
    mostUsedAircraft:
      aircraftEntries[0]?.[0] || "Not enough data",
    averageSeconds:
      durations.length
        ? totalSeconds / durations.length
        : 0
  };
}

function renderFlightStatistics() {
  const stats =
    getFlightStatistics();

  const values = [
    ["Flights completed", stats.flightsCompleted],
    ["Total flight time", formatLongDuration(stats.totalSeconds)],
    ["Most used aircraft", stats.mostUsedAircraft],
    ["Average flight duration", formatLongDuration(stats.averageSeconds)]
  ];

  $("statisticsContent").innerHTML = "";

  const grid =
    document.createElement("div");

  grid.className =
    "stats-grid";

  values.forEach(([label, value]) => {
    const card =
      document.createElement("div");

    card.className =
      "stats-card";

    const strong =
      document.createElement("strong");

    strong.textContent =
      label;

    const valueElement =
      document.createElement("span");

    valueElement.textContent =
      value;

    card.append(
      strong,
      valueElement
    );

    grid.appendChild(card);
  });

  $("statisticsContent").appendChild(grid);
}

/* =========================
   AUTH
========================= */

async function startUser(u) {
  user = u;
  guest = false;

  $("account").textContent =
    u.email || "Account";

  app();

  await touchActivity();
  await syncCloudData();
}

async function startGuest() {
  if (sb) {
    await sb.auth.signOut();
  }

  user = null;
  guest = true;

  setGuest();

  $("account").textContent =
    "Guest";

  app();
}

$("login").onsubmit =
  async event => {
    event.preventDefault();

    if (!sb) {
      return msg(
        "message",
        "Add your Supabase publishable key in config.js first."
      );
    }

    msg(
      "message",
      "Logging in..."
    );

    const { error } =
      await sb.auth.signInWithPassword({
        email:
          $("email").value.trim(),
        password:
          $("password").value
      });

    if (error) {
      msg(
        "message",
        error.message
      );
    }
  };

$("register").onclick =
  () => {
    screens(
      "registerScreen"
    );
  };

$("forgot").onclick =
  () => {
    screens(
      "forgotScreen"
    );
  };

$("guest").onclick =
  startGuest;

$("backRegister").onclick =
  () => {
    screens("auth");
  };

$("backForgot").onclick =
  () => {
    screens("auth");
  };

$("registerForm").onsubmit =
  async event => {
    event.preventDefault();

    if (!sb) {
      return msg(
        "registerMessage",
        "Supabase is not configured yet."
      );
    }

    if (
      $("regPassword").value !==
      $("regConfirm").value
    ) {
      return msg(
        "registerMessage",
        "Passwords do not match."
      );
    }

    const {
      data,
      error
    } =
      await sb.auth.signUp({
        email:
          $("regEmail").value.trim(),
        password:
          $("regPassword").value,
        options: {
          emailRedirectTo:
            location.origin +
            location.pathname
        }
      });

    if (error) {
      return msg(
        "registerMessage",
        error.message
      );
    }

    if (data.session) {
      startUser(
        data.session.user
      );
    } else {
      msg(
        "registerMessage",
        "Account created. Check your email to confirm your account."
      );
    }
  };

$("forgotForm").onsubmit =
  async event => {
    event.preventDefault();

    if (!sb) {
      return msg(
        "forgotMessage",
        "Supabase is not configured yet."
      );
    }

    const {
      error
    } =
      await sb.auth.resetPasswordForEmail(
        $("forgotEmail").value.trim(),
        {
          redirectTo:
            location.origin +
            location.pathname
        }
      );

    msg(
      "forgotMessage",
      error
        ? error.message
        : "Reset email sent. Check your inbox."
    );
  };

$("recoveryForm").onsubmit =
  async event => {
    event.preventDefault();

    if (!sb) {
      return;
    }

    if (
      $("newPassword").value !==
      $("newConfirm").value
    ) {
      return msg(
        "recoveryMessage",
        "Passwords do not match."
      );
    }

    const { error } =
      await sb.auth.updateUser({
        password:
          $("newPassword").value
      });

    if (error) {
      return msg(
        "recoveryMessage",
        error.message
      );
    }

    msg(
      "recoveryMessage",
      "Password updated."
    );

    setTimeout(
      () => app(),
      700
    );
  };


/* =========================
   MODE BUTTONS
========================= */

$("quickMode").onclick =
  () => setMode("quick");

$("fullMode").onclick =
  () => setMode("full");

$("practiceMode").onclick =
  () => setMode("practice");

$("flightModeButton").onclick =
  () => {
    $("quickMode").focus();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


/* =========================
   ADVANCED
========================= */

$("advanced").onclick =
  () => {
    advancedOpen =
      !advancedOpen;

    $("advancedPanel")
      .classList.toggle(
        "hidden",
        !advancedOpen
      );

    $("advanced").textContent =
      advancedOpen
        ? "Hide Advanced"
        : "Advanced";

    progress();
  };


/* =========================
   NOTES
========================= */

$("notesToggle").onclick =
  () => {
    notesOpen =
      !notesOpen;

    $("notesPage")
      .classList.toggle(
        "hidden",
        !notesOpen
      );

    $("notesToggle").textContent =
      notesOpen
        ? "Hide Notes"
        : "Notes";
  };

$("notes").oninput =
  () => {
    state.notes =
      $("notes").value;

    save();
  };


/* =========================
   SAVED FLIGHTS
========================= */

$("menuButton").onclick =
  () => {
    $("menuDialog").showModal();
  };

$("closeMenu").onclick =
  () => {
    $("menuDialog").close();
  };

$("menuSavedFlights").onclick =
  () => {
    $("menuDialog").close();
    $("savedFlights").click();
  };

$("menuPracticeFlights").onclick =
  () => {
    $("menuDialog").close();
    $("practiceFlights").click();
  };

$("menuStatistics").onclick =
  () => {
    $("menuDialog").close();
    $("statistics").click();
  };

$("menuAdvanced").onclick =
  () => {
    $("menuDialog").close();
    $("advanced").click();
  };

$("startFlight").onclick = startFlight;

$("savedFlights").onclick =
  () => {
    renderSavedFlights();

    $("savedDialog")
      .showModal();
  };

$("closeSaved").onclick =
  () => {
    $("savedDialog")
      .close();
  };

$("saveFlight").onclick =
  saveCurrentFlight;


/* =========================
   PRACTICE FLIGHTS
========================= */

$("practiceFlights").onclick =
  () => {
    renderPracticeFlights();

    $("practiceDialog")
      .showModal();
  };

$("closePracticeDialog").onclick =
  () => {
    $("practiceDialog")
      .close();
  };

$("statistics").onclick =
  () => {
    renderFlightStatistics();
    $("statisticsDialog").showModal();
  };

$("closeStatistics").onclick =
  () => {
    $("statisticsDialog").close();
  };

$("startPractice").onclick =
  startPracticeFlight;


/* =========================
   SUMMARY
========================= */

$("saveSummary").onclick =
  saveCompletedSummary;

$("closeSummary").onclick =
  () => {
    $("summaryDialog")
      .close();
  };

$("finishSummary").onclick =
  () => {
    $("summaryDialog")
      .close();
  };


/* =========================
   LOGOUT
========================= */

$("logout").onclick =
  async () => {
    if (sb) {
      await sb.auth.signOut();
    }

    user = null;
    guest = false;

    $("app")
      .classList.add("hidden");

    screens("auth");
  };


/* =========================
   FLIGHT INFORMATION
========================= */

[
  "aircraft",
  "flight",
  "server",
  "gate",
  "date"
].forEach(id => {
  $(id).oninput =
    () => {
      state.info[id] =
        $(id).value;

      save();
    };
});


/* =========================
   RESET
========================= */

$("endFlight").onclick =
  () => {
    $("dialog")
      .showModal();
  };

$("cancel").onclick =
  () => {
    $("dialog")
      .close();
  };

$("confirm").onclick =
  () => {
    state = {
      checks: {},
      skipped: {},
      advanced: {},
      info: {},
      notes: "",
      mode: currentMode,
      startedAt: Date.now(),
      finishedAt: null,
      durationSeconds: null
    };

    flightStartedAt = null;
    stopFlightTimer();

    practiceState = {
      selected: [],
      checks: {},
      info: {},
      notes: "",
      title: "Practice Flight",
      createdAt: null
    };

    activePracticeId = null;
    completionSummary = null;
    flightStartedAt = null;

    save();
    updateStartFlightButtons();
    savePracticeState();

    advancedOpen = false;
    notesOpen = false;

    $("advancedPanel")
      .classList.add("hidden");

    $("advanced").textContent =
      "Advanced";

    $("notesPage")
      .classList.add("hidden");

    $("notesToggle").textContent =
      "Notes";

    $("dialog")
      .close();

    applyMode(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


/* =========================
   INITIALISE
========================= */

async function init() {
  flightStartedAt = null;

  if (!sb) {
    msg(
      "message",
      "Add your Supabase publishable key in config.js first."
    );

    return;
  }

  const {
    data: {
      session
    }
  } =
    await sb.auth.getSession();

  if (session?.user) {
    startUser(
      session.user
    );
  } else if (
    guestCookie()
  ) {
    startGuest();
  } else {
    screens("auth");
  }

  sb.auth.onAuthStateChange(
    (event, session) => {
      if (
        event ===
        "PASSWORD_RECOVERY"
      ) {
        screens(
          "recoveryScreen"
        );
      } else if (
        session?.user
      ) {
        // Do not make Supabase calls directly inside
        // onAuthStateChange. Supabase documents that
        // async Supabase calls inside this callback can
        // cause the client to deadlock.
        setTimeout(() => {
          void startUser(session.user);
        }, 0);
      }
    }
  );
}

init();
