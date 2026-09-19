const STORAGE_KEY = "project-flight-update-9-checklist-v1";

const sections = [
  {
    title: "PREFLIGHT / FLIGHT SETUP",
    groups: [
      ["Server", [
        "Correct server selected",
        "Server region checked",
        "Player activity checked",
        "ATC activity checked, if displayed"
      ]],
      ["Aircraft", [
        "Aircraft selected",
        "Correct livery selected",
        "Departure airport selected",
        "Departure gate selected",
        "Gate view checked",
        "Destination / flight path set as required"
      ]],
      ["HUD / Flight Information", [
        "Speed indicator visible",
        "Altitude indicator visible",
        "Heading indicator visible",
        "Wind direction checked",
        "Wind speed checked",
        "Minimap visible",
        "Active flight path visible"
      ]]
    ]
  },
  {
    title: "STARTUP",
    groups: [
      ["Aircraft", ["Aircraft powered / ready", "Flight instruments checked"]],
      ["Lights", ["Navigation - ON", "Logo - ON / as required", "Beacon - ON", "Strobe - OFF", "Taxi - OFF", "Landing - OFF"]],
      ["Engine / Aircraft Start", ["Engines started using aircraft's available controls"]]
    ]
  },
  {
    title: "PUSHBACK",
    groups: [
      ["Pushback", ["Pushback started, if available", "Aircraft moving correctly", "Surrounding aircraft checked on minimap"]],
      ["Lights", ["Navigation - ON", "Logo - ON / as required", "Beacon - ON", "Strobe - OFF", "Taxi - OFF", "Landing - OFF"]]
    ]
  },
  {
    title: "BEFORE TAXI",
    groups: [
      ["Flight Information", ["Speed - checked", "Altitude - checked", "Heading - checked", "Wind direction - checked", "Wind speed - checked", "Active flight path - checked"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Logo - ON / as required", "Taxi - ON", "Landing - OFF", "Strobe - OFF"]]
    ]
  },
  {
    title: "TAXI",
    groups: [
      ["Taxi", ["Taxi using throttle and ground handling", "Maintain appropriate taxi speed", "Maintain taxi heading", "Follow active flight path where applicable", "Maintain awareness of surrounding aircraft on the minimap", "Account for wind conditions"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Logo - ON / as required", "Taxi - ON", "Landing - OFF", "Strobe - OFF"]]
    ]
  },
  {
    title: "BEFORE TAKEOFF",
    groups: [
      ["Flight Information", ["Speed - checked", "Altitude - checked", "Heading - checked", "Wind direction - checked", "Wind speed - checked", "Minimap - checked", "Active flight path - checked"]],
      ["Aircraft Configuration", ["Landing gear - checked / configured if available", "Flaps - checked / configured if available"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Logo - ON / as required", "Taxi - ON", "Landing - ON", "Strobe - ON"]]
    ]
  },
  {
    title: "TAKEOFF",
    groups: [
      ["Takeoff", ["Aircraft aligned with runway", "Increase throttle", "Maintain required takeoff speed", "Maintain directional control", "Rotate using pitch control", "Establish positive climb", "Maintain required climb attitude", "Maintain assigned heading", "Account for wind conditions"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Logo - ON / as required", "Strobe - ON", "Landing - ON", "Taxi - ON / aircraft dependent"]]
    ]
  },
  {
    title: "AFTER TAKEOFF",
    groups: [
      ["After Takeoff", ["Maintain positive climb", "Gear - UP if available", "Flaps - adjusted if available", "Maintain required speed", "Maintain required altitude", "Maintain assigned heading", "Account for wind conditions"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Strobe - ON", "Logo - as required", "Taxi - OFF", "Landing - OFF when no longer required"]]
    ]
  },
  {
    title: "CLIMB",
    groups: [
      ["Climb", ["Maintain climb", "Maintain required speed", "Maintain required altitude", "Maintain assigned heading", "Account for wind direction and speed"]],
      ["Autopilot", ["Autopilot available on aircraft - checked", "Autopilot engaged if desired", "Follow selected autopilot flight path / modes", "Monitor autopilot operation while in use", "Manual controls ready if autopilot is disconnected"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Strobe - ON", "Logo - as required", "Taxi - OFF", "Landing - OFF"]]
    ]
  },
  {
    title: "CRUISE",
    groups: [
      ["Cruise", ["Maintain cruise altitude", "Maintain cruise speed", "Maintain assigned heading", "Follow the active flight path", "Maintain awareness of weather conditions"]],
      ["Autopilot", ["Autopilot monitored if in use", "Verify aircraft remains on intended flight path", "Verify selected altitude is maintained", "Verify selected heading is maintained", "Verify required speed is maintained"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Strobe - ON", "Logo - as required", "Taxi - OFF", "Landing - OFF"]]
    ]
  },
  {
    title: "DESCENT",
    groups: [
      ["Descent", ["Begin descent", "Maintain required descent altitude", "Maintain required speed", "Maintain assigned heading", "Account for wind conditions", "Maintain awareness of weather conditions", "Maintain awareness of surrounding aircraft on the minimap", "Follow the active flight path"]],
      ["Autopilot", ["Autopilot monitored if in use", "Follow selected descent path", "Verify selected altitude is maintained", "Verify required speed is maintained", "Verify assigned heading is maintained"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Strobe - ON", "Logo - ON / as required", "Taxi - OFF", "Landing - OFF until required"]]
    ]
  },
  {
    title: "APPROACH",
    groups: [
      ["Approach", ["Destination airport identified", "Follow the active flight path", "Maintain awareness of surrounding aircraft on the minimap", "Maintain assigned heading", "Maintain required altitude", "Maintain approach speed", "Account for wind direction and speed", "Maintain awareness of weather conditions"]],
      ["Aircraft Configuration", ["Flaps - configured if available", "Landing gear - DOWN if available", "Maintain required speed after configuration"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Strobe - ON", "Logo - ON", "Taxi - ON when required", "Landing - ON"]]
    ]
  },
  {
    title: "FINAL APPROACH",
    groups: [
      ["Final Approach", ["Aircraft aligned with runway", "Maintain runway alignment", "Maintain approach speed", "Maintain required altitude", "Maintain assigned heading", "Account for wind conditions", "Follow the active flight path", "Maintain awareness of surrounding aircraft on the minimap"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Strobe - ON", "Logo - ON", "Taxi - ON", "Landing - ON"]]
    ]
  },
  {
    title: "LANDING",
    groups: [
      ["Landing", ["Maintain runway alignment", "Maintain landing speed", "Reduce throttle as required", "Touch down", "Maintain directional control", "Apply braking"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Strobe - ON", "Logo - ON", "Taxi - ON", "Landing - ON"]]
    ]
  },
  {
    title: "AFTER LANDING",
    groups: [
      ["After Landing", ["Aircraft slowed", "Runway vacated", "Follow taxi route on minimap", "Maintain awareness of surrounding aircraft", "Maintain appropriate ground handling"]],
      ["Aircraft", ["Flaps - retracted if available", "Gear - remains DOWN"]],
      ["Lights", ["Strobe - OFF", "Landing - OFF", "Taxi - ON", "Navigation - ON", "Beacon - ON", "Logo - ON / as required"]]
    ]
  },
  {
    title: "TAXI TO GATE",
    groups: [
      ["Taxi to Gate", ["Maintain appropriate taxi speed", "Maintain taxi heading", "Maintain awareness of surrounding aircraft on the minimap", "Follow active flight path where applicable"]],
      ["Lights", ["Navigation - ON", "Beacon - ON", "Logo - ON / as required", "Taxi - ON", "Landing - OFF", "Strobe - OFF"]]
    ]
  },
  {
    title: "AT GATE / PARKING",
    groups: [
      ["Parking", ["Aircraft positioned at gate", "Aircraft stopped", "Parking position checked"]],
      ["Lights", ["Strobe - OFF", "Landing - OFF", "Taxi - OFF", "Beacon - OFF", "Navigation - OFF", "Logo - OFF"]]
    ]
  },
  {
    title: "SHUTDOWN / FLIGHT COMPLETE",
    groups: [
      ["Shutdown", ["Aircraft stopped", "Throttle - idle / aircraft-specific", "Engines shut down using available aircraft controls", "Aircraft fully parked"]],
      ["Final Lights", ["Logo - OFF", "Strobe - OFF", "Beacon - OFF", "Navigation - OFF", "Taxi - OFF", "Landing - OFF"]],
      ["Flight Complete", ["Aircraft parked", "All Project Flight exterior lights OFF", "Flight complete"]]
    ]
  }
];

const advancedItems = [
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

const state = loadState();

const checklistEl = document.getElementById("checklist");
const advancedChecklistEl = document.getElementById("advancedChecklist");
const progressTextEl = document.getElementById("progressText");
const progressPercentEl = document.getElementById("progressPercent");
const progressBarEl = document.getElementById("progressBar");
const flightInfoPanel = document.getElementById("flightInfoPanel");
const advancedPanel = document.getElementById("advancedPanel");
const flightInfoToggle = document.getElementById("flightInfoToggle");
const advancedToggle = document.getElementById("advancedToggle");
const resetDialog = document.getElementById("resetDialog");

renderChecklist();
renderAdvanced();
restoreFields();
updateProgress();

document.querySelectorAll("[data-field]").forEach((input) => {
  input.addEventListener("input", () => {
    state.fields[input.dataset.field] = input.value;
    saveState();
  });
});

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      checks: saved?.checks && typeof saved.checks === "object" ? saved.checks : {},
      fields: saved?.fields && typeof saved.fields === "object" ? saved.fields : {}
    };
  } catch {
    return { checks: {}, fields: {} };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeId(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderChecklist() {
  sections.forEach((section, sectionIndex) => {
    const details = document.createElement("details");
    details.className = "section";
    details.open = sectionIndex === 0;

    const total = section.groups.reduce((sum, group) => sum + group[1].length, 0);
    const summary = document.createElement("summary");
    summary.innerHTML = `
      <span class="section-title">
        <span class="section-number">${String(sectionIndex + 1).padStart(2, "0")}</span>
        <span class="section-name">${escapeHtml(section.title)}</span>
      </span>
      <span class="section-count"><span class="section-completed">0</span> / ${total} <span class="section-arrow">▼</span></span>
    `;
    details.appendChild(summary);

    const body = document.createElement("div");
    body.className = "section-body";

    section.groups.forEach(([groupName, items]) => {
      const subsection = document.createElement("div");
      subsection.className = "subsection";
      subsection.innerHTML = `<h3>${escapeHtml(groupName)}</h3>`;
      const list = document.createElement("div");
      list.className = "checklist-list";

      items.forEach((item, itemIndex) => {
        list.appendChild(createCheckItem(item, `s${sectionIndex + 1}-g${makeId(groupName)}-${itemIndex + 1}`, false));
      });

      subsection.appendChild(list);
      body.appendChild(subsection);
    });

    details.appendChild(body);
    checklistEl.appendChild(details);
  });
}

function renderAdvanced() {
  advancedItems.forEach((item, index) => {
    advancedChecklistEl.appendChild(
      createCheckItem(item, `advanced-${index + 1}`, true)
    );
  });
}

function createCheckItem(label, id, isAdvanced) {
  const row = document.createElement("label");
  row.className = "check-item";
  row.dataset.advanced = isAdvanced ? "true" : "false";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.dataset.checkId = id;
  input.checked = Boolean(state.checks[id]);
  input.addEventListener("change", () => {
    state.checks[id] = input.checked;
    row.classList.toggle("is-complete", input.checked);
    saveState();
    updateProgress();
  });

  const text = document.createElement("span");
  text.textContent = label;

  row.append(input, text);
  row.classList.toggle("is-complete", input.checked);
  return row;
}

function updateProgress() {
  const advancedOpen = !advancedPanel.hidden;
  const visibleChecks = [
    ...document.querySelectorAll('#checklist input[type="checkbox"]'),
    ...(advancedOpen ? [...advancedChecklistEl.querySelectorAll('input[type="checkbox"]')] : [])
  ];

  const completed = visibleChecks.filter((input) => input.checked).length;
  const total = visibleChecks.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  progressTextEl.textContent = `FLIGHT CHECKLIST ${completed} / ${total} COMPLETE`;
  progressPercentEl.textContent = `${percent}%`;
  progressBarEl.style.width = `${percent}%`;

  document.querySelectorAll(".section").forEach((section) => {
    const inputs = [...section.querySelectorAll('input[type="checkbox"]')];
    const complete = inputs.filter((input) => input.checked).length;
    const count = section.querySelector(".section-completed");
    if (count) count.textContent = complete;
  });
}

function restoreFields() {
  document.querySelectorAll("[data-field]").forEach((input) => {
    input.value = state.fields[input.dataset.field] || "";
  });
}

function togglePanel(panel, button) {
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  button.setAttribute("aria-expanded", String(willOpen));
  updateProgress();
}

flightInfoToggle.addEventListener("click", () => togglePanel(flightInfoPanel, flightInfoToggle));
advancedToggle.addEventListener("click", () => togglePanel(advancedPanel, advancedToggle));

document.getElementById("resetButton").addEventListener("click", () => {
  if (typeof resetDialog.showModal === "function") {
    resetDialog.showModal();
  } else if (window.confirm("End Flight?\n\nThis will clear your checklist progress and flight information. Are you sure?")) {
    resetAll();
  }
});

document.getElementById("cancelReset").addEventListener("click", () => resetDialog.close());

document.getElementById("confirmReset").addEventListener("click", () => {
  resetAll();
  resetDialog.close();
});

resetDialog.addEventListener("click", (event) => {
  if (event.target === resetDialog) resetDialog.close();
});

function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  Object.keys(state.checks).forEach((key) => delete state.checks[key]);
  Object.keys(state.fields).forEach((key) => delete state.fields[key]);

  document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
    input.closest(".check-item")?.classList.remove("is-complete");
  });

  document.querySelectorAll("[data-field]").forEach((input) => {
    input.value = "";
  });

  updateProgress();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}