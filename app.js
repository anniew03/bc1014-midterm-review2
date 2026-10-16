/* Page behavior: navigation, flowcharts, and the runnable examples. */
(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";

  const CHARTS = {
    thirds: {
      w: 700,
      h: 400,
      nodes: [
        { kind: "io", x: 170, y: 16, w: 280, h: 70, text: "Input: number n (n >= 0)" },
        { kind: "op", x: 210, y: 110, w: 200, h: 46, text: "set c = 0" },
        { kind: "dec", x: 200, y: 186, w: 220, h: 100, text: "n < 3?" },
        { kind: "io", x: 500, y: 202, w: 170, h: 68, text: "Output: c" },
        { kind: "op", x: 140, y: 326, w: 160, h: 48, text: "set n = n - 3" },
        { kind: "op", x: 320, y: 326, w: 160, h: 48, text: "set c = c + 1" }
      ],
      wires: [
        { points: [[310, 86], [310, 110]] },
        { points: [[310, 156], [310, 186]] },
        { points: [[420, 236], [500, 236]], label: "YES", lx: 432, ly: 228 },
        { points: [[310, 286], [220, 286], [220, 326]], label: "NO", lx: 318, ly: 310 },
        { points: [[300, 350], [320, 350]] },
        { points: [[480, 350], [480, 400], [64, 400], [64, 236], [200, 236]] }
      ]
    },
    lastEqual: {
      w: 840,
      h: 620,
      nodes: [
        { kind: "io", x: 220, y: 12, w: 280, h: 68, text: "Input: list, number n" },
        { kind: "op", x: 260, y: 96, w: 200, h: 46, text: "set i = 1" },
        { kind: "op", x: 260, y: 158, w: 200, h: 46, text: "set pos = 0" },
        { kind: "dec", x: 235, y: 228, w: 250, h: 104, text: "i > length?" },
        { kind: "io", x: 610, y: 248, w: 180, h: 64, text: "Output: pos" },
        { kind: "dec", x: 235, y: 368, w: 250, h: 104, text: "list[i] = n?" },
        { kind: "op", x: 610, y: 388, w: 180, h: 48, text: "set pos = i" },
        { kind: "op", x: 260, y: 520, w: 200, h: 48, text: "set i = i + 1" }
      ],
      wires: [
        { points: [[360, 80], [360, 96]] },
        { points: [[360, 142], [360, 158]] },
        { points: [[360, 204], [360, 228]] },
        { points: [[485, 280], [610, 280]], label: "YES", lx: 500, ly: 272 },
        { points: [[360, 332], [360, 368]], label: "NO", lx: 368, ly: 354 },
        { points: [[485, 420], [610, 420]], label: "YES", lx: 500, ly: 412 },
        { points: [[360, 472], [360, 520]], label: "NO", lx: 368, ly: 500 },
        { points: [[700, 436], [700, 544], [460, 544]] },
        { points: [[260, 544], [86, 544], [86, 280], [235, 280]] }
      ]
    },
    product: {
      w: 760,
      h: 500,
      nodes: [
        { kind: "io", x: 150, y: 12, w: 250, h: 76, text: "Input:\nnumber a, number b" },
        { kind: "op", x: 165, y: 112, w: 220, h: 46, text: "set p = 0" },
        { kind: "dec", x: 170, y: 184, w: 210, h: 100, text: "b = 0?" },
        { kind: "io", x: 500, y: 200, w: 180, h: 68, text: "Output: p" },
        { kind: "op", x: 165, y: 324, w: 220, h: 48, text: "set p = p + a" },
        { kind: "op", x: 165, y: 400, w: 220, h: 48, text: "set b = b - 1" }
      ],
      wires: [
        { points: [[275, 88], [275, 112]] },
        { points: [[275, 158], [275, 184]] },
        { points: [[380, 234], [500, 234]], label: "YES", lx: 400, ly: 224 },
        { points: [[275, 284], [275, 324]], label: "NO", lx: 284, ly: 308 },
        { points: [[275, 372], [275, 400]] },
        { points: [[165, 424], [58, 424], [58, 234], [170, 234]] }
      ]
    },
    ticket: {
      w: 760,
      h: 500,
      nodes: [
        { kind: "io", x: 80, y: 10, w: 230, h: 64, text: "Input: number age" },
        { kind: "dec", x: 75, y: 104, w: 240, h: 100, text: "age < 13?" },
        { kind: "io", x: 470, y: 122, w: 180, h: 64, text: "Output: CHILD" },
        { kind: "dec", x: 75, y: 244, w: 240, h: 100, text: "age >= 65?" },
        { kind: "io", x: 470, y: 262, w: 180, h: 64, text: "Output: SENIOR" },
        { kind: "io", x: 105, y: 384, w: 180, h: 64, text: "Output: ADULT" }
      ],
      wires: [
        { points: [[195, 74], [195, 104]] },
        { points: [[315, 154], [470, 154]], label: "YES", lx: 340, ly: 144 },
        { points: [[195, 204], [195, 244]], label: "NO", lx: 204, ly: 228 },
        { points: [[315, 294], [470, 294]], label: "YES", lx: 340, ly: 284 },
        { points: [[195, 344], [195, 384]], label: "NO", lx: 204, ly: 368 }
      ]
    },
    digitsProd: {
      w: 720,
      h: 460,
      nodes: [
        { kind: "io", x: 140, y: 10, w: 270, h: 64, text: "Input: number n (n >= 1)" },
        { kind: "op", x: 175, y: 96, w: 200, h: 46, text: "set p = 1" },
        { kind: "dec", x: 165, y: 168, w: 220, h: 100, text: "n = 0?" },
        { kind: "io", x: 480, y: 184, w: 190, h: 68, text: "Output: p" },
        { kind: "op", x: 145, y: 310, w: 260, h: 48, text: "set p = p * (n % 10)" },
        { kind: "op", x: 165, y: 384, w: 220, h: 48, text: "set n = n / 10" }
      ],
      wires: [
        { points: [[275, 74], [275, 96]] },
        { points: [[275, 142], [275, 168]] },
        { points: [[385, 218], [480, 218]], label: "YES", lx: 400, ly: 208 },
        { points: [[275, 268], [275, 310]], label: "NO", lx: 284, ly: 292 },
        { points: [[275, 358], [275, 384]] },
        { points: [[165, 408], [70, 408], [70, 218], [165, 218]] }
      ]
    },
    lcm: {
      w: 720,
      h: 420,
      nodes: [
        { kind: "io", x: 140, y: 10, w: 260, h: 70, text: "Input: a, b (both >= 1)" },
        { kind: "op", x: 170, y: 104, w: 200, h: 46, text: "set m = a" },
        { kind: "dec", x: 160, y: 176, w: 220, h: 100, text: "m % b = 0?" },
        { kind: "io", x: 500, y: 192, w: 170, h: 68, text: "Output: m" },
        { kind: "op", x: 170, y: 320, w: 200, h: 48, text: "set m = m + a" }
      ],
      wires: [
        { points: [[270, 80], [270, 104]] },
        { points: [[270, 150], [270, 176]] },
        { points: [[380, 226], [500, 226]], label: "YES", lx: 400, ly: 218 },
        { points: [[270, 276], [270, 320]], label: "NO", lx: 278, ly: 302 },
        { points: [[170, 344], [64, 344], [64, 226], [160, 226]] }
      ]
    },
    negatives: {
      w: 860,
      h: 560,
      nodes: [
        { kind: "io", x: 200, y: 8, w: 300, h: 64, text: "Input: number cur" },
        { kind: "op", x: 230, y: 96, w: 240, h: 46, text: "set count = 0" },
        { kind: "dec", x: 230, y: 168, w: 240, h: 100, text: "cur = -1?" },
        { kind: "io", x: 580, y: 184, w: 210, h: 68, text: "Output: count" },
        { kind: "dec", x: 230, y: 308, w: 240, h: 100, text: "cur < 0?" },
        { kind: "op", x: 560, y: 334, w: 250, h: 48, text: "set count = count + 1" },
        { kind: "op", x: 210, y: 460, w: 280, h: 46, text: "set cur = next number" }
      ],
      wires: [
        { points: [[350, 72], [350, 96]] },
        { points: [[350, 142], [350, 168]] },
        { points: [[470, 218], [580, 218]], label: "YES", lx: 490, ly: 208 },
        { points: [[350, 268], [350, 308]], label: "NO", lx: 358, ly: 292 },
        { points: [[470, 358], [560, 358]], label: "YES", lx: 488, ly: 348 },
        { points: [[350, 408], [350, 460]], label: "NO", lx: 358, ly: 438 },
        { points: [[685, 382], [685, 483], [490, 483]] },
        { points: [[210, 483], [72, 483], [72, 218], [230, 218]] }
      ]
    }
  };

  const INK = "#111";

  function el(name, attrs, text) {
    const node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach((k) => node.setAttribute(k, attrs[k]));
    if (text != null) node.textContent = text;
    return node;
  }

  function drawChart(host, spec) {
    const uid = "a" + Math.random().toString(36).slice(2, 8);
    const svg = el("svg", { viewBox: "0 0 " + spec.w + " " + spec.h, class: "flow", role: "img" });
    const defs = el("defs");
    const marker = el("marker", {
      id: uid,
      viewBox: "0 0 10 10",
      refX: "8",
      refY: "5",
      markerWidth: "7",
      markerHeight: "7",
      orient: "auto"
    });
    marker.appendChild(el("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: INK }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    spec.wires.forEach((w) => {
      const d = w.points.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
      const attrs = { d: d, fill: "none", stroke: INK, "stroke-width": "1.7" };
      if (w.arrow !== false) attrs["marker-end"] = "url(#" + uid + ")";
      svg.appendChild(el("path", attrs));
      if (w.label) {
        svg.appendChild(el("text", { x: w.lx, y: w.ly, class: "tag" }, w.label));
      }
    });

    spec.nodes.forEach((n) => {
      const shape = { fill: "white", stroke: INK, "stroke-width": "1.7" };
      if (n.kind === "io") {
        svg.appendChild(el("ellipse", Object.assign({
          cx: n.x + n.w / 2, cy: n.y + n.h / 2, rx: n.w / 2, ry: n.h / 2
        }, shape)));
      } else if (n.kind === "dec") {
        const x = n.x, y = n.y, w = n.w, h = n.h;
        svg.appendChild(el("polygon", Object.assign({
          points: [
            [x + w / 2, y],
            [x + w, y + h / 2],
            [x + w / 2, y + h],
            [x, y + h / 2]
          ].map((p) => p.join(",")).join(" ")
        }, shape)));
      } else {
        svg.appendChild(el("rect", Object.assign({ x: n.x, y: n.y, width: n.w, height: n.h }, shape)));
      }
      const lines = n.text.split("\n");
      const lh = 18;
      const block = lines.length * lh;
      const y0 = n.y + (n.h - block) / 2 + 13;
      const text = el("text", { "text-anchor": "middle" });
      lines.forEach((line, i) => {
        text.appendChild(el("tspan", { x: n.x + n.w / 2, y: y0 + i * lh }, line));
      });
      svg.appendChild(text);
    });

    host.appendChild(svg);
  }

  function mountIde(host) {
    const sample = ReviewSamples.samples[host.dataset.sample];
    if (!sample) {
      host.textContent = "Missing example " + host.dataset.sample;
      return;
    }
    host.innerHTML = "";
    const top = document.createElement("div");
    top.className = "ide-top";
    const file = document.createElement("span");
    file.className = "ide-file";
    file.textContent = sample.label;
    const actions = document.createElement("span");
    actions.className = "ide-actions";
    const runBtn = button("Run", "");
    const traceBtn = button("Trace", "ghost");
    const resetBtn = button("Reset", "ghost");
    actions.append(runBtn, traceBtn, resetBtn);
    top.append(file, actions);

    const editor = document.createElement("div");
    editor.className = "editor";
    const gutter = document.createElement("pre");
    gutter.className = "gutter";
    const area = document.createElement("textarea");
    area.spellcheck = false;
    area.setAttribute("aria-label", sample.label);
    area.value = sample.code;
    editor.append(gutter, area);

    const out = document.createElement("pre");
    out.className = "stdout quiet";
    out.textContent = "Output";
    const trace = document.createElement("pre");
    trace.className = "traceout";
    trace.hidden = true;

    host.append(top, editor);
    if (sample.input) {
      const row = document.createElement("label");
      row.className = "in-row";
      row.append(document.createTextNode("Input "));
      const input = document.createElement("input");
      input.value = sample.input;
      input.setAttribute("aria-label", "Program input");
      row.append(input);
      host.append(row);
      host._input = input;
    }
    host.append(out, trace);

    function renumber() {
      const n = area.value.split("\n").length;
      const nums = [];
      for (let i = 1; i <= n; i++) nums.push(String(i));
      gutter.textContent = nums.join("\n");
      const h = Math.min(560, Math.max(88, n * 22 + 24));
      area.style.height = h + "px";
      gutter.style.height = h + "px";
    }
    area.addEventListener("input", renumber);
    area.addEventListener("scroll", () => { gutter.scrollTop = area.scrollTop; });
    area.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const a = area.selectionStart;
        const b = area.selectionEnd;
        area.value = area.value.slice(0, a) + "    " + area.value.slice(b);
        area.selectionStart = area.selectionEnd = a + 4;
        renumber();
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        execute(false);
      }
    });
    runBtn.addEventListener("click", () => execute(false));
    traceBtn.addEventListener("click", () => execute(true));
    resetBtn.addEventListener("click", () => {
      area.value = sample.code;
      if (host._input) host._input.value = sample.input;
      out.className = "stdout quiet";
      out.textContent = "Output";
      trace.hidden = true;
      renumber();
    });
    renumber();

    function execute(withTrace) {
      const input = host._input ? host._input.value : "";
      const result = JavaRun.run(area.value, input, { trace: withTrace });
      trace.hidden = !withTrace;
      if (result.error) {
        out.className = "stdout bad";
        out.textContent = result.error;
        trace.textContent = "";
        return;
      }
      if (result.output.length === 0) {
        out.className = "stdout quiet";
        out.textContent = "(no output)";
      } else {
        out.className = "stdout";
        out.textContent = result.output;
      }
      if (withTrace) trace.textContent = result.trace.join("\n");
    }
  }

  function button(label, ghost) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    if (ghost) b.className = ghost;
    return b;
  }

  function buildNav() {
    const box = document.getElementById("nav-links");
    const sections = Array.from(document.querySelectorAll("main section[data-nav]"));
    sections.forEach((section) => {
      const a = document.createElement("a");
      a.href = "#" + section.id;
      a.textContent = section.dataset.nav;
      box.appendChild(a);
    });
    const links = Array.from(box.querySelectorAll("a"));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => obs.observe(section));
  }

  document.querySelectorAll("[data-chart]").forEach((host) => {
    drawChart(host, CHARTS[host.dataset.chart]);
  });
  document.querySelectorAll(".ide").forEach(mountIde);
  buildNav();
  document.getElementById("larger").addEventListener("click", () => {
    document.body.classList.toggle("big");
  });
})();
