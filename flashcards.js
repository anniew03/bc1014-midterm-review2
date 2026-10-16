/* Flashcards: flip through the deck, or learn it by typing each answer until every card is right. */
(function () {
  "use strict";

  const root = document.getElementById("cards");
  if (!root) return;

  const CARDS = [
    { topic: "Flowcharts", front: "Name of the oval in a flowchart", back: "input or output", accept: ["input/output", "io", "input and output", "i/o"] },
    { topic: "Flowcharts", front: "Name of the rectangle in a flowchart", back: "instruction", accept: ["process", "operation", "an instruction"] },
    { topic: "Flowcharts", front: "Name of the diamond in a flowchart", back: "decision", accept: ["yes/no question", "question", "a yes/no question"] },
    { topic: "Flowcharts", front: "Last valid index of a flowchart list of length n", back: "n", accept: ["length", "list length"] },
    { topic: "Flowcharts", front: "What you write on the two arrows leaving a diamond", back: "YES and NO", accept: ["yes/no", "YES, NO"] },

    { topic: "Java files", front: "The class inside Total.java must be named", back: "Total" },
    { topic: "Java files", front: "Java is this with respect to capital letters", back: "case sensitive", accept: ["case-sensitive"] },
    { topic: "Java files", front: "Style of class names", back: "CamelCase", accept: ["PascalCase", "UpperCamelCase"] },
    { topic: "Java files", front: "Style of method names", back: "lowerCamelCase", accept: ["camelCase"] },
    { topic: "Java files", front: "Where a Java program starts running", back: "main", accept: ["public static void main(String[] args)", "the main method"] },

    { topic: "Types", front: "Smallest int, as a Java constant", back: "Integer.MIN_VALUE", accept: ["-2147483648"] },
    { topic: "Types", front: "Integer.MIN_VALUE - 1", back: "Integer.MAX_VALUE", accept: ["2147483647"] },
    { topic: "Types", front: "Type that holds true or false", back: "boolean" },
    { topic: "Types", front: "Type that holds text", back: "String" },
    { topic: "Types", front: "Value of q after: double q = 9 / 4;", back: "2.0" },
    { topic: "Types", front: "(int) 4.9", back: "4" },
    { topic: "Types", front: "Does int x = 4.9; compile?", back: "no", accept: ["false"] },
    { topic: "Types", front: "Does if (1) compile in Java?", back: "no", accept: ["false"] },

    { topic: "Arithmetic", front: "19 / 5", back: "3" },
    { topic: "Arithmetic", front: "19 % 5", back: "4" },
    { topic: "Arithmetic", front: "-19 / 5", back: "-3" },
    { topic: "Arithmetic", front: "-19 % 5", back: "-4" },
    { topic: "Arithmetic", front: "9 / 4.0", back: "2.25" },
    { topic: "Arithmetic", front: "2 + 3 * 4", back: "14" },
    { topic: "Arithmetic", front: "1 + 2 + \"3\"", back: "\"33\"", accept: ["33"] },
    { topic: "Arithmetic", front: "\"1\" + (2 + 3)", back: "\"15\"", accept: ["15"] },
    { topic: "Arithmetic", front: "Direction int division rounds", back: "toward zero", accept: ["towards zero", "to zero"] },
    { topic: "Arithmetic", front: "Sign of a % b matches", back: "a", accept: ["the left operand", "left", "dividend"] },
    { topic: "Arithmetic", front: "What wrapping past Integer.MAX_VALUE is called", back: "overflow" },

    { topic: "Booleans", front: "a && b is true only if", back: "both are true", accept: ["both true", "a and b are true"] },
    { topic: "Booleans", front: "a || b is true if", back: "at least one is true", accept: ["one is true", "either is true", "a or b is true"] },
    { topic: "Booleans", front: "Operator that flips true and false", back: "!", accept: ["not", "!a"] },
    { topic: "Booleans", front: "Name for skipping the right side of && or ||", back: "short circuit", accept: ["short-circuit", "short-circuit evaluation", "short circuiting"] },

    { topic: "Control flow", front: "When a while condition is false at the start, the body runs", back: "0 times", accept: ["0", "zero", "zero times"] },
    { topic: "Control flow", front: "A do-while body always runs at least", back: "once", accept: ["1", "one", "1 time", "one time"] },
    { topic: "Control flow", front: "A variable declared in a for header exists", back: "only inside the loop", accept: ["inside the loop", "in the loop"] },
    { topic: "Control flow", front: "An else belongs to which if?", back: "the if right before it", accept: ["the nearest if", "the closest if"] },
    { topic: "Control flow", front: "Separate if statements can run", back: "more than one", accept: ["multiple", "several", "all of them"] },
    { topic: "Control flow", front: "Keyword for the false branch of ? :", back: ":", accept: ["colon"] },

    { topic: "Correctness", front: "Two things you show for a loop", back: "invariant and termination", accept: ["loop invariant and termination measure", "invariant and termination measure"] },
    { topic: "Correctness", front: "If a loop body never changes the condition, the loop", back: "never ends", accept: ["infinite", "runs forever", "does not stop"] },
    { topic: "Correctness", front: "The compiler requires a return on", back: "every path", accept: ["all paths", "every possible path"] },

    { topic: "Algorithms", front: "If the list is unsorted, binary search can return", back: "false when the number is there", accept: ["false", "a wrong false"] },
    { topic: "Algorithms", front: "After binary search outputs true, list[mid] equals", back: "n", accept: ["the target", "the number you searched for"] },
    { topic: "Algorithms", front: "After the first k positions of selection sort, those k values are", back: "the k smallest, in order", accept: ["sorted", "the smallest k"] }
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
