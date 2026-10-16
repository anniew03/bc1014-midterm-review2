/* Flashcards: flip through the deck, or learn it by typing each answer until every card is right. */
(function () {
  "use strict";

  const root = document.getElementById("cards");
  if (!root) return;

  const CARDS = [
    { topic: "Terminology", front: "A variable of a method that is initialized with a value when the method is called", back: "parameter variable", accept: ["parameter", "parameter variables", "parameters"] },
    { topic: "Terminology", front: "All statements of a method or block", back: "body", accept: ["method body", "block body"] },
    { topic: "Terminology", front: "A value supplied in a method call", back: "argument", accept: ["arguments"] },
    { topic: "Terminology", front: "The type of value a method gives back to its caller", back: "return type" },
    { topic: "Terminology", front: "The method that makes a call to another method", back: "calling method", accept: ["caller", "the caller"] },
    { topic: "Terminology", front: "The keywords public and static in a method header are called", back: "modifiers", accept: ["modifier"] },

    { topic: "Calling methods", front: "The number of arguments in a call must equal the number of what?", back: "parameters", accept: ["parameter variables", "parameter"] },
    { topic: "Calling methods", front: "For larger(int a, int b) called as larger(7, 3), the value that goes into b", back: "3" },
    { topic: "Calling methods", front: "The most values a method can return", back: "one", accept: ["1"] },
    { topic: "Calling methods", front: "A method's return value is sent back to _______", back: "the calling method", accept: ["calling method", "the caller", "caller"] },

    { topic: "Writing methods", front: "Return type of a method that returns nothing", back: "void" },
    { topic: "Writing methods", front: "Method header for the absolute value of an int, named abs", back: "public static int abs(int n)", accept: ["public static int abs(int x)", "public static int abs(int num)"] },
    { topic: "Writing methods", front: "Style of method names", back: "lowerCamelCase", accept: ["camelCase"] },

    { topic: "Parameter passing", front: "A parameter variable is created _______", back: "when the method is called", accept: ["when it is called", "at the call", "when called"] },
    { topic: "Parameter passing", front: "A parameter variable stops existing _______", back: "when the method returns", accept: ["when the method ends", "when it returns", "when the method finishes"] },
    { topic: "Parameter passing", front: "A parameter variable holds what, relative to the argument?", back: "a copy", accept: ["a copy of the value", "a copy of the argument", "a copy of the argument's value"] },
    { topic: "Parameter passing", front: "Can a method change the contents of a variable passed as an argument?", back: "no", accept: ["false"] },
    { topic: "Parameter passing", front: "Can two different methods each have a variable named n?", back: "yes", accept: ["true"] },

    { topic: "Return values", front: "When a return statement runs, the method", back: "exits immediately", accept: ["exits", "ends immediately", "exits the method", "leaves immediately"] },
    { topic: "Return values", front: "Can a return statement return an expression such as -n?", back: "yes", accept: ["true"] },
    { topic: "Return values", front: "Statement that exits a void method early", back: "return;", accept: ["return"] },
    { topic: "Return values", front: "Can a void method return a value?", back: "no", accept: ["false"] },
    { topic: "Return values", front: "A method with a return type must return a value on _______", back: "every path", accept: ["all paths", "every possible path"] }
  ];

  const topics = ["All topics"].concat(CARDS.map((c) => c.topic).filter((t, i, a) => a.indexOf(t) === i));
  const $ = (sel) => root.querySelector(sel);

  const topicSel = $("[data-topic]");
  topics.forEach((t) => {
    const o = document.createElement("option");
    o.textContent = t;
    topicSel.append(o);
  });

  function deck() {
    const t = topicSel.value;
    return CARDS.filter((c) => t === "All topics" || c.topic === t);
  }

  function shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  function norm(s) {
    return s.toLowerCase()
      .replace(/[“”]/g, "\"").replace(/[‘’]/g, "'")
      .trim()
      .replace(/^(the|a|an)\s+/, "")
      .replace(/[.;]+$/, "")
      .replace(/\s+/g, "");
  }

  function matches(card, typed) {
    const t = norm(typed);
    return t.length > 0 && [card.back].concat(card.accept || []).some((a) => norm(a) === t);
  }

  /* ---------- mode tabs ---------- */

  const tabs = root.querySelectorAll("[data-mode]");
  tabs.forEach((b) => b.addEventListener("click", () => setMode(b.getAttribute("data-mode"))));

  function setMode(mode) {
    tabs.forEach((b) => b.classList.toggle("on", b.getAttribute("data-mode") === mode));
    $(".fc-flip").hidden = mode !== "flip";
    $(".fc-learn").hidden = mode !== "learn";
    if (mode === "learn") startLearn();
    else startFlip();
  }

  topicSel.addEventListener("change", () => {
    if (!$(".fc-learn").hidden) startLearn();
    else startFlip();
  });

  /* ---------- flip ---------- */

  const card = $(".fc-card");
  let flip = { cards: [], i: 0, back: false };

  function startFlip(shuffled) {
    flip = { cards: shuffled ? shuffle(deck()) : deck(), i: 0, back: false };
    showFlip();
  }

  function showFlip() {
    const c = flip.cards[flip.i];
    card.classList.toggle("back", flip.back);
    $(".fc-front-text").textContent = c.front;
    $(".fc-back-text").textContent = c.back;
    $(".fc-side").textContent = flip.back ? "Answer" : c.topic;
    $(".fc-count").textContent = (flip.i + 1) + " / " + flip.cards.length;
  }

  function move(d) {
    flip.i = (flip.i + d + flip.cards.length) % flip.cards.length;
    flip.back = false;
    showFlip();
  }

  card.addEventListener("click", () => { flip.back = !flip.back; showFlip(); });
  card.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
  });
  $("[data-prev]").addEventListener("click", () => move(-1));
  $("[data-next]").addEventListener("click", () => move(1));
  $("[data-shuffle]").addEventListener("click", () => startFlip(true));

  /* ---------- learn ---------- */

  const prompt = $(".fc-prompt");
  const answer = $(".fc-answer");
  const feedback = $(".fc-feedback");
  const overrideBtn = $("[data-override]");
  let learn = null;

  function startLearn() {
    learn = { queue: shuffle(deck()), total: deck().length, learned: 0, misses: 0, copying: false, wrongTyped: "" };
    $(".fc-done").hidden = true;
    $(".fc-quiz").hidden = false;
    showLearn();
  }

  function showLearn() {
    const pct = learn.total ? Math.round(100 * learn.learned / learn.total) : 0;
    $(".fc-bar span").style.width = pct + "%";
    $(".fc-progress-text").textContent = learn.learned + " of " + learn.total + " learned";
    if (!learn.queue.length) {
      $(".fc-quiz").hidden = true;
      $(".fc-done").hidden = false;
      $(".fc-done-text").textContent = "You wrote all " + learn.total + " cards correctly" +
        (learn.misses ? ", with " + learn.misses + " " + (learn.misses === 1 ? "miss" : "misses") + " along the way." : " with no misses.");
      return;
    }
    const c = learn.queue[0];
    prompt.textContent = c.front;
    answer.value = "";
    if (learn.copying) {
      feedback.className = "fc-feedback wrong";
      feedback.innerHTML = "";
      const line1 = document.createElement("div");
      line1.append("Not quite. You wrote: ");
      const yours = document.createElement("code");
      yours.textContent = learn.wrongTyped;
      line1.append(yours);
      const line2 = document.createElement("div");
      line2.append("Correct answer: ");
      const right = document.createElement("code");
      right.textContent = c.back;
      line2.append(right);
      const line3 = document.createElement("div");
      line3.className = "fc-copy-note";
      line3.textContent = "Type the correct answer to continue. This card will come back.";
      feedback.append(line1, line2, line3);
      answer.placeholder = "Copy the correct answer";
      overrideBtn.hidden = false;
    } else {
      feedback.className = "fc-feedback";
      feedback.textContent = "";
      answer.placeholder = "Type your answer and press Enter";
      overrideBtn.hidden = true;
    }
    answer.focus({ preventScroll: true });
  }

  function check() {
    if (!learn || !learn.queue.length) return;
    const c = learn.queue[0];
    const typed = answer.value;
    if (!typed.trim()) return;
    if (learn.copying) {
      if (matches(c, typed)) {
        learn.copying = false;
        requeue();
        showLearn();
      } else {
        answer.classList.add("shake");
        setTimeout(() => answer.classList.remove("shake"), 300);
      }
      return;
    }
    if (matches(c, typed)) {
      learn.queue.shift();
      learn.learned++;
      showLearn();
      flash();
    } else {
      learn.misses++;
      learn.copying = true;
      learn.wrongTyped = typed;
      showLearn();
    }
  }

  function requeue() {
    const c = learn.queue.shift();
    const spot = Math.min(learn.queue.length, 3);
    learn.queue.splice(spot, 0, c);
  }

  function flash() {
    feedback.className = "fc-feedback right";
    feedback.textContent = "Correct";
    setTimeout(() => { if (feedback.textContent === "Correct") { feedback.textContent = ""; feedback.className = "fc-feedback"; } }, 900);
  }

  answer.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); check(); }
  });
  $("[data-check]").addEventListener("click", check);
  overrideBtn.addEventListener("click", () => {
    if (!learn.copying) return;
    learn.misses--;
    learn.copying = false;
    learn.queue.shift();
    learn.learned++;
    showLearn();
  });
  $("[data-restart]").addEventListener("click", startLearn);
  $("[data-again]").addEventListener("click", startLearn);

  setMode("flip");
})();
