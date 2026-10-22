/**
 * Floorplan Card for Home Assistant
 * Draws a floor plan from plain coordinates – rooms, windows, doors and radiators –
 * and colors them by entity state. No SVG editor needed.
 *
 * https://github.com/mfurti/floorplan-card
 * License: MIT
 */

const VERSION = "0.1.1";

const STRINGS = {
  en: {
    open: "open",
    closed: "closed",
    unknown: "unknown",
    heating: "heating",
    idle: "idle",
    off: "off",
    confirm: "Are you sure?",
    no_rooms: "Please define at least one room under 'rooms'.",
    bad_points: "Room '{name}' needs 'points' (at least 3) or 'rect' [x1, y1, x2, y2].",
    bad_line: "{kind} #{n} needs 'from' and 'to' as [x, y].",
    bad_door: "Door #{n} needs 'hinge' and 'to' as [x, y].",
    bad_element: "Element #{n} needs 'entity' and 'position' [x, y].",
  },
  de: {
    open: "offen",
    closed: "geschlossen",
    unknown: "unbekannt",
    heating: "heizt",
    idle: "bereit",
    off: "aus",
    confirm: "Bist du sicher?",
    no_rooms: "Bitte unter 'rooms' mindestens einen Raum angeben.",
    bad_points: "Raum '{name}' braucht 'points' (mindestens 3) oder 'rect' [x1, y1, x2, y2].",
    bad_line: "{kind} Nr. {n} braucht 'from' und 'to' als [x, y].",
    bad_door: "Tür Nr. {n} braucht 'hinge' und 'to' als [x, y].",
    bad_element: "Element Nr. {n} braucht 'entity' und 'position' [x, y].",
  },
};

const lang = () => ((navigator.language || "en").toLowerCase().startsWith("de") ? "de" : "en");
const t = (key, vars = {}, language = lang()) =>
  (STRINGS[language][key] || STRINGS.en[key]).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const isPoint = (p) => Array.isArray(p) && p.length === 2 && p.every((v) => typeof v === "number");

