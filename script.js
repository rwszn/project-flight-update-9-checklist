const C = window.PROJECT_FLIGHT_CONFIG || {};

const sb =
  window.supabase &&
  C.supabasePublishableKey &&
  C.supabasePublishableKey !== "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"
    ? window.supabase.createClient(
        C.supabaseUrl,
        C.supabasePublishableKey
      )
    : null;

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

let user = null;
let guest = false;
let advancedOpen = false;

let state = {
  checks: {},
  skipped: {},
  advanced: {},
  info: {},
  notes: ""
};

const $ = id => document.getElementById(id);

function key() {
  return `pf9-${user ? user.id : "guest"}`;
}

function savedKey() {
  return `pf9-saved-${user ? user.id : "guest"}`;
}

function save() {
  localStorage.setItem(key(), JSON.stringify(state));
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(key()));

    if (saved) {
      state = {
        checks: saved.checks || {},
        skipped: saved.skipped || {},
        advanced: saved.advanced || {},
        info: saved.info || {},
        notes: saved.notes || ""
      };
    }
  } catch {}

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
  return keys.find(title => id.startsWith(title + "-")) || "";
}

function sectionComplete(title) {
  const items = sections[title] || [];

  return items.every((_, index) => {
    const id = `${title}-${index}`;

    return !!state.checks[id] || !!state.skipped[id];
  });
}

function findFirstIncomplete() {
  for (const title of Object.keys(sections)) {
    if (!sectionComplete(title)) {
      return title;
    }
  }

  return null;
}

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

  progress();
}

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
    skip.textContent = state.skipped[id] ? "Unskip" : "Skip";

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
    }
  };

  return row;
}

