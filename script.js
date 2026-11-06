(() => {
  const modeButtons = [...document.querySelectorAll(".mode-button")];
  const legalPanel = document.getElementById("legal-panel");
  const contextualPanel = document.getElementById("contextual-panel");
  const modeLabel = document.getElementById("mode-label");
  const feedback = document.getElementById("feedback");
  const settingsAnalytics = document.getElementById("settings-analytics");
  const timerDisplay = document.getElementById("timer-display");
  const timerState = document.getElementById("timer-state");
  let activeMode = "legal";
  let timerStartedAt = null;
  let timerInterval = null;
  let lastDecisionSeconds = null;

  const preferenceKey = "studentPlannerDemoAnalytics";
  const safeGetPreference = () => {
    try {
      return localStorage.getItem(preferenceKey) === "true";
    } catch (_) {
      return false;
    }
  };
  const safeSetPreference = (value) => {
    try {
      localStorage.setItem(preferenceKey, String(value));
    } catch (_) {
      /* Prototype still works if storage is unavailable. */
    }
  };

  function setMode(mode) {
    activeMode = mode;
    const isLegal = mode === "legal";
    legalPanel.hidden = !isLegal;
    contextualPanel.hidden = isLegal;
    modeButtons.forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    modeLabel.textContent = isLegal
      ? "Prototype A · Conventional legalistic notice"
      : "Prototype B · Concise contextual explanation";
    feedback.hidden = true;
    startTimer();
  }
  modeButtons.forEach((button) =>
    button.addEventListener("click", () => setMode(button.dataset.mode)),
  );

  document.querySelectorAll(".details-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(
        button.getAttribute("aria-controls"),
      );
      const opening = panel.hidden;
      panel.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
      const label =
        activeMode === "legal" ? "Read full privacy notice" : "More details";
      button.innerHTML = `${opening ? "Hide details" : label} <span aria-hidden="true">${opening ? "−" : "＋"}</span>`;
    });
  });

  function stopTimer() {
    if (timerStartedAt !== null) {
      lastDecisionSeconds = (performance.now() - timerStartedAt) / 1000;
      timerStartedAt = null;
    }
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    timerState.textContent =
      lastDecisionSeconds === null
        ? "Timer stopped."
        : `Stopped at ${lastDecisionSeconds.toFixed(1)} seconds.`;
  }
  function renderTimer() {
    const elapsed =
      timerStartedAt === null
        ? lastDecisionSeconds || 0
        : (performance.now() - timerStartedAt) / 1000;
    const mins = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const secs = (elapsed % 60).toFixed(1).padStart(4, "0");
    timerDisplay.textContent = `${mins}:${secs}`;
  }
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerStartedAt = performance.now();
    lastDecisionSeconds = null;
    timerState.textContent =
      "Timer running — stop it when a choice is confirmed.";
    renderTimer();
    timerInterval = setInterval(renderTimer, 100);
  }
  document.getElementById("timer-start").addEventListener("click", startTimer);
  document.getElementById("timer-stop").addEventListener("click", () => {
    stopTimer();
    renderTimer();
  });

  document.querySelectorAll(".save-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const card = activeMode === "legal" ? legalPanel : contextualPanel;
      const checkbox = card.querySelector(".analytics-choice");
      const enabled = button.dataset.choice === "selected" && checkbox.checked;
      safeSetPreference(enabled);
      settingsAnalytics.checked = enabled;
      stopTimer();
      renderTimer();
      feedback.textContent = enabled
        ? "Demo choice saved: optional analytics enabled. You can change it in Settings → Privacy."
        : "Demo choice saved: optional analytics is off. You can still use the planner. Change this later in Settings → Privacy.";
      feedback.hidden = false;
    });
  });

  document.getElementById("update-settings").addEventListener("click", () => {
    safeSetPreference(settingsAnalytics.checked);
    document
      .querySelectorAll(".analytics-choice")
      .forEach((input) => (input.checked = settingsAnalytics.checked));
    feedback.textContent = settingsAnalytics.checked
      ? "Settings updated: optional analytics is enabled in this browser demo."
      : "Settings updated: optional analytics is disabled in this browser demo.";
    feedback.hidden = false;
  });

  const answerKey = { q1: "b", q2: "c", q3: "a", q4: "c", q5: "b" };
  document.getElementById("quiz-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let answered = 0,
      score = 0;
    Object.entries(answerKey).forEach(([question, answer]) => {
      if (form.has(question)) {
        answered++;
        if (form.get(question) === answer) score++;
      }
    });
    const result = document.getElementById("quiz-result");
    result.hidden = false;
    if (answered < 5) {
      result.textContent = `You answered ${answered} of 5 questions. Please answer all five to calculate a comparable score.`;
    } else {
      result.textContent = `Comprehension score: ${score}/5 (${Math.round((score / 5) * 100)}%). Record this score against ${activeMode === "legal" ? "Interface A" : "Interface B"}; do not treat a single score as proof that one design is better.`;
    }
  });

  document.getElementById("rating-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = ["clarity", "transparency", "pressure", "confidence"];
    const values = fields.map((field) => Number(form.get(field)));
    if (values.some((value) => !value)) return;
    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;
    const result = document.getElementById("rating-result");
    result.hidden = false;
    result.textContent = `Mean of the four ratings: ${average.toFixed(2)}/5. Clarity ${values[0]}, transparency ${values[1]}, perceived pressure ${values[2]}, confidence ${values[3]}. Record these against ${activeMode === "legal" ? "Interface A" : "Interface B"}. Review pressure separately (lower is preferable).`;
  });

  settingsAnalytics.checked = safeGetPreference();
  setMode("legal");
})();