// Rooms may be given as polygon points or as a rectangle [x1, y1, x2, y2].
const roomPoints = (room) => {
  if (Array.isArray(room.rect) && room.rect.length === 4) {
    const [x1, y1, x2, y2] = room.rect;
    return [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
  }
  return room.points;
};

const bbox = (points) => {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
};

// Window/cover/radiator states reduced to a few CSS classes.
const OPEN_STATES = new Set(["on", "open", "opening"]);
const CLOSED_STATES = new Set(["off", "closed", "closing"]);

const windowState = (stateObj) => {
  if (!stateObj) return "neutral";
  if (OPEN_STATES.has(stateObj.state)) return "open";
  if (CLOSED_STATES.has(stateObj.state)) return "closed";
  return "unknown";
};

const radiatorState = (stateObj) => {
  if (!stateObj) return "neutral";
  if (stateObj.state === "off") return "off";
  if (stateObj.state === "unavailable" || stateObj.state === "unknown") return "unknown";
  return stateObj.attributes.hvac_action === "heating" ? "heating" : "idle";
};

const ACTIVE_STATES = new Set(["on", "open", "playing", "home", "heat", "cool", "heating", "cleaning"]);

class FloorplanCard extends HTMLElement {
  static getStubConfig() {
    return {
      rooms: [
        { name: "Living room", rect: [0, 0, 400, 300] },
        { name: "Kitchen", rect: [400, 0, 650, 300] },
      ],
      windows: [{ from: [80, 0], to: [200, 0] }],
      doors: [{ hinge: [400, 200], to: [400, 260], swing: "left" }],
    };
  }

  setConfig(config) {
    if (!Array.isArray(config.rooms) || config.rooms.length === 0) throw new Error(t("no_rooms"));
    config.rooms.forEach((room) => {
      const pts = roomPoints(room);
      if (!Array.isArray(pts) || pts.length < 3 || !pts.every(isPoint)) throw new Error(t("bad_points", { name: room.name ?? "?" }));
    });
    for (const [kind, list] of [["Window", config.windows], ["Radiator", config.radiators]]) {
      (list || []).forEach((item, i) => {
        if (!isPoint(item.from) || !isPoint(item.to)) throw new Error(t("bad_line", { kind, n: i + 1 }));
      });
    }
    (config.doors || []).forEach((door, i) => {
      if (!isPoint(door.hinge) || !isPoint(door.to)) throw new Error(t("bad_door", { n: i + 1 }));
    });
    (config.elements || []).forEach((el, i) => {
      if (!el.entity || !isPoint(el.position)) throw new Error(t("bad_element", { n: i + 1 }));
    });

    this._config = config;
    this._viewBox = this._computeViewBox(config);
    this._entities = [
      ...config.rooms.map((r) => r.entity),
      ...(config.windows || []).map((w) => w.entity),
      ...(config.radiators || []).map((r) => r.entity),
      ...(config.elements || []).map((e) => e.entity),
    ].filter(Boolean);
    this._lastStates = null;
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    // Only redraw when one of our entities changed.
    const states = this._entities.map((id) => hass.states[id]);
    if (this._lastStates && states.every((s, i) => s === this._lastStates[i])) return;
    this._lastStates = states;
    this._render();
  }

  getCardSize() {
    const [, , w, h] = this._viewBox || [0, 0, 4, 3];
    return Math.max(3, Math.round((h / w) * 8));
  }

  getGridOptions() {
    return { columns: "full", min_columns: 6 };
  }

  _computeViewBox(config) {
    if (Array.isArray(config.viewbox) && config.viewbox.length === 4) return config.viewbox;
    const all = config.rooms.flatMap(roomPoints);
    for (const list of [config.windows, config.radiators]) (list || []).forEach((i) => all.push(i.from, i.to));
    (config.doors || []).forEach((d) => all.push(d.hinge, d.to));
    const b = bbox(all);
    const pad = config.padding ?? 20;
    return [b.x1 - pad, b.y1 - pad, b.x2 - b.x1 + 2 * pad, b.y2 - b.y1 + 2 * pad];
  }

  // Door: opening in the wall from hinge to "to", leaf at 90°, arc back to the wall.
  // "swing" says on which side of the wall (seen from hinge towards "to") the door opens.
  _door(door) {
    const [hx, hy] = door.hinge;
    const [ex, ey] = door.to;
    const len = Math.hypot(ex - hx, ey - hy);
    const [dx, dy] = [(ex - hx) / len, (ey - hy) / len];
    const left = (door.swing || "left") === "left";
    const [nx, ny] = left ? [dy, -dx] : [-dy, dx];
    const [lx, ly] = [hx + nx * len, hy + ny * len];
    const gap = door.gap === false ? "" : `<line class="gap" x1="${hx}" y1="${hy}" x2="${ex}" y2="${ey}"/>`;
    return `${gap}<path class="door" d="M${hx} ${hy} L${lx} ${ly} A${len} ${len} 0 0 ${left ? 1 : 0} ${ex} ${ey}"/>`;
  }

  _window(win, i) {
    const s = windowState(this._hass.states[win.entity]);
    const [x1, y1] = win.from;
    const [x2, y2] = win.to;
    const title = win.name || (win.entity && this._hass.states[win.entity]?.attributes.friendly_name) || "";
    const label = s === "neutral" ? "" : ` – ${t(s)}`;
    const click = win.entity ? ` data-action="window" data-index="${i}"` : "";
    return `<g class="window ${s}"${click}><title>${esc(title)}${label}</title>
      <line class="frame" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
      <line class="glass" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
      <line class="hit" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/></g>`;
  }

  _radiator(rad, i) {
    const stateObj = this._hass.states[rad.entity];
    const s = radiatorState(stateObj);
    const [x1, y1] = rad.from;
    const [x2, y2] = rad.to;
    const w = rad.width ?? 8;
    const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);
    const [rx, ry, rw, rh] = vertical
      ? [x1 - w / 2, Math.min(y1, y2), w, Math.abs(y2 - y1)]
      : [Math.min(x1, x2), y1 - w / 2, Math.abs(x2 - x1), w];
    let title = rad.name || stateObj?.attributes.friendly_name || "";
    if (stateObj) {
      const a = stateObj.attributes;
      const temps = [a.current_temperature, a.temperature].filter((v) => v != null).join(" → ");
      title += ` – ${t(s)}${temps ? ` (${temps} °)` : ""}`;
    }
    const click = rad.entity ? ` data-action="radiator" data-index="${i}"` : "";
    return `<g class="radiator ${s}"${click}><title>${esc(title)}</title>
      <rect class="hit" x="${rx - 6}" y="${ry - 6}" width="${rw + 12}" height="${rh + 12}"/>
      <rect class="body" x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="2"/>
      <line class="fins" x1="${vertical ? x1 : rx + 3}" y1="${vertical ? ry + 3 : y1}" x2="${vertical ? x1 : rx + rw - 3}" y2="${vertical ? ry + rh - 3 : y1}"/></g>`;
  }

  _room(room, i) {
    const pts = roomPoints(room);
    const b = bbox(pts);
    const kind = ["outdoor", "zone"].includes(room.type) ? room.type : "room";
    const active = room.entity && ACTIVE_STATES.has(this._hass.states[room.entity]?.state) ? " active" : "";
    const clickable = room.tap_action || room.navigation_path || room.entity;
    const click = clickable ? ` data-action="room" data-index="${i}"` : "";
    const shape =
      kind === "zone" && room.rect
        ? `<rect class="${kind}${active}"${click} x="${b.x1}" y="${b.y1}" width="${b.x2 - b.x1}" height="${b.y2 - b.y1}" rx="8"/>`
        : `<polygon class="${kind}${active}"${click} points="${pts.map((p) => p.join(",")).join(" ")}"/>`;
    return shape;
  }

  _roomLabel(room) {
    if (room.label === false || !room.name) return "";
    const b = bbox(roomPoints(room));
    const [x, y] = room.label_position || [(b.x1 + b.x2) / 2, (b.y1 + b.y2) / 2];
    const size = room.label_size === "small" || room.type === "zone" ? "small" : "name";
    return `<text class="${size}" x="${x}" y="${y}">${esc(room.name)}</text>`;
  }

  _element(el, i) {
    const [vx, vy, vw, vh] = this._viewBox;
    const left = ((el.position[0] - vx) / vw) * 100;
    const top = ((el.position[1] - vy) / vh) * 100;
    const stateObj = this._hass.states[el.entity];
    const title = esc(el.title || stateObj?.attributes.friendly_name || el.entity);
    const pos = `style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%"`;
    if ((el.type || "icon") === "state") {
      const value = stateObj ? (this._hass.formatEntityState?.(stateObj) ?? `${stateObj.state} ${stateObj.attributes.unit_of_measurement || ""}`) : "–";
      return `<span class="chip" ${pos} title="${title}" data-action="element" data-index="${i}">${esc(el.prefix || "")}${esc(value)}${esc(el.suffix || "")}</span>`;
    }
    const active = stateObj && ACTIVE_STATES.has(stateObj.state) ? " active" : "";
    const icon = el.icon ? ` icon="${esc(el.icon)}"` : "";
    return `<ha-state-icon class="icon${active}" ${pos} title="${title}" data-action="element" data-index="${i}" data-entity="${esc(el.entity)}"${icon}></ha-state-icon>`;
  }

  _render() {
    const c = this._config;
    const [vx, vy, vw, vh] = this._viewBox;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    }
    const rooms = c.rooms.map((r, i) => this._room(r, i)).join("");
    const radiators = (c.radiators || []).map((r, i) => this._radiator(r, i)).join("");
    const doors = (c.doors || []).map((d) => this._door(d)).join("");
    const windows = (c.windows || []).map((w, i) => this._window(w, i)).join("");
    const labels = [
      ...c.rooms.map((r) => this._roomLabel(r)),
      ...(c.labels || []).map((l) => `<text class="${l.size === "small" ? "small" : "name"}" x="${l.position?.[0]}" y="${l.position?.[1]}">${esc(l.text)}</text>`),
    ].join("");
    const elements = (c.elements || []).map((e, i) => this._element(e, i)).join("");

    this.shadowRoot.innerHTML = `
      <style>${FloorplanCard.styles}</style>
      <ha-card${c.title ? ` header="${esc(c.title)}"` : ""}>
        <div class="plan" style="aspect-ratio:${vw} / ${vh}">
          <svg viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${esc(c.title || "Floorplan")}">
            ${rooms}${doors}${windows}${radiators}${labels}
          </svg>
          <div class="overlay">${elements}</div>
        </div>
      </ha-card>`;

    this.shadowRoot.querySelectorAll("ha-state-icon").forEach((node) => {
      node.hass = this._hass;
      node.stateObj = this._hass.states[node.dataset.entity];
    });
  }

  _onClick(ev) {
    const target = ev.composedPath().find((n) => n.dataset?.action);
    if (!target) return;
    const list = { room: "rooms", window: "windows", radiator: "radiators", element: "elements" }[target.dataset.action];
    const item = this._config[list][Number(target.dataset.index)];
    const action =
      item.tap_action ||
      (item.navigation_path ? { action: "navigate", navigation_path: item.navigation_path } : { action: "more-info" });
    this._handleAction(action, item.entity);
  }

  _handleAction(action, entity) {
    if (action.confirmation && !window.confirm(action.confirmation.text || t("confirm"))) return;
    const target = action.entity || entity;
    switch (action.action) {
      case "navigate":
        window.history.pushState(null, "", action.navigation_path);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
        break;
      case "toggle":
        if (target) this._hass.callService("homeassistant", "toggle", { entity_id: target });
        break;
      case "perform-action":
      case "call-service": {
        const [domain, service] = (action.perform_action || action.service || "").split(".");
        if (domain && service) this._hass.callService(domain, service, action.data || action.service_data || {}, action.target);
        break;
      }
      case "url":
        window.open(action.url_path, "_blank", "noopener");
        break;
      case "none":
        break;
      default:
        if (target) this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId: target } }));
    }
  }
}