function autoAdvance(title) {
  const titles = Object.keys(sections);
  const index = titles.indexOf(title);

  if (index === -1 || index >= titles.length - 1) {
    return;
  }

  const nextTitle = titles[index + 1];

  setTimeout(() => {
    const panels = document.querySelectorAll(".checklist-section");

    panels[index + 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 150);
}

function progress() {
  let total = 0;
  let done = 0;

  Object.entries(sections).forEach(([title, items]) => {
    items.forEach((_, index) => {
      total++;

      const id = `${title}-${index}`;

      if (state.checks[id] || state.skipped[id]) {
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
  $("count").textContent = `${done} of ${total} complete`;
}

async function startUser(u) {
  user = u;
  guest = false;

  $("account").textContent = u.email || "Account";

  app();
}

async function startGuest() {
  if (sb) {
    await sb.auth.signOut();
  }

  user = null;
  guest = true;

  setGuest();

  $("account").textContent = "Guest";

  app();
}

function getSavedFlights() {
  try {
    return JSON.parse(localStorage.getItem(savedKey())) || [];
  } catch {
    return [];
  }
}

function setSavedFlights(flights) {
  localStorage.setItem(savedKey(), JSON.stringify(flights));
}

function saveCurrentFlight() {
  const flights = getSavedFlights();

  const title =
    state.info.flight ||
    state.info.aircraft ||
    state.info.server ||
    "Untitled Flight";

  const saved = {
    id: Date.now(),
    title,
    timestamp: new Date().toISOString(),
    state: JSON.parse(JSON.stringify(state))
  };

  flights.unshift(saved);

  if (flights.length > 30) {
    flights.length = 30;
  }

  setSavedFlights(flights);

  const button = $("saveFlight");
  const original = button.textContent;

  button.textContent = "Flight Saved";

  setTimeout(() => {
    button.textContent = original;
  }, 1500);
}

function renderSavedFlights() {
  const list = $("savedList");
  const flights = getSavedFlights();

  list.innerHTML = "";

  if (!flights.length) {
    const empty = document.createElement("div");
    empty.className = "empty-saved";
    empty.textContent = "No saved flights yet.";
    list.appendChild(empty);
    return;
  }

  flights.forEach(flight => {
    const row = document.createElement("div");
    row.className = "saved-flight";

    const info = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = flight.title;

    const date = document.createElement("small");

    try {
      date.textContent = new Date(
        flight.timestamp
      ).toLocaleString();
    } catch {
      date.textContent = "";
    }

    info.append(title, date);

    const actions = document.createElement("div");
    actions.className = "saved-actions";

    const open = document.createElement("button");
    open.type = "button";
    open.textContent = "Open";

    open.onclick = () => {
      state = JSON.parse(JSON.stringify(flight.state));

      save();
      render();

      $("savedDialog").close();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-button";
    remove.textContent = "Delete";

    remove.onclick = () => {
      const updated = getSavedFlights().filter(
        saved => saved.id !== flight.id
      );

      setSavedFlights(updated);
      renderSavedFlights();
    };

    actions.append(open, remove);
    row.append(info, actions);

    list.appendChild(row);
  });
}

$("login").onsubmit = async event => {
  event.preventDefault();

  if (!sb) {
    return msg(
      "message",
      "Add your Supabase publishable key in config.js first."
    );
  }

  msg("message", "Logging in...");

  const {
    error
  } = await sb.auth.signInWithPassword({
    email: $("email").value.trim(),
    password: $("password").value
  });

  if (error) {
    msg("message", error.message);
  }
};

$("register").onclick = () => {
  screens("registerScreen");
};

$("forgot").onclick = () => {
  screens("forgotScreen");
};

$("guest").onclick = startGuest;

$("backRegister").onclick = () => {
  screens("auth");
};

$("backForgot").onclick = () => {
  screens("auth");
};

$("registerForm").onsubmit = async event => {
  event.preventDefault();

  if (!sb) {
    return msg(
      "registerMessage",
      "Supabase is not configured yet."
    );
  }

  if ($("regPassword").value !== $("regConfirm").value) {
    return msg(
      "registerMessage",
      "Passwords do not match."
    );
  }

  const {
    data,
    error
  } = await sb.auth.signUp({
    email: $("regEmail").value.trim(),
    password: $("regPassword").value,
    options: {
      emailRedirectTo:
        location.origin + location.pathname
    }
  });

  if (error) {
    return msg("registerMessage", error.message);
  }

  if (data.session) {
    startUser(data.session.user);
  } else {
    msg(
      "registerMessage",
      "Account created. Check your email to confirm your account."
    );
  }
};

$("forgotForm").onsubmit = async event => {
  event.preventDefault();

  if (!sb) {
    return msg(
      "forgotMessage",
      "Supabase is not configured yet."
    );
  }

  const {
    error
  } = await sb.auth.resetPasswordForEmail(
    $("forgotEmail").value.trim(),
    {
      redirectTo:
        location.origin + location.pathname
    }
  );

  msg(
    "forgotMessage",
    error
      ? error.message
      : "Reset email sent. Check your inbox."
  );
};

$("recoveryForm").onsubmit = async event => {
  event.preventDefault();

  if (!sb) {
    return;
  }

  if ($("newPassword").value !== $("newConfirm").value) {
    return msg(
      "recoveryMessage",
      "Passwords do not match."
    );
  }

  const {
    error
  } = await sb.auth.updateUser({
    password: $("newPassword").value
  });

  if (error) {
    return msg("recoveryMessage", error.message);
  }

  msg(
    "recoveryMessage",
    "Password updated."
  );

  setTimeout(() => app(), 700);
};

$("advanced").onclick = () => {
  advancedOpen = !advancedOpen;

  $("advancedPanel").classList.toggle(
    "hidden",
    !advancedOpen
  );

  $("advanced").textContent = advancedOpen
    ? "Hide Advanced"
    : "Advanced";

  progress();
};

$("notesToggle").onclick = () => {
  $("notesPage").classList.toggle("hidden");

  $("notesToggle").textContent =
    $("notesPage").classList.contains("hidden")
      ? "Notes"
      : "Hide Notes";
};

$("notes").oninput = () => {
  state.notes = $("notes").value;
  save();
};

$("savedFlights").onclick = () => {
  renderSavedFlights();
  $("savedDialog").showModal();
};

$("closeSaved").onclick = () => {
  $("savedDialog").close();
};

$("saveFlight").onclick = saveCurrentFlight;

$("logout").onclick = async () => {
  if (sb) {
    await sb.auth.signOut();
  }

  user = null;
  guest = false;

  $("app").classList.add("hidden");

  screens("auth");
};

["aircraft", "flight", "server", "gate", "date"].forEach(id => {
  $(id).oninput = () => {
    state.info[id] = $(id).value;
    save();
  };
});

$("reset").onclick = () => {
  $("dialog").showModal();
};

$("cancel").onclick = () => {
  $("dialog").close();
};

$("confirm").onclick = () => {
  state = {
    checks: {},
    skipped: {},
    advanced: {},
    info: {},
    notes: ""
  };

  save();
  render();

  advancedOpen = false;

  $("advancedPanel").classList.add(
    "hidden"
  );

  $("advanced").textContent = "Advanced";

  $("notesPage").classList.add("hidden");
  $("notesToggle").textContent = "Notes";

  $("dialog").close();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

async function init() {
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
  } = await sb.auth.getSession();

  if (session?.user) {
    startUser(session.user);
  } else if (guestCookie()) {
    startGuest();
  } else {
    screens("auth");
  }

  sb.auth.onAuthStateChange(
    (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        screens("recoveryScreen");
      } else if (session?.user) {
        startUser(session.user);
      }
    }
  );
}

init();
