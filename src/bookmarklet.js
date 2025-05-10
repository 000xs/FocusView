javascript: (function () {
  // 📚 FocusView – Study Buddy
  if (document.getElementById("focusview-app"))
    return alert("FocusView already running!");
  const style = document.createElement("style");
  style.textContent = `
    #focusview-app {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 360px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      z-index: 9999;
      font-family: 'Segoe UI', sans-serif;
      overflow: hidden;
    }
    #focusview-app.dark { background: #1e1e1e; color: #eee; border-color: #444; }
    #fv-header {
      background: linear-gradient(to right, #3f51b5, #2196f3);
      color: #fff;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #fv-header span { font-weight: bold; font-size: 16px; }
    #fv-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }
    #fv-tabs {
      display: flex;
      background: #f0f0f0;
    }
    #focusview-app.dark #fv-tabs { background: #2a2a2a; }
    .fv-tab {
      flex: 1;
      text-align: center;
      padding: 8px;
      cursor: pointer;
      font-weight: bold;
      border-bottom: 2px solid transparent;
    }
    .fv-tab.active {
      border-bottom: 2px solid #3f51b5;
      background: #e0e0e0;
    }
    #focusview-app.dark .fv-tab.active {
      background: #333;
      border-bottom-color: #90caf9;
    }
    .fv-content {
      display: none;
      padding: 12px 16px;
      max-height: 400px;
      overflow-y: auto;
    }
    .fv-content.active { display: block; }
    .fv-btn {
      padding: 6px 12px;
      margin: 6px 4px 0 0;
      background: #3f51b5;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    .fv-btn:hover { background: #303f9f; }
    .fv-btn.red { background: #e53935; }
    .fv-btn.green { background: #43a047; }
    .fv-textarea {
      width: 100%;
      height: 100px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      resize: vertical;
    }
    .fv-timer-display {
      font-size: 18px;
      margin-top: 8px;
      color: #e53935;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  const app = document.createElement("div");
  app.id = "focusview-app";
  app.innerHTML = `
    <div id="fv-header">
      <span>📚 FocusView</span>
      <button id="fv-close">✕</button>
    </div>
    <div id="fv-tabs">
      <div class="fv-tab active" data-tab="tools">Tools</div>
      <div class="fv-tab" data-tab="notes">Notes</div>
      <div class="fv-tab" data-tab="timer">Timer</div>
      <div class="fv-tab" data-tab="extras">Extras</div>
    </div>
    <div class="fv-content active" id="fv-tab-tools">
      <button class="fv-btn" id="fv-highlight">Highlight</button>
      <button class="fv-btn" id="fv-scroll">Auto Scroll</button>
      <button class="fv-btn" id="fv-font">Font +</button>
      <button class="fv-btn" id="fv-focus">Focus Mode</button>
    </div>
    <div class="fv-content" id="fv-tab-notes">
      <textarea id="fv-notes" placeholder="Take study notes..." class="fv-textarea"></textarea><br>
      <button class="fv-btn green" id="fv-save">Save</button>
      <button class="fv-btn red" id="fv-clear">Clear</button>
    </div>
    <div class="fv-content" id="fv-tab-timer">
      <input type="number" id="fv-time" value="5" min="1" style="width: 60px;"> min
      <button class="fv-btn" id="fv-start">Start</button>
      <div class="fv-timer-display" id="fv-display" style="display:none;">00:00</div>
    </div>
    <div class="fv-content" id="fv-tab-extras">
      <button class="fv-btn" id="fv-dark">🌙 Dark Mode</button>
      <button class="fv-btn" id="fv-top">⬆ Top</button>
      <button class="fv-btn" id="fv-bottom">⬇ Bottom</button>
    </div>
  `;
  document.body.appendChild(app);

  document.getElementById("fv-close").onclick = () => app.remove();

  // Tabs
  app.querySelectorAll(".fv-tab").forEach((tab) => {
    tab.onclick = () => {
      app
        .querySelectorAll(".fv-tab")
        .forEach((t) => t.classList.remove("active"));
      app
        .querySelectorAll(".fv-content")
        .forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      document
        .getElementById("fv-tab-" + tab.dataset.tab)
        .classList.add("active");
    };
  });

  // Buttons
  const notesArea = document.getElementById("fv-notes");
  notesArea.value = localStorage.getItem("focusview-notes") || "";
  document.getElementById("fv-save").onclick = () => {
    localStorage.setItem("focusview-notes", notesArea.value);
    alert("💾 Notes saved!");
  };
  document.getElementById("fv-clear").onclick = () => {
    notesArea.value = "";
    localStorage.removeItem("focusview-notes");
  };

  document.getElementById("fv-highlight").onclick = () => {
    const q = [".question", ".question-text", 'div[id*="question"]'];
    let count = 0;
    q.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.background = "#ffffcc";
        el.style.border = "2px dashed #fbc02d";
        el.style.borderRadius = "5px";
        count++;
      });
    });
    alert(`✅ Highlighted ${count} questions`);
  };

  let scrollInterval = null;
  document.getElementById("fv-scroll").onclick = function () {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
      this.textContent = "Auto Scroll";
    } else {
      scrollInterval = setInterval(() => {
        window.scrollBy(0, 1);
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight)
          clearInterval(scrollInterval);
      }, 20);
      this.textContent = "Stop Scroll";
    }
  };

  document.getElementById("fv-font").onclick = () => {
    document
      .querySelectorAll("p, label, span, input, textarea, div")
      .forEach((el) => {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (!isNaN(fs)) el.style.fontSize = fs * 1.15 + "px";
      });
  };

  document.getElementById("fv-start").onclick = () => {
    const mins = parseInt(document.getElementById("fv-time").value);
    if (isNaN(mins) || mins < 1) return alert("Enter a valid time");
    let secs = mins * 60;
    const disp = document.getElementById("fv-display");
    disp.style.display = "block";
    const intv = setInterval(() => {
      let m = String(Math.floor(secs / 60)).padStart(2, "0");
      let s = String(secs % 60).padStart(2, "0");
      disp.textContent = `${m}:${s}`;
      secs--;
      if (secs < 0) {
        clearInterval(intv);
        alert("⏰ Time's up!");
        disp.style.display = "none";
      }
    }, 1000);
  };

  let focusModeOn = false;
  document.getElementById("fv-focus").onclick = () => {
    if (!focusModeOn) {
      [...document.body.children].forEach((c) => {
        if (c.id !== "focusview-app") c.style.display = "none";
      });
      focusModeOn = true;
      alert("🔒 Focus mode ON. Click again to exit.");
    } else {
      [...document.body.children].forEach((c) => {
        if (c.id !== "focusview-app") c.style.display = "";
      });
      focusModeOn = false;
    }
  };

  
  document.getElementById("fv-dark").onclick = () => {
    app.classList.toggle("dark");
  };

  document.getElementById("fv-top").onclick = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("fv-bottom").onclick = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
})();