FloorplanCard.styles = `
  :host {
    --fp-room: color-mix(in srgb, var(--primary-color) 20%, var(--card-background-color, var(--ha-card-background, #1c1c1c)));
    --fp-room-active: color-mix(in srgb, var(--state-active-color, #fdd835) 25%, var(--fp-room));
    --fp-wall: color-mix(in srgb, var(--primary-color) 60%, var(--primary-text-color));
    --fp-text: var(--primary-text-color);
    --fp-text-small: var(--secondary-text-color);
    --fp-window: var(--info-color, #039be5);
    --fp-window-open: var(--error-color, #db4437);
    --fp-window-closed: var(--success-color, #43a047);
    --fp-window-unknown: var(--disabled-color, #9e9e9e);
    --fp-radiator: var(--warning-color, #ffa600);
    --fp-chip: var(--warning-color, #ffa600);
    --fp-wall-width: 3;
  }
  ha-card { overflow: hidden; }
  .plan { position: relative; width: 100%; }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .room, .outdoor { fill: var(--fp-room); stroke: var(--fp-wall); stroke-width: var(--fp-wall-width); stroke-linejoin: round; transition: fill .3s; }
  .outdoor { fill-opacity: .4; stroke-width: calc(var(--fp-wall-width) * .7); stroke-dasharray: 10 6; }
  .zone { fill: none; stroke: var(--fp-wall); stroke-opacity: .7; stroke-width: 1.5; stroke-dasharray: 6 5; }
  .room.active { fill: var(--fp-room-active); }
  [data-action] { cursor: pointer; }
  .zone[data-action] { pointer-events: all; fill: transparent; }
  .gap { stroke: var(--fp-room); stroke-width: calc(var(--fp-wall-width) + 3); }
  .door { fill: none; stroke: var(--fp-wall); stroke-width: 1.5; }
  .name, .small { text-anchor: middle; dominant-baseline: central; pointer-events: none; font-family: var(--ha-font-family-body, Roboto, sans-serif); }
  .name { fill: var(--fp-text); font-size: 18px; font-weight: 600; }
  .small { fill: var(--fp-text-small); font-size: 13px; font-weight: 500; }
  .window .frame { stroke: var(--fp-window); stroke-width: 8; transition: stroke .3s; }
  .window .glass { stroke: var(--fp-room); stroke-width: 2; }
  .window .hit { stroke: transparent; stroke-width: 16; }
  .window:not([data-action]) .hit { pointer-events: none; }
  .radiator .hit { fill: transparent; }
  .window.open .frame { stroke: var(--fp-window-open); animation: fp-pulse 1.6s ease-in-out infinite; }
  .window.closed .frame { stroke: var(--fp-window-closed); }
  .window.unknown .frame { stroke: var(--fp-window-unknown); }
  .radiator .body { fill: color-mix(in srgb, var(--fp-radiator) 15%, var(--fp-room)); stroke: var(--fp-radiator); stroke-width: 1.5; }
  .radiator .fins { stroke: var(--fp-radiator); stroke-width: 5; stroke-dasharray: 2 4; }
  .radiator.off, .radiator.unknown { opacity: .45; }
  .radiator.heating .body { fill: var(--fp-radiator); animation: fp-pulse 2.4s ease-in-out infinite; }
  @keyframes fp-pulse { 50% { opacity: .35; } }
  @media (prefers-reduced-motion: reduce) { .window.open .frame, .radiator.heating .body { animation: none; } }
  .overlay { position: absolute; inset: 0; pointer-events: none; }
  .overlay > * { position: absolute; transform: translate(-50%, -50%); pointer-events: auto; cursor: pointer; }
  .icon { --mdc-icon-size: 22px; color: var(--state-icon-color, var(--paper-item-icon-color)); }
  .icon.active { color: var(--state-active-color, var(--paper-item-icon-active-color, #fdd835)); }
  .chip {
    color: var(--fp-chip); white-space: nowrap; font-size: 12px; line-height: 18px; padding: 0 5px; border-radius: 6px;
    background: color-mix(in srgb, var(--fp-chip) 15%, transparent); border: 1px solid color-mix(in srgb, var(--fp-chip) 60%, transparent);
  }
`;

customElements.define("floorplan-card", FloorplanCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "floorplan-card",
  name: "Floorplan Card",
  description: "Floor plan from coordinates with live windows, doors and radiators.",
  preview: true,
  documentationURL: "https://github.com/mfurti/floorplan-card",
});

console.info(`%c FLOORPLAN-CARD %c ${VERSION} `, "color:#fff;background:#03a9f4;font-weight:700", "color:#03a9f4");
