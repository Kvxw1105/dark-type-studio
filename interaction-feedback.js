"use strict";

(() => {
  const STORAGE_KEY = "dark-type-studio:feedback-settings";
  const defaults = { soundEnabled: false, hapticsEnabled: true, motionMode: "system" };
  let settings = { ...defaults };
  let feedbackTimer = null;
  let lastHapticAt = 0;
  let audioContext = null;

  try {
    settings = { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch (error) {
    console.warn("Unable to read feedback settings", error);
  }

  const prefersReducedMotion = () => settings.motionMode === "reduce"
    || (settings.motionMode === "system" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (error) { console.warn("Unable to save feedback settings", error); }
  }

  function haptic(type) {
    if (!settings.hapticsEnabled || !navigator.vibrate) return;
    const now = performance.now();
    if (now - lastHapticAt < 120) return;
    const patterns = { select: 6, drag_start: 8, drag_snap: 10, success: [8, 42, 12], error: [18, 36, 18], destructive: [22, 36, 22] };
    const pattern = patterns[type];
    if (!pattern) return;
    lastHapticAt = now;
    navigator.vibrate(pattern);
  }

  function sound(type) {
    if (!settings.soundEnabled || !["success", "error", "drag_snap", "save"].includes(type)) return;
    try {
      audioContext ??= new AudioContext();
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const frequency = type === "error" ? 180 : type === "drag_snap" ? 360 : 520;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.11);
    } catch (error) {
      console.warn("Feedback sound unavailable", error);
    }
  }

  function emit(type) {
    const root = document.documentElement;
    root.dataset.feedbackEvent = type;
    clearTimeout(feedbackTimer);
    if (!prefersReducedMotion) {
      root.classList.remove("feedback-pulse");
      void root.offsetWidth;
      root.classList.add("feedback-pulse");
    }
    feedbackTimer = setTimeout(() => {
      delete root.dataset.feedbackEvent;
      root.classList.remove("feedback-pulse");
    }, 340);
    haptic(type);
    sound(type);
  }

  function setSettings(next) {
    settings = { ...settings, ...next };
    persist();
    document.documentElement.dataset.motionMode = prefersReducedMotion() ? "reduce" : "full";
    return getSettings();
  }

  function getSettings() { return { ...settings, reducedMotion: prefersReducedMotion() }; }

  document.documentElement.dataset.motionMode = prefersReducedMotion() ? "reduce" : "full";
  window.DarkTypeFeedback = { emit, getSettings, setSettings };
})();
