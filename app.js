/* Page behavior: navigation, flowcharts, and the runnable examples. */
(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";

  const CHARTS = {};

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
