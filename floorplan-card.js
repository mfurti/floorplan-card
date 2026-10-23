/**
 * Floorplan Card for Home Assistant
 * Draws a floor plan from plain coordinates – rooms, windows, doors, radiators and stairs –
 * and colors them by entity state. Comes with a visual editor: draw rooms, drag
 * everything around, no SVG editor or YAML needed.
 *
 * https://github.com/mfurti/floorplan-card
 * License: MIT
 */

const VERSION = "0.8.0";

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
    bad_points: "Room '{name}' needs 'points' (at least 3), 'rect' or 'ellipse' [x1, y1, x2, y2].",
    bad_line: "{kind} #{n} needs 'from' and 'to' as [x, y].",
    bad_door: "Door #{n} needs 'hinge' and 'to' as [x, y].",
    bad_element: "Element #{n} needs 'position' [x, y].",
    bad_stairs: "Stairs #{n} need 'rect' [x1, y1, x2, y2].",
    // Editor
    group_rooms: "Rooms",
    group_openings: "Openings",
    group_fixtures: "Fixtures",
    tool_select: "Select",
    tool_room_rect: "Rectangle",
    tool_room_poly: "Polygon",
    tool_room_ellipse: "Circle",
    tool_fillet: "Round",
    tool_arc: "Arc wall",
    panel_modify: "Modify",
    radius: "Radius",
    corner_radius: "Corner radius (all corners)",
    corner_radius_mixed: "different per corner",
    tool_window: "Window",
    tool_door: "Door",
    tool_radiator: "Radiator",
    tool_stairs: "Stairs",
    tool_element: "Icon",
    tool_label: "Text",
    tab_draw: "Draw",
    tab_insert: "Insert",
    tab_view: "View",
    panel_rooms: "Rooms",
    panel_openings: "Openings",
    panel_snap: "Snap",
    panel_fixtures: "Fixtures",
    panel_ha: "Home Assistant",
    panel_text: "Annotation",
    panel_zoom: "Zoom",
    panel_display: "Display",
    hint_label: "Click where the text should go, then type it below.",
    text_default: "Text",
    undo: "Undo",
    delete: "Delete",
    fullscreen: "Full screen",
    save: "Save",
    saved: "Saved",
    save_failed: "Not saved",
    finish: "Finish room",
    cancel: "Cancel",
    grid: "Grid",
    ortho: "Ortho",
    ortho_title: "Right angles: walls only horizontal or vertical",
    wall_snap: "Wall snap",
    wall_snap_title: "Windows, doors and radiators always sit on the nearest wall, stairs fit flush against walls",
    hint_select: "Click an object to select it, drag to move it. Drag on empty space to select several objects (Shift adds).",
    header_draw: "Draw",
    zoom_in: "Zoom in",
    zoom_out: "Zoom out",
    zoom_fit: "Show all",
    n_selected: "{n} objects selected",
    nav_hint: "Wheel: zoom · middle button or space + drag: pan · right click / Esc: cancel",
    "hint_room-rect": "Click one corner of the room, then the opposite corner.",
    "hint_room-poly": "Click the corners one after another. Click the first corner again (or Enter) to close the room.",
    "hint_room-ellipse": "Click one corner of the surrounding box, then the opposite corner. Hold Shift for a circle.",
    hint_fillet: "Set the radius, then click the corners to round. Radius 0 makes a corner square again.",
    hint_arc: "Click the wall that should be bent.",
    hint_arc2: "Move the mouse to bend the wall and click. Back onto the straight line makes it straight again.",
    hint_window: "Click the start and the end of the window on the wall.",
    hint_door: "1st click: side with the hinge. 2nd click: other end of the opening. 3rd click: the side the door opens to.",
    hint_door3: "Move the mouse to the side the door should open to and click.",
    hint_radiator: "Click the start and the end – on the side of the wall where the radiator should go.",
    hint_stairs: "Click one corner of the stairs, then the opposite corner.",
    hint_element: "Click where the icon should go, then pick its entity.",
    nothing_selected: "Nothing selected.",
    name: "Name",
    entity: "Entity",
    type: "Type",
    type_room: "Room",
    type_outdoor: "Outdoor (balcony, terrace)",
    type_zone: "Zone inside a room",
    navigation: "On click open (path)",
    gap: "Opening in the wall",
    width: "Width",
    swap_hinge: "Hinge to other end",
    swap_side: "Open to other side",
    door_hint: "Or click one of the grey outlines in the plan.",
    direction: "Way up",
    steps: "Steps",
    show_as: "Show as",
    show_icon: "Icon",
    show_state: "Value",
    title: "Tooltip",
    room_n: "Room {n}",
    up: "up",
    sel_room: "Room",
    sel_window: "Window",
    sel_door: "Door",
    sel_radiator: "Radiator",
    sel_stairs: "Stairs",
    sel_element: "Icon / value",
    sel_label: "Label",
    text: "Text",
    // Template image for tracing
    tab_trace: "Template",
    panel_trace_image: "Image",
    panel_trace_adjust: "Adjust",
    trace_upload: "Upload",
    trace_show: "Show",
    trace_hide: "Hide",
    trace_remove: "Remove",
    trace_move: "Move",
    trace_scale: "Scale",
    opacity: "Opacity",
    rotation: "Rotation (°)",
    hint_trace: "Upload a photo or scan of your floor plan (JPG, PNG or GIF, up to 10 MB) or drop it onto the drawing area. It only shows here in the editor, never in the card.",
    hint_trace_ready: "Set the unit, draw the scale onto the image, then trace the rooms on top of it with the tools under Draw.",
    "hint_trace-move": "Drag to move the image. Size and rotation are below.",
    "hint_trace-scale": "Click two points on the image whose real distance you know, e.g. both ends of a wall.",
    "hint_trace-scale2": "Enter the real distance below and apply it.",
    trace_uploading: "Uploading image …",
    trace_failed: "Upload failed: {error}",
    trace_load_failed: "Could not load the image: {error}",
    trace_bad_type: "Only JPG, PNG or GIF images can be uploaded.",
    trace_scaled: "Scale set. Now trace the rooms on top of the image.",
    sel_trace: "Template image",
    trace_url: "Image address (URL)",
    trace_url_hint: "Uploaded images are stored in Home Assistant. You can also enter an address like /local/plan.png.",
    trace_width: "Width",
    trace_distance: "Real distance between the two points ({unit})",
    trace_distance_note: "Measured on the image: {d}",
    trace_no_unit: "No unit set yet: pick it in the ribbon first, otherwise the number counts in plan units.",
    panel_unit: "Unit",
    unit: "Unit",
    unit_none: "plan units",
    apply: "Apply",
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
    bad_points: "Raum '{name}' braucht 'points' (mindestens 3), 'rect' oder 'ellipse' [x1, y1, x2, y2].",
    bad_line: "{kind} Nr. {n} braucht 'from' und 'to' als [x, y].",
    bad_door: "Tür Nr. {n} braucht 'hinge' und 'to' als [x, y].",
    bad_element: "Element Nr. {n} braucht 'position' [x, y].",
    bad_stairs: "Treppe Nr. {n} braucht 'rect' [x1, y1, x2, y2].",
    group_rooms: "Räume",
    group_openings: "Öffnungen",
    group_fixtures: "Ausstattung",
    tool_select: "Auswählen",
    tool_room_rect: "Rechteck",
    tool_room_poly: "Vieleck",
    tool_room_ellipse: "Kreis",
    tool_fillet: "Abrunden",
    tool_arc: "Bogenwand",
    panel_modify: "Ändern",
    radius: "Radius",
    corner_radius: "Eckenradius (alle Ecken)",
    corner_radius_mixed: "je Ecke verschieden",
    tool_window: "Fenster",
    tool_door: "Tür",
    tool_radiator: "Heizkörper",
    tool_stairs: "Treppe",
    tool_element: "Symbol",
    tool_label: "Text",
    tab_draw: "Zeichnen",
    tab_insert: "Einfügen",
    tab_view: "Ansicht",
    panel_rooms: "Räume",
    panel_openings: "Öffnungen",
    panel_snap: "Fang",
    panel_fixtures: "Ausstattung",
    panel_ha: "Home Assistant",
    panel_text: "Beschriftung",
    panel_zoom: "Zoom",
    panel_display: "Darstellung",
    hint_label: "Dorthin klicken, wo der Text hin soll, dann unten eintippen.",
    text_default: "Text",
    undo: "Rückgängig",
    delete: "Löschen",
    fullscreen: "Vollbild",
    save: "Speichern",
    saved: "Gespeichert",
    save_failed: "Nicht gespeichert",
    finish: "Raum fertig",
    cancel: "Abbrechen",
    grid: "Raster",
    ortho: "Ortho",
    ortho_title: "Rechtwinklig: Wände nur waagrecht oder senkrecht",
    wall_snap: "Wandfang",
    wall_snap_title: "Fenster, Türen und Heizkörper sitzen immer an der nächsten Wand, Treppen schließen bündig an Wände an",
    hint_select: "Objekt anklicken zum Auswählen, ziehen zum Verschieben. Auf freier Fläche ziehen wählt mehrere Objekte aus (Umschalt: hinzufügen).",
    header_draw: "Zeichnen",
    zoom_in: "Vergrößern",
    zoom_out: "Verkleinern",
    zoom_fit: "Alles zeigen",
    n_selected: "{n} Objekte ausgewählt",
    nav_hint: "Mausrad: zoomen · Mitteltaste oder Leertaste + ziehen: verschieben · Rechtsklick / Esc: abbrechen",
    "hint_room-rect": "Eine Ecke des Raums anklicken, dann die gegenüberliegende Ecke.",
    "hint_room-poly": "Die Ecken nacheinander anklicken. Zum Schließen wieder die erste Ecke anklicken (oder Enter).",
    "hint_room-ellipse": "Eine Ecke des umgebenden Rechtecks anklicken, dann die gegenüberliegende. Mit Umschalt wird es ein Kreis.",
    hint_fillet: "Radius einstellen, dann die Ecken anklicken, die rund werden sollen. Radius 0 macht eine Ecke wieder eckig.",
    hint_arc: "Die Wand anklicken, die gebogen werden soll.",
    hint_arc2: "Maus bewegen, bis der Bogen passt, dann klicken. Zurück auf die gerade Linie macht die Wand wieder gerade.",
    hint_window: "Anfang und Ende des Fensters auf der Wand anklicken.",
    hint_door: "1. Klick: Seite mit der Angel. 2. Klick: anderes Ende der Öffnung. 3. Klick: auf die Seite, in die die Tür aufgeht.",
    hint_door3: "Maus auf die Seite bewegen, in die die Tür aufgehen soll, und klicken.",
    hint_radiator: "Anfang und Ende anklicken – auf der Seite der Wand, vor die der Heizkörper soll.",
    hint_stairs: "Eine Ecke der Treppe anklicken, dann die gegenüberliegende Ecke.",
    hint_element: "Dorthin klicken, wo das Symbol hin soll, dann die Entität auswählen.",
    nothing_selected: "Nichts ausgewählt.",
    name: "Name",
    entity: "Entität",
    type: "Art",
    type_room: "Raum",
    type_outdoor: "Außen (Balkon, Terrasse)",
    type_zone: "Bereich in einem Raum",
    navigation: "Bei Klick öffnen (Pfad)",
    gap: "Öffnung in der Wand",
    width: "Breite",
    swap_hinge: "Angel ans andere Ende",
    swap_side: "Zur anderen Seite öffnen",
    door_hint: "Oder einen der grauen Umrisse im Plan anklicken.",
    direction: "Richtung nach oben",
    steps: "Stufen",
    show_as: "Anzeigen als",
    show_icon: "Symbol",
    show_state: "Wert",
    title: "Tooltip",
    room_n: "Raum {n}",
    up: "hoch",
    sel_room: "Raum",
    sel_window: "Fenster",
    sel_door: "Tür",
    sel_radiator: "Heizkörper",
    sel_stairs: "Treppe",
    sel_element: "Symbol / Wert",
    sel_label: "Beschriftung",
    text: "Text",
    tab_trace: "Vorlage",
    panel_trace_image: "Bild",
    panel_trace_adjust: "Anpassen",
    trace_upload: "Hochladen",
    trace_show: "Einblenden",
    trace_hide: "Ausblenden",
    trace_remove: "Entfernen",
    trace_move: "Verschieben",
    trace_scale: "Maßstab",
    opacity: "Deckkraft",
    rotation: "Drehung (°)",
    hint_trace: "Foto oder Scan des Grundrisses hochladen (JPG, PNG oder GIF, bis 10 MB) oder auf die Zeichenfläche ziehen. Das Bild ist nur hier im Editor zu sehen, nie in der Karte.",
    hint_trace_ready: "Einheit festlegen, den Maßstab auf dem Bild einzeichnen, dann mit den Werkzeugen unter „Zeichnen“ die Räume nachzeichnen.",
    "hint_trace-move": "Ziehen verschiebt das Bild. Größe und Drehung stehen unten.",
    "hint_trace-scale": "Zwei Punkte auf dem Bild anklicken, deren echten Abstand du kennst, z. B. beide Enden einer Wand.",
    "hint_trace-scale2": "Unten den echten Abstand eingeben und übernehmen.",
    trace_uploading: "Bild wird hochgeladen …",
    trace_failed: "Hochladen fehlgeschlagen: {error}",
    trace_load_failed: "Bild konnte nicht geladen werden: {error}",
    trace_bad_type: "Hochladen geht nur mit JPG-, PNG- oder GIF-Bildern.",
    trace_scaled: "Maßstab gesetzt. Jetzt die Räume auf dem Bild nachzeichnen.",
    sel_trace: "Vorlagenbild",
    trace_url: "Bildadresse (URL)",
    trace_url_hint: "Hochgeladene Bilder liegen in Home Assistant. Alternativ geht eine Adresse wie /local/grundriss.png.",
    trace_width: "Breite",
    trace_distance: "Echter Abstand der beiden Punkte ({unit})",
    trace_distance_note: "Auf dem Bild gemessen: {d}",
    trace_no_unit: "Noch keine Einheit festgelegt: zuerst im Ribbon wählen, sonst gilt die Zahl in Plan-Einheiten.",
    panel_unit: "Einheit",
    unit: "Einheit",
    unit_none: "Plan-Einheiten",
    apply: "Übernehmen",
  },
};

const langOf = (hass) => {
  const l = (hass?.locale?.language || hass?.language || navigator.language || "en").toLowerCase();
  return l.startsWith("de") ? "de" : "en";
};
const t = (key, vars = {}, language = "en") =>
  (STRINGS[language]?.[key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const clone = (o) => JSON.parse(JSON.stringify(o ?? {}));
const isPoint = (p) => Array.isArray(p) && p.length === 2 && p.every((v) => typeof v === "number" && isFinite(v));
const round = (v) => Math.round(v * 1000) / 1000;
const isRect = (r) => Array.isArray(r) && r.length === 4 && r.every((v) => typeof v === "number" && isFinite(v));
const normRect = ([x1, y1, x2, y2]) => [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)];

// Rooms may be given as polygon points or as a rectangle [x1, y1, x2, y2].
const roomPoints = (room) => {
  if (isRect(room.rect)) {
    const [x1, y1, x2, y2] = room.rect;
    return [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
  }
  return room.points;
};

const fmt = (p) => `${Math.round(p[0] * 1e4) / 1e4} ${Math.round(p[1] * 1e4) / 1e4}`;

// Circle through start a, a point m on the arc and end b; "span" is signed (positive = clockwise on screen).
const arcThrough = (a, m, b) => {
  const [[ax, ay], [mx, my], [bx, by]] = [a, m, b];
  const d = 2 * (ax * (my - by) + mx * (by - ay) + bx * (ay - my));
  if (Math.abs(d) < 1e-12) return null;
  const [sa, sm, sb] = [ax * ax + ay * ay, mx * mx + my * my, bx * bx + by * by];
  const c = [(sa * (my - by) + sm * (by - ay) + sb * (ay - my)) / d, (sa * (bx - mx) + sm * (ax - bx) + sb * (mx - ax)) / d];
  const angle = (p) => Math.atan2(p[1] - c[1], p[0] - c[0]);
  const turn = (x) => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const a0 = angle(a);
  const [dm, db] = [turn(angle(m) - a0), turn(angle(b) - a0)];
  return { c, r: Math.hypot(ax - c[0], ay - c[1]), a0, span: dm < db ? db : db - 2 * Math.PI };
};
const arcSvg = (arc, b) => `A${Math.round(arc.r * 1e4) / 1e4} ${Math.round(arc.r * 1e4) / 1e4} 0 ${Math.abs(arc.span) > Math.PI ? 1 : 0} ${arc.span > 0 ? 1 : 0} ${fmt(b)}`;
const arcSample = (arc) => {
  const n = 2 * Math.max(1, Math.ceil(Math.abs(arc.span) * 4)); // even, so the middle of the arc is a point
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = arc.a0 + (arc.span * k) / n;
    return [arc.c[0] + arc.r * Math.cos(t), arc.c[1] + arc.r * Math.sin(t)];
  });
};

// Wall i runs from corner i to corner i+1. "arcs[i]" bends it: the arc's middle lies that far from the straight
// line, positive to the left (seen from corner i). The returned point m is the middle of the (bent) wall.
const wallFrame = (pts, i, s = 0) => {
  const [a, b] = [pts[i], pts[(i + 1) % pts.length]];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const n = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len];
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return { a, b, mid, n, m: [mid[0] + n[0] * s, mid[1] + n[1] * s] };
};

// Rounded corner i of a polygon with radius r (shortened if the walls are too short).
const filletAt = (pts, i, r) => {
  const n = pts.length;
  const [prev, p, next] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n]];
  const l1 = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
  const l2 = Math.hypot(next[0] - p[0], next[1] - p[1]);
  if (!(r > 0) || !l1 || !l2) return null;
  const d1 = [(p[0] - prev[0]) / l1, (p[1] - prev[1]) / l1];
  const d2 = [(next[0] - p[0]) / l2, (next[1] - p[1]) / l2];
  const cross = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(cross) < 1e-9) return null;
  const tanHalf = Math.tan(Math.atan2(Math.abs(cross), d1[0] * d2[0] + d1[1] * d2[1]) / 2);
  const t = Math.min(r * tanHalf, Math.min(l1, l2) / 2);
  const rr = t / tanHalf;
  const t1 = [p[0] - d1[0] * t, p[1] - d1[1] * t];
  const t2 = [p[0] + d2[0] * t, p[1] + d2[1] * t];
  const side = cross > 0 ? [-d1[1], d1[0]] : [d1[1], -d1[0]];
  const c = [t1[0] + side[0] * rr, t1[1] + side[1] * rr];
  const dc = Math.hypot(p[0] - c[0], p[1] - c[1]) || 1;
  return { t1, t2, m: [c[0] + ((p[0] - c[0]) / dc) * rr, c[1] + ((p[1] - c[1]) / dc) * rr] };
};

/**
 * Outline of a room: SVG path, a polygon approximation (for hit tests and bounds) and its pieces
 * (straight walls, arc walls, rounded corners) for wall snap. Null if the room is invalid.
 * Rooms are "rect", "points" or "ellipse" [x1, y1, x2, y2]; "radius"/"radii" round corners, "arcs" bend walls.
 */
const roomGeometry = (room) => {
  if (isRect(room.ellipse)) {
    const [x1, y1, x2, y2] = normRect(room.ellipse);
    const [cx, cy, rx, ry] = [(x1 + x2) / 2, (y1 + y2) / 2, (x2 - x1) / 2, (y2 - y1) / 2];
    if (!rx || !ry) return null;
    const outline = Array.from({ length: 64 }, (_, k) => [cx + rx * Math.cos((k * Math.PI) / 32), cy + ry * Math.sin((k * Math.PI) / 32)]);
    return {
      d: `M${x1} ${cy} A${rx} ${ry} 0 1 1 ${x2} ${cy} A${rx} ${ry} 0 1 1 ${x1} ${cy} Z`,
      outline,
      pieces: [{ pts: [...outline, outline[0]] }],
    };
  }
  const pts = roomPoints(room);
  if (!Array.isArray(pts) || pts.length < 3 || !pts.every(isPoint)) return null;
  const n = pts.length;
  const sag = (i) => Number(room.arcs?.[(i + n) % n]) || 0;
  // Corners next to an arc wall stay sharp.
  const fil = pts.map((_, i) => (sag(i) || sag(i - 1) ? null : filletAt(pts, i, Number(room.radii?.[i] ?? room.radius) || 0)));
  const start = (i) => fil[i]?.t2 || pts[i];
  const end = (i) => fil[(i + 1) % n]?.t1 || pts[(i + 1) % n];
  let d = `M${fmt(start(0))}`;
  const pieces = [];
  for (let i = 0; i < n; i++) {
    const [a, b] = [start(i), end(i)];
    const arc = sag(i) ? arcThrough(a, wallFrame(pts, i, sag(i)).m, b) : null;
    d += arc ? arcSvg(arc, b) : `L${fmt(b)}`;
    pieces.push({ pts: arc ? arcSample(arc) : [a, b], edge: i });
    const f = fil[(i + 1) % n];
    const corner = f && arcThrough(f.t1, f.m, f.t2);
    if (corner) {
      d += arcSvg(corner, f.t2);
      pieces.push({ pts: arcSample(corner), corner: (i + 1) % n });
    }
  }
  return { d: `${d}Z`, outline: pieces.flatMap((p) => p.pts.slice(0, -1)), pieces };
};

const bbox = (points) => {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
};

// Where the room name goes: "label_position" or the middle of the room.
const roomCenter = (room) => {
  if (room.label_position) return room.label_position;
  const b = bbox(roomGeometry(room)?.outline || [[0, 0]]);
  return [(b.x1 + b.x2) / 2, (b.y1 + b.y2) / 2];
};

const allPoints = (config) => {
  const all = (config.rooms || []).flatMap((r) => roomGeometry(r)?.outline || []);
  for (const list of [config.windows, config.radiators]) (list || []).forEach((i) => all.push(i.from, i.to));
  (config.doors || []).forEach((d) => all.push(d.hinge, d.to));
  (config.stairs || []).forEach((s) => isRect(s.rect) && all.push(s.rect.slice(0, 2), s.rect.slice(2)));
  (config.elements || []).forEach((e) => all.push(e.position));
  return all.filter(isPoint);
};

// The area the card shows: the plan plus a small margin, unless "viewbox" is given.
const cardViewBox = (config) => {
  if (Array.isArray(config.viewbox) && config.viewbox.length === 4) return config.viewbox;
  const pts = allPoints(config);
  if (!pts.length) return [0, 0, 10, 8];
  const b = bbox(pts);
  const pad = config.padding ?? Math.max(b.x2 - b.x1, b.y2 - b.y1) * 0.03;
  return [b.x1 - pad, b.y1 - pad, b.x2 - b.x1 + 2 * pad, b.y2 - b.y1 + 2 * pad];
};

// Plans can be drawn in any unit (pixels of a photo, meters, centimeters).
// All line widths and font sizes scale with the plan, 1 = a plan about 900 units wide.
const unitOf = (vb) => Math.max(vb[2], vb[3]) / 900;

const OPEN_STATES = new Set(["on", "open", "opening"]);
const CLOSED_STATES = new Set(["off", "closed", "closing"]);
const ACTIVE_STATES = new Set(["on", "open", "playing", "home", "heat", "cool", "heating", "cleaning"]);

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

const radiatorRect = (rad, u) => {
  const [x1, y1] = rad.from;
  const [x2, y2] = rad.to;
  const w = rad.width ?? 8 * u;
  const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);
  return vertical
    ? { vertical, x: x1 - w / 2, y: Math.min(y1, y2), w, h: Math.abs(y2 - y1) }
    : { vertical, x: Math.min(x1, x2), y: y1 - w / 2, w: Math.abs(x2 - x1), h: w };
};

// Door: opening in the wall from hinge to "to", leaf at 90°, arc back to the wall.
// "swing" says on which side of the wall (seen from hinge towards "to") the door opens.
const doorPath = (door) => {
  const [hx, hy] = door.hinge;
  const [ex, ey] = door.to;
  const len = Math.hypot(ex - hx, ey - hy);
  if (!len) return "";
  const [dx, dy] = [(ex - hx) / len, (ey - hy) / len];
  const left = (door.swing || "left") === "left";
  const [nx, ny] = left ? [dy, -dx] : [-dy, dx];
  return `M${hx} ${hy} L${hx + nx * len} ${hy + ny * len} A${len} ${len} 0 0 ${left ? 1 : 0} ${ex} ${ey}`;
};

// Stairs: rectangle with step lines across and an arrow pointing the way up.
const stairsMarkup = (stairs, i, u, language) => {
  if (!isRect(stairs.rect)) return "";
  const [x1, y1, x2, y2] = normRect(stairs.rect);
  const [w, h] = [x2 - x1, y2 - y1];
  const dir = stairs.direction || (h >= w ? "up" : "right");
  const vertical = dir === "up" || dir === "down";
  const [len, cross] = vertical ? [h, w] : [w, h];
  const n = Math.max(2, Math.round(stairs.steps ?? Math.min(20, Math.max(4, (len / cross) * 4))));
  const steps = [];
  for (let k = 1; k < n; k++) {
    steps.push(
      vertical
        ? `<line class="stair-step" x1="${x1}" y1="${y1 + (k * h) / n}" x2="${x2}" y2="${y1 + (k * h) / n}"/>`
        : `<line class="stair-step" x1="${x1 + (k * w) / n}" y1="${y1}" x2="${x1 + (k * w) / n}" y2="${y2}"/>`
    );
  }
  const [cx, cy] = [(x1 + x2) / 2, (y1 + y2) / 2];
  const m = len * 0.1;
  const [sx, sy, ex, ey] = {
    up: [cx, y2 - m, cx, y1 + m],
    down: [cx, y1 + m, cx, y2 - m],
    left: [x2 - m, cy, x1 + m, cy],
    right: [x1 + m, cy, x2 - m, cy],
  }[dir];
  const a = Math.min(cross * 0.25, len * 0.15);
  const [ux, uy] = [(ex - sx) / Math.hypot(ex - sx, ey - sy), (ey - sy) / Math.hypot(ex - sx, ey - sy)];
  const head = `M${ex - ux * a - uy * a * 0.7} ${ey - uy * a + ux * a * 0.7} L${ex} ${ey} L${ex - ux * a + uy * a * 0.7} ${ey - uy * a - ux * a * 0.7}`;
  const click = stairs.navigation_path || stairs.tap_action ? ` data-action="stairs" data-index="${i}"` : "";
  const label = stairs.name ?? t("up", {}, language);
  return `<g class="stairs"${click}><title>${esc(stairs.name || "")}</title>
    <rect class="stair-body" x="${x1}" y="${y1}" width="${w}" height="${h}"/>${steps.join("")}
    <path class="stair-arrow" d="M${sx} ${sy} L${ex} ${ey} ${head}"/>
    <circle class="stair-start" cx="${sx}" cy="${sy}" r="${2.5 * u}"/>
    ${label ? `<text class="small stair-label" x="${sx - ux * 0}" y="${sy}" dy="${vertical ? (dir === "up" ? 11 : -11) * u : 0}" dx="${vertical ? 0 : (dir === "left" ? 14 : -14) * u}">${esc(label)}</text>` : ""}</g>`;
};

// Sizes inside the SVG, in plan units.
const planStyle = (u) => `
  .room, .outdoor { stroke-width: ${3 * u}; }
  .outdoor { stroke-width: ${2 * u}; stroke-dasharray: ${10 * u} ${6 * u}; }
  .zone { stroke-width: ${1.5 * u}; stroke-dasharray: ${6 * u} ${5 * u}; }
  .gap { stroke-width: ${6 * u}; }
  .door { stroke-width: ${1.5 * u}; }
  .name { font-size: ${18 * u}px; }
  .small { font-size: ${13 * u}px; }
  .stair-label { stroke-width: ${3 * u}; }
  .window .frame { stroke-width: ${8 * u}; }
  .window .glass { stroke-width: ${2 * u}; }
  .window .hit { stroke-width: ${16 * u}; }
  .radiator .body { stroke-width: ${1.5 * u}; }
  .radiator .fins { stroke-width: ${5 * u}; stroke-dasharray: ${2 * u} ${4 * u}; }
  .stair-body { stroke-width: ${1.5 * u}; }
  .stair-step { stroke-width: ${1 * u}; }
  .stair-arrow { stroke-width: ${1.5 * u}; }
`;

/** The plan itself (rooms, stairs, doors, windows, radiators, labels) as SVG markup. Used by card and editor. */
const planMarkup = (config, hass, vb, language) => {
  const u = unitOf(vb);
  const st = (id) => (id ? hass?.states?.[id] : undefined);

  const rooms = (config.rooms || [])
    .map((room, i) => {
      const geo = roomGeometry(room);
      if (!geo) return "";
      const kind = ["outdoor", "zone"].includes(room.type) ? room.type : "room";
      const active = room.entity && ACTIVE_STATES.has(st(room.entity)?.state) ? " active" : "";
      const click = room.tap_action || room.navigation_path || room.entity ? ` data-action="room" data-index="${i}"` : "";
      if (kind === "zone" && isRect(room.rect) && !room.radius && !room.radii && !room.arcs) {
        const [x1, y1, x2, y2] = normRect(room.rect);
        return `<rect class="${kind}${active}"${click} x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" rx="${8 * u}"/>`;
      }
      return `<path class="${kind}${active}"${click} d="${geo.d}"/>`;
    })
    .join("");

  const stairs = (config.stairs || []).map((s, i) => stairsMarkup(s, i, u, language)).join("");

  const doors = (config.doors || [])
    .map((door) => {
      const d = doorPath(door);
      if (!d) return "";
      const [[hx, hy], [ex, ey]] = [door.hinge, door.to];
      const gap = door.gap === false ? "" : `<line class="gap" x1="${hx}" y1="${hy}" x2="${ex}" y2="${ey}"/>`;
      return `${gap}<path class="door" d="${d}"/>`;
    })
    .join("");

  const windows = (config.windows || [])
    .map((win, i) => {
      const stateObj = st(win.entity);
      const s = windowState(stateObj);
      const [x1, y1] = win.from;
      const [x2, y2] = win.to;
      const title = win.name || stateObj?.attributes.friendly_name || "";
      const label = s === "neutral" ? "" : ` – ${t(s, {}, language)}`;
      const click = win.entity ? ` data-action="window" data-index="${i}"` : "";
      return `<g class="window ${s}"${click}><title>${esc(title)}${label}</title>
        <line class="frame" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
        <line class="glass" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
        <line class="hit" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/></g>`;
    })
    .join("");

  const radiators = (config.radiators || [])
    .map((rad, i) => {
      const stateObj = st(rad.entity);
      const s = radiatorState(stateObj);
      const r = radiatorRect(rad, u);
      const [x1, y1] = rad.from;
      let title = rad.name || stateObj?.attributes.friendly_name || "";
      if (stateObj) {
        const a = stateObj.attributes;
        const temps = [a.current_temperature, a.temperature].filter((v) => v != null).join(" → ");
        title += ` – ${t(s, {}, language)}${temps ? ` (${temps} °)` : ""}`;
      }
      const click = rad.entity ? ` data-action="radiator" data-index="${i}"` : "";
      const p = 3 * u;
      const fins = r.vertical
        ? `x1="${x1}" y1="${r.y + p}" x2="${x1}" y2="${r.y + r.h - p}"`
        : `x1="${r.x + p}" y1="${y1}" x2="${r.x + r.w - p}" y2="${y1}"`;
      return `<g class="radiator ${s}"${click}><title>${esc(title)}</title>
        <rect class="hit" x="${r.x - 6 * u}" y="${r.y - 6 * u}" width="${r.w + 12 * u}" height="${r.h + 12 * u}"/>
        <rect class="body" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${2 * u}"/>
        <line class="fins" ${fins}/></g>`;
    })
    .join("");

  const roomLabels = (config.rooms || []).map((room) => {
    if (room.label === false || !room.name || !roomGeometry(room)) return "";
    const [x, y] = roomCenter(room);
    const size = room.label_size === "small" || room.type === "zone" ? "small" : "name";
    return `<text class="${size}" x="${x}" y="${y}">${esc(room.name)}</text>`;
  });
  const freeLabels = (config.labels || []).map((l) =>
    isPoint(l.position) ? `<text class="${l.size === "small" ? "small" : "name"}" x="${l.position[0]}" y="${l.position[1]}">${esc(l.text)}</text>` : ""
  );

  return `<style>${planStyle(u)}</style>${rooms}${stairs}${doors}${windows}${radiators}${roomLabels.join("")}${freeLabels.join("")}`;
};

const elementValue = (hass, stateObj) =>
  stateObj ? (hass.formatEntityState?.(stateObj) ?? `${stateObj.state} ${stateObj.attributes.unit_of_measurement || ""}`.trim()) : "–";

// Colors follow the HA theme; every one can be overridden with these variables.
const THEME_VARS = `
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
`;

const PLAN_CSS = `
  svg .room, svg .outdoor { fill: var(--fp-room); stroke: var(--fp-wall); stroke-linejoin: round; transition: fill .3s; }
  svg .outdoor { fill-opacity: .4; }
  svg .zone { fill: none; stroke: var(--fp-wall); stroke-opacity: .7; }
  svg .room.active { fill: var(--fp-room-active); }
  svg .gap { stroke: var(--fp-room); }
  svg .door { fill: none; stroke: var(--fp-wall); }
  svg .name, svg .small { text-anchor: middle; dominant-baseline: central; pointer-events: none; font-family: var(--ha-font-family-body, Roboto, sans-serif); }
  svg .name { fill: var(--fp-text); font-weight: 600; }
  svg .small { fill: var(--fp-text-small); font-weight: 500; }
  svg .stair-body { fill: var(--fp-room); stroke: var(--fp-wall); }
  svg .stair-step { stroke: var(--fp-wall); stroke-opacity: .7; }
  svg .stair-arrow { fill: none; stroke: var(--fp-text); stroke-linecap: round; stroke-linejoin: round; }
  svg .stair-start { fill: var(--fp-text); }
  svg .stair-label { paint-order: stroke; stroke: var(--fp-room); }
  svg .window .frame { stroke: var(--fp-window); transition: stroke .3s; }
  svg .window .glass { stroke: var(--fp-room); }
  svg .window .hit { stroke: transparent; }
  svg .window:not([data-action]) .hit { pointer-events: none; }
  svg .window.open .frame { stroke: var(--fp-window-open); animation: fp-pulse 1.6s ease-in-out infinite; }
  svg .window.closed .frame { stroke: var(--fp-window-closed); }
  svg .window.unknown .frame { stroke: var(--fp-window-unknown); }
  svg .radiator .hit { fill: transparent; }
  svg .radiator:not([data-action]) .hit { pointer-events: none; }
  svg .radiator .body { fill: color-mix(in srgb, var(--fp-radiator) 15%, var(--fp-room)); stroke: var(--fp-radiator); }
  svg .radiator .fins { stroke: var(--fp-radiator); }
  svg .radiator.off, svg .radiator.unknown { opacity: .45; }
  svg .radiator.heating .body { fill: var(--fp-radiator); animation: fp-pulse 2.4s ease-in-out infinite; }
  @keyframes fp-pulse { 50% { opacity: .35; } }
  @media (prefers-reduced-motion: reduce) { svg .window.open .frame, svg .radiator.heating .body { animation: none; } }
  .chip {
    color: var(--fp-chip); white-space: nowrap; font-size: 12px; line-height: 18px; padding: 0 5px; border-radius: 6px;
    background: color-mix(in srgb, var(--fp-chip) 15%, transparent); border: 1px solid color-mix(in srgb, var(--fp-chip) 60%, transparent);
  }
  .icon { --mdc-icon-size: 22px; color: var(--state-icon-color, var(--paper-item-icon-color)); }
  .icon.active { color: var(--state-active-color, var(--paper-item-icon-active-color, #fdd835)); }
`;

class FloorplanCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("floorplan-card-editor");
  }

  static getStubConfig() {
    // A small example in meters.
    return {
      rooms: [
        { name: "Living room", rect: [0, 0, 5, 4] },
        { name: "Kitchen", rect: [5, 0, 8, 4] },
      ],
      windows: [{ from: [1, 0], to: [3, 0] }],
      doors: [{ hinge: [5, 2.6], to: [5, 3.5], swing: "left" }],
    };
  }

  setConfig(config) {
    const lang = langOf(this._hass);
    if (!Array.isArray(config.rooms) || config.rooms.length === 0) throw new Error(t("no_rooms", {}, lang));
    config.rooms.forEach((room) => {
      if (!roomGeometry(room)) throw new Error(t("bad_points", { name: room.name ?? "?" }, lang));
    });
    for (const [kind, list] of [["Window", config.windows], ["Radiator", config.radiators]]) {
      (list || []).forEach((item, i) => {
        if (!isPoint(item.from) || !isPoint(item.to)) throw new Error(t("bad_line", { kind, n: i + 1 }, lang));
      });
    }
    (config.doors || []).forEach((door, i) => {
      if (!isPoint(door.hinge) || !isPoint(door.to)) throw new Error(t("bad_door", { n: i + 1 }, lang));
    });
    (config.stairs || []).forEach((s, i) => {
      if (!isRect(s.rect)) throw new Error(t("bad_stairs", { n: i + 1 }, lang));
    });
    (config.elements || []).forEach((el, i) => {
      if (!isPoint(el.position)) throw new Error(t("bad_element", { n: i + 1 }, lang));
    });

    this._config = config;
    this._viewBox = cardViewBox(config);
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

  _element(el, i) {
    if (!el.entity) return "";
    const [vx, vy, vw, vh] = this._viewBox;
    const left = ((el.position[0] - vx) / vw) * 100;
    const top = ((el.position[1] - vy) / vh) * 100;
    const stateObj = this._hass.states[el.entity];
    const title = esc(el.title || stateObj?.attributes.friendly_name || el.entity);
    const pos = `style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%"`;
    if ((el.type || "icon") === "state") {
      return `<span class="chip" ${pos} title="${title}" data-action="element" data-index="${i}">${esc(el.prefix || "")}${esc(elementValue(this._hass, stateObj))}${esc(el.suffix || "")}</span>`;
    }
    const active = stateObj && ACTIVE_STATES.has(stateObj.state) ? " active" : "";
    const icon = el.icon ? ` icon="${esc(el.icon)}"` : "";
    return `<ha-state-icon class="icon${active}" ${pos} title="${title}" data-action="element" data-index="${i}" data-entity="${esc(el.entity)}"${icon}></ha-state-icon>`;
  }

  _render() {
    const c = this._config;
    const vb = this._viewBox;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    }
    const elements = (c.elements || []).map((e, i) => this._element(e, i)).join("");
    this.shadowRoot.innerHTML = `
      <style>${FloorplanCard.styles}</style>
      <ha-card${c.title ? ` header="${esc(c.title)}"` : ""}>
        <div class="plan" style="aspect-ratio:${vb[2]} / ${vb[3]}">
          <svg viewBox="${vb.join(" ")}" role="img" aria-label="${esc(c.title || "Floorplan")}">
            ${planMarkup(c, this._hass, vb, langOf(this._hass))}
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
    const list = { room: "rooms", window: "windows", radiator: "radiators", stairs: "stairs", element: "elements" }[target.dataset.action];
    const item = this._config[list][Number(target.dataset.index)];
    const action =
      item.tap_action ||
      (item.navigation_path ? { action: "navigate", navigation_path: item.navigation_path } : { action: "more-info" });
    this._handleAction(action, item.entity);
  }

  _handleAction(action, entity) {
    if (action.confirmation && !window.confirm(action.confirmation.text || t("confirm", {}, langOf(this._hass)))) return;
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
  :host { ${THEME_VARS} }
  ha-card { overflow: hidden; }
  .plan { position: relative; width: 100%; }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  [data-action] { cursor: pointer; }
  svg .zone[data-action] { pointer-events: all; fill: transparent; }
  .overlay { position: absolute; inset: 0; pointer-events: none; }
  .overlay > * { position: absolute; transform: translate(-50%, -50%); pointer-events: auto; cursor: pointer; }
  ${PLAN_CSS}
`;

/* ------------------------------------------------------------------------------------------------
 * Visual editor
 * ---------------------------------------------------------------------------------------------- */

const LISTS = { room: "rooms", window: "windows", door: "doors", radiator: "radiators", stairs: "stairs", element: "elements", label: "labels" };
const GRID_STEPS = [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100];
const ENTITY_DOMAINS = {
  window: ["binary_sensor", "cover", "input_boolean"],
  radiator: ["climate"],
  room: ["light", "switch", "input_boolean", "fan"],
  element: null,
};
// Ribbon like in CAD programs: tabs → panels → buttons.
// ["tool", mode, icon, label] picks a drawing tool, ["cmd", command, icon, label] runs a command,
// ["field", name] is an input: the radius for rounding corners, the unit of the plan or the opacity of the template image.
const RIBBON = [
  ["tab_trace", [
    ["panel_trace_image", [
      ["cmd", "trace-upload", "mdi:image-plus-outline", "trace_upload"],
      ["cmd", "trace-toggle", "mdi:eye-off-outline", "trace_hide"],
      ["cmd", "trace-remove", "mdi:image-remove-outline", "trace_remove"],
    ]],
    ["panel_unit", [["field", "unit"]]],
    ["panel_trace_adjust", [["tool", "trace-move", "mdi:cursor-move", "trace_move"], ["tool", "trace-scale", "mdi:ruler", "trace_scale"], ["field", "opacity"]]],
  ]],
  ["tab_draw", [
    ["panel_rooms", [
      ["tool", "room-rect", "mdi:square-outline", "tool_room_rect"],
      ["tool", "room-poly", "mdi:vector-polygon", "tool_room_poly"],
      ["tool", "room-ellipse", "mdi:circle-outline", "tool_room_ellipse"],
    ]],
    ["panel_modify", [["tool", "fillet", "mdi:rounded-corner", "tool_fillet"], ["tool", "arc", "mdi:vector-curve", "tool_arc"], ["field", "radius"]]],
    ["panel_openings", [["tool", "window", "mdi:window-closed-variant", "tool_window"], ["tool", "door", "mdi:door", "tool_door"]]],
    ["panel_snap", "snaps"],
  ]],
  ["tab_insert", [
    ["panel_fixtures", [["tool", "radiator", "mdi:radiator", "tool_radiator"], ["tool", "stairs", "mdi:stairs", "tool_stairs"]]],
    ["panel_ha", [["tool", "element", "mdi:map-marker-plus-outline", "tool_element"]]],
    ["panel_text", [["tool", "label", "mdi:format-text", "tool_label"]]],
  ]],
  ["tab_view", [
    ["panel_zoom", [["cmd", "zoom-in", "mdi:magnify-plus-outline", "zoom_in"], ["cmd", "zoom-out", "mdi:magnify-minus-outline", "zoom_out"], ["cmd", "zoom-fit", "mdi:fit-to-screen-outline", "zoom_fit"]]],
    ["panel_display", [["cmd", "fullscreen", "mdi:fullscreen", "fullscreen"]]],
  ]],
];
const STAIR_DIRS = [["up", "mdi:arrow-up"], ["down", "mdi:arrow-down"], ["left", "mdi:arrow-left"], ["right", "mdi:arrow-right"]];

const projectOnSegment = (p, a, b) => {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l2 = dx * dx + dy * dy;
  const k = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2)) : 0;
  return [a[0] + k * dx, a[1] + k * dy];
};

const insidePolygon = ([x, y], pts) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

// Which side of the door line (hinge → to) a point lies on, as door "swing".
const sideOf = (door, p) => {
  const [dx, dy] = [door.to[0] - door.hinge[0], door.to[1] - door.hinge[1]];
  return (p[0] - door.hinge[0]) * dy - (p[1] - door.hinge[1]) * dx >= 0 ? "left" : "right";
};

// Points that make up an object, e.g. to test whether it lies inside a selection frame.
const objectPoints = (kind, item) => {
  if (kind === "room") return roomGeometry(item)?.outline || [];
  if (kind === "window" || kind === "radiator") return [item.from, item.to];
  if (kind === "door") return [item.hinge, item.to];
  if (kind === "stairs") return isRect(item.rect) ? [item.rect.slice(0, 2), item.rect.slice(2)] : [];
  return [item.position];
};

// A copy of an object moved by "delta".
const shiftObject = (kind, o, delta) => {
  const sh = (pt) => [round(pt[0] + delta[0]), round(pt[1] + delta[1])];
  const item = clone(o);
  if (kind === "room") {
    if (isRect(item.rect)) item.rect = [...sh(item.rect.slice(0, 2)), ...sh(item.rect.slice(2))];
    else if (isRect(item.ellipse)) item.ellipse = [...sh(item.ellipse.slice(0, 2)), ...sh(item.ellipse.slice(2))];
    else item.points = item.points.map(sh);
    if (item.label_position) item.label_position = sh(item.label_position);
  } else if (kind === "window" || kind === "radiator") {
    [item.from, item.to] = [sh(o.from), sh(o.to)];
  } else if (kind === "door") {
    [item.hinge, item.to] = [sh(o.hinge), sh(o.to)];
  } else if (kind === "stairs") {
    item.rect = [...sh(o.rect.slice(0, 2)), ...sh(o.rect.slice(2))];
  } else {
    item.position = sh(o.position);
  }
  return item;
};

const distToPolyline = (p, pts) => {
  let best = Infinity;
  for (let k = 0; k < pts.length - 1; k++) {
    const q = projectOnSegment(p, pts[k], pts[k + 1]);
    best = Math.min(best, Math.hypot(q[0] - p[0], q[1] - p[1]));
  }
  return best;
};

// Per-corner radii and per-wall arcs are lists along the corners; empty lists are left out of the config.
const setCornerRadius = (room, i, r) => {
  const radii = roomPoints(room).map((_, k) => Number(room.radii?.[k] ?? room.radius) || 0);
  radii[i] = r;
  delete room.radius;
  if (radii.some(Boolean)) room.radii = radii;
  else delete room.radii;
};

const setWallArc = (room, i, s) => {
  const arcs = roomPoints(room).map((_, k) => Number(room.arcs?.[k]) || 0);
  arcs[i] = s;
  if (arcs.some(Boolean)) room.arcs = arcs;
  else delete room.arcs;
};

// Template image to trace a floor plan from, shown only in the editor:
// trace_image: { url, position: [x, y] (top left), size: [w, h], rotation (degrees around the center), opacity, show }
const isTraceImage = (img) =>
  Boolean(img && typeof img.url === "string" && img.url && isPoint(img.position) && isPoint(img.size) && img.size[0] > 0 && img.size[1] > 0);
const traceCenter = (img) => [img.position[0] + img.size[0] / 2, img.position[1] + img.size[1] / 2];
const traceCorners = (img) => {
  const [cx, cy] = traceCenter(img);
  const a = ((Number(img.rotation) || 0) * Math.PI) / 180;
  const [hw, hh] = [img.size[0] / 2, img.size[1] / 2];
  return [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
};
const traceOpacity = (img) => Math.min(1, Math.max(0.1, Number(img.opacity ?? 0.5) || 0.5));
const TRACE_TYPES = ["image/png", "image/jpeg", "image/gif"];
// Unit of the plan coordinates ("unit" in the config). Only a label: changing it does not convert the plan.
const UNITS = ["m", "cm", "mm"];
const imageSize = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => (img.naturalWidth && img.naturalHeight ? resolve([img.naturalWidth, img.naturalHeight]) : reject(new Error("no size")));
    img.onerror = () => reject(new Error(url));
    img.src = url;
  });

class FloorplanCardEditor extends HTMLElement {
  constructor() {
    super();
    this._mode = "select";
    this._sels = []; // selected objects: [{ kind, index }]
    this._draft = []; // polygon room being drawn
    this._pending = null; // first click of a two-click tool
    this._doorDraft = null; // door after two clicks, waiting for the side
    this._arcEdge = null; // wall picked with the arc tool, waiting for the bend: { room, edge }
    this._filletR = null; // radius for rounding corners, null = from the grid
    this._calib = null; // points clicked on the template image to set its scale
    this._notice = null; // message shown instead of the hint (upload running, failed, ...)
    this._shift = false;
    this._cursor = null;
    this._drag = null; // moving objects or handles
    this._band = null; // selection frame
    this._pan = null; // moving the view
    this._pinch = null; // two-finger zoom
    this._pointers = new Map();
    this._space = false;
    this._history = [];
    this._wallSnap = true;
    this._ortho = true;
    this._aspect = 4 / 3; // width/height of the drawing area
    this._tab = "tab_draw";
  }

  setConfig(config) {
    this._config = clone(config);
    for (const list of Object.values(LISTS)) if (this._config[list] && !Array.isArray(this._config[list])) delete this._config[list];
    if (this._drag) return;
    if (!this._built) {
      if (this._hass) this._build();
      return;
    }
    this._sels = this._sels.filter((s) => this._item(s));
    this._renderAll();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first && this._config) this._build();
  }

  get _lang() {
    return langOf(this._hass);
  }

  _t(key, vars) {
    return t(key, vars, this._lang);
  }

  _item(sel) {
    return sel && this._config[LISTS[sel.kind]]?.[sel.index];
  }

  // The single selected object (for handles and properties), null if none or several.
  get _sel() {
    return this._sels.length === 1 ? this._sels[0] : null;
  }

  _select(kind, index) {
    this._sels = kind ? [{ kind, index }] : [];
  }

  _isSel(kind, index) {
    return this._sels.some((s) => s.kind === kind && s.index === index);
  }

  // Size unit of the finished card, so walls, radiators etc. look exactly like in the card at any zoom.
  get _u() {
    return unitOf(cardViewBox(this._config));
  }

  // Unit of the plan, "" if none is set.
  get _unit() {
    return UNITS.includes(this._config.unit) ? this._config.unit : "";
  }

  // The template image, if there is a valid one; _traceShown only while it is not hidden.
  get _trace() {
    return isTraceImage(this._config.trace_image) ? this._config.trace_image : null;
  }

  get _traceShown() {
    return this._trace?.show === false ? null : this._trace;
  }

  // Everything the view should be able to show: the plan and the template image.
  _extentPoints() {
    return allPoints(this._config).concat(this._trace ? traceCorners(this._trace) : []);
  }

  // --- view: fit, zoom, pan -----------------------------------------------------------------------

  _fitView() {
    const pts = this._extentPoints();
    if (!pts.length) {
      this._vb = [-1, -1, 12, 9];
    } else {
      const b = bbox(pts);
      const size = Math.max(b.x2 - b.x1, b.y2 - b.y1, 1e-6);
      const pad = size * 0.12;
      this._vb = [b.x1 - pad, b.y1 - pad, b.x2 - b.x1 + 2 * pad, b.y2 - b.y1 + 2 * pad];
    }
    this._matchAspect();
    if (!this._grid) {
      const size = Math.max(this._vb[2], this._vb[3]);
      this._grid = [...GRID_STEPS].reverse().find((s) => s <= size / 60) || GRID_STEPS[0];
    }
  }

  // Widen or heighten the view around its center to the shape of the drawing area.
  _matchAspect() {
    const [x, y, w, h] = this._vb;
    if (w / h < this._aspect) {
      const nw = h * this._aspect;
      this._vb = [x - (nw - w) / 2, y, nw, h];
    } else {
      const nh = w / this._aspect;
      this._vb = [x, y - (nh - h) / 2, w, nh];
    }
  }

  _zoomAt(p, factor) {
    const [x, y, w, h] = this._vb;
    const size = Math.max(...(() => {
      const b = bbox(this._extentPoints().concat([[0, 0]]));
      return [b.x2 - b.x1, b.y2 - b.y1, 1e-6];
    })());
    const nw = w * factor;
    if (nw < size / 40 || nw > size * 20) return;
    this._vb = [p[0] - (p[0] - x) * factor, p[1] - (p[1] - y) * factor, nw, h * factor];
    this._renderCanvas();
  }

  _zoomCenter(factor) {
    const [x, y, w, h] = this._vb;
    this._zoomAt([x + w / 2, y + h / 2], factor);
  }

  // Screen point (client coordinates) → plan coordinates for a given view box.
  _screenToPlan(cx, cy, vb = this._vb) {
    const rect = this._svg.getBoundingClientRect();
    return [vb[0] + ((cx - rect.left) / rect.width) * vb[2], vb[1] + ((cy - rect.top) / rect.height) * vb[3]];
  }

  // --- building and rendering ---------------------------------------------------------------------

  _build() {
    this._built = true;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>${FloorplanCardEditor.styles}</style>
      <div class="ribbon-wrap">
        <div class="qat"></div>
        <div class="tabs"></div>
        <div class="ribbon"></div>
      </div>
      <div class="hint"></div>
      <div class="canvas" tabindex="0">
        <svg></svg>
        <div class="overlay"></div>
      </div>
      <div class="statusbar"><span class="coords"></span><span class="nav">${esc(this._t("nav_hint"))}</span></div>
      <div class="panel"></div>
      <input type="file" class="tracefile" accept="${TRACE_TYPES.join(",")}" hidden>`;
    this._svg = this.shadowRoot.querySelector("svg");
    const canvas = this.shadowRoot.querySelector(".canvas");
    const file = this.shadowRoot.querySelector(".tracefile");
    file.addEventListener("change", () => {
      if (file.files[0]) this._uploadTrace(file.files[0]);
      file.value = "";
    });
    // An image file dropped onto the drawing area becomes the template image.
    canvas.addEventListener("dragover", (ev) => {
      if ([...(ev.dataTransfer?.types || [])].includes("Files")) ev.preventDefault();
    });
    canvas.addEventListener("drop", (ev) => {
      const dropped = ev.dataTransfer?.files?.[0];
      if (!dropped) return;
      ev.preventDefault();
      this._uploadTrace(dropped);
    });
    this._svg.addEventListener("pointerdown", (ev) => this._onDown(ev));
    this._svg.addEventListener("pointermove", (ev) => this._onMove(ev));
    this._svg.addEventListener("pointerup", (ev) => this._onUp(ev));
    this._svg.addEventListener("pointercancel", (ev) => this._onUp(ev));
    this._svg.addEventListener("pointerleave", () => {
      this._cursor = null;
      if (!this._drag && !this._band) this._renderCanvas();
    });
    this._svg.addEventListener("contextmenu", (ev) => ev.preventDefault());
    this._svg.addEventListener(
      "wheel",
      (ev) => {
        ev.preventDefault();
        this._zoomAt(this._toPlan(ev), Math.exp(Math.max(-60, Math.min(60, ev.deltaY)) * 0.004));
      },
      { passive: false }
    );
    canvas.addEventListener("keydown", (ev) => this._onKey(ev));
    // Escape only cancels the current action: it must not close HA's dialog (cancelling keydown stops its close request).
    this.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape") return;
      ev.preventDefault();
      ev.stopPropagation();
    });
    canvas.addEventListener("keyup", (ev) => {
      if (ev.key === " ") this._space = false;
    });
    for (const sel of [".qat", ".tabs", ".ribbon"]) this.shadowRoot.querySelector(sel).addEventListener("click", (ev) => this._onToolbar(ev));
    // The mouse wheel scrolls the ribbon sideways when it does not fit.
    const ribbon = this.shadowRoot.querySelector(".ribbon");
    ribbon.addEventListener(
      "wheel",
      (ev) => {
        if (ribbon.scrollWidth <= ribbon.clientWidth || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return;
        ev.preventDefault();
        ribbon.scrollLeft += ev.deltaY;
      },
      { passive: false }
    );
    // Opacity: follow the slider live, store it when it is released.
    this.shadowRoot.querySelector(".ribbon").addEventListener("input", (ev) => {
      const img = ev.target.dataset.cmd === "opacity" && this._svg.querySelector(".trace image");
      if (img) img.style.opacity = ev.target.value;
    });
    this.shadowRoot.querySelector(".ribbon").addEventListener("change", (ev) => {
      if (ev.target.dataset.cmd === "unit") {
        this._change((c) => {
          if (ev.target.value) c.unit = ev.target.value;
          else delete c.unit;
        });
        return;
      }
      if (ev.target.dataset.cmd === "opacity") {
        if (this._trace) this._change((c) => (c.trace_image.opacity = Number(ev.target.value)));
        return;
      }
      if (ev.target.dataset.cmd === "grid") this._grid = Number(ev.target.value);
      else if (ev.target.dataset.cmd === "radius") this._filletR = Math.max(0, Number(ev.target.value) || 0);
      else return;
      this._renderCanvas();
    });
    this.shadowRoot.querySelector(".panel").addEventListener("change", (ev) => this._onPanelChange(ev));
    this.shadowRoot.querySelector(".panel").addEventListener("click", (ev) => this._onPanelClick(ev));
    this.shadowRoot.querySelector(".panel").addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && ev.target.dataset.trace === "distance") this._applyCalib(ev.target.value);
    });
    // Follow the size of the drawing area (dialog width, full screen), keeping the current zoom.
    new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height || Math.abs(width / height - this._aspect) < 0.01) return;
      this._aspect = width / height;
      if (this._vb) {
        const [x, y, w, h] = this._vb;
        const nh = w / this._aspect;
        this._vb = [x, y + (h - nh) / 2, w, nh];
      } else this._fitView();
      this._renderCanvas();
    }).observe(canvas);
    document.addEventListener("fullscreenchange", () => {
      if (!this._isFullscreen) navigator.keyboard?.unlock?.();
      this._renderToolbar();
    });
    this._fitView();
    this._renderAll();
  }

  _renderAll() {
    this._renderToolbar();
    this._renderCanvas();
    this._renderPanel();
  }

  _renderToolbar() {
    const root = this.shadowRoot;
    const full = this._isFullscreen;
    const small = (cmd, mdi, label, disabled = false) =>
      `<button data-cmd="${cmd}"${disabled ? " disabled" : ""} title="${esc(this._t(label))}"><ha-icon icon="${mdi}"></ha-icon></button>`;

    // Quick access: always visible, like the quick access toolbar in CAD programs.
    root.querySelector(".qat").innerHTML = `
      <button class="${this._mode === "select" ? "on" : ""}" data-tool="select" title="${esc(this._t("tool_select"))}"><ha-icon icon="mdi:cursor-default-outline"></ha-icon>${esc(this._t("tool_select"))}</button>
      ${small("undo", "mdi:undo", "undo", !this._history.length)}
      ${small("delete", "mdi:delete-outline", "delete", !this._sels.length)}
      <span class="spacer"></span>
      ${this._mode === "room-poly" && this._draft.length >= 3 ? `<button data-cmd="finish">${esc(this._t("finish"))}</button>` : ""}
      ${this._drafting ? `<button data-cmd="cancel">${esc(this._t("cancel"))}</button>` : ""}
      ${full ? this._saveButton() : ""}
      ${small("fullscreen", full ? "mdi:fullscreen-exit" : "mdi:fullscreen", "fullscreen")}`;

    root.querySelector(".tabs").innerHTML = RIBBON.map(
      ([tab]) => `<button class="tab${this._tab === tab ? " on" : ""}" data-tab="${tab}">${esc(this._t(tab))}</button>`
    ).join("");

    const gridOptions = GRID_STEPS.map((s) => `<option value="${s}"${s === this._grid ? " selected" : ""}>${s}</option>`).join("");
    const snaps = `<div class="stack">
        <label class="field"><ha-icon icon="mdi:grid"></ha-icon>${esc(this._t("grid"))} <select data-cmd="grid">${gridOptions}</select></label>
        <button class="toggle${this._ortho ? " on" : ""}" data-cmd="ortho" title="${esc(this._t("ortho_title"))}"><ha-icon icon="mdi:angle-right"></ha-icon>${esc(this._t("ortho"))}</button>
        <button class="toggle${this._wallSnap ? " on" : ""}" data-cmd="wallsnap" title="${esc(this._t("wall_snap_title"))}"><ha-icon icon="mdi:magnet"></ha-icon>${esc(this._t("wall_snap"))}</button>
      </div>`;
    const panels = RIBBON.find(([tab]) => tab === this._tab)[1];
    const img = this._trace;
    root.querySelector(".ribbon").innerHTML = panels
      .map(([panel, buttons]) => {
        const body =
          buttons === "snaps"
            ? snaps
            : buttons
                .map(([type, id, mdi, label]) => {
                  if (type === "field" && id === "unit") {
                    const opts = ["", ...UNITS].map((v) => `<option value="${v}"${v === this._unit ? " selected" : ""}>${esc(v || this._t("unit_none"))}</option>`).join("");
                    return `<div class="stack"><label class="field"><ha-icon icon="mdi:ruler-square"></ha-icon>${esc(this._t("unit"))}</label>
                      <select data-cmd="unit">${opts}</select></div>`;
                  }
                  if (type === "field" && id === "opacity") {
                    return `<div class="stack"><label class="field"><ha-icon icon="mdi:circle-opacity"></ha-icon>${esc(this._t("opacity"))}</label>
                      <input type="range" data-cmd="opacity" min="0.1" max="1" step="0.05" value="${img ? traceOpacity(img) : 0.5}"${img ? "" : " disabled"}></div>`;
                  }
                  if (type === "field") {
                    return `<div class="stack"><label class="field"><ha-icon icon="mdi:radius-outline"></ha-icon>${esc(this._t("radius"))}
                      <input type="number" data-cmd="radius" min="0" step="${this._grid}" value="${this._radius}"></label></div>`;
                  }
                  const on = type === "tool" ? this._mode === id : false;
                  let icon = id === "fullscreen" && full ? "mdi:fullscreen-exit" : mdi;
                  if (id === "trace-toggle" && img?.show === false) [icon, label] = ["mdi:eye-outline", "trace_show"];
                  // Template image commands need an image, its tools a visible one.
                  const off = id.startsWith("trace-") && id !== "trace-upload" && (!img || (type === "tool" && img.show === false));
                  return `<button class="big${on ? " on" : ""}" data-${type}="${id}"${off ? " disabled" : ""} title="${esc(this._t(label))}"><ha-icon icon="${icon}"></ha-icon><span>${esc(this._t(label))}</span></button>`;
                })
                .join("");
        return `<div class="rpanel"><div class="rbody">${body}</div><div class="rtitle">${esc(this._t(panel))}</div></div>`;
      })
      .join("");

    let hint = this._mode === "door" && this._doorDraft ? "hint_door3" : this._mode === "arc" && this._arcEdge ? "hint_arc2" : `hint_${this._mode}`;
    if (this._mode === "trace-scale" && this._calib?.length === 2) hint = "hint_trace-scale2";
    else if (this._mode === "select" && this._tab === "tab_trace" && !this._sels.length) hint = img ? "hint_trace_ready" : "hint_trace";
    root.querySelector(".hint").textContent = this._notice || this._t(hint);
    this._renderCoords();
  }

  // document.fullscreenElement only shows the outermost shadow host of HA, so ask the element itself.
  get _isFullscreen() {
    return Boolean(document.fullscreenElement) && this.matches(":fullscreen");
  }

  get _drafting() {
    return Boolean(this._draft.length || this._pending || this._doorDraft || this._arcEdge || this._calib);
  }

  // Radius for rounding corners: as set in the ribbon, otherwise five grid steps.
  get _radius() {
    return this._filletR ?? round(this._grid * 5);
  }

  _renderCoords() {
    const el = this.shadowRoot.querySelector(".coords");
    if (!el) return;
    const p = this._cursor && this._snap(this._cursor);
    el.textContent = p ? `x ${p[0]}   y ${p[1]}${this._unit ? "   " + this._unit : ""}` : "";
  }

  _renderCanvas() {
    const vb = this._vb;
    const u = unitOf(vb); // view unit: handles keep their size on screen
    const uc = this._u; // card unit: walls etc. keep their real size
    const g = this._grid;
    const c = this._config;
    const r = 6 * u;

    // Grid lines, every 5th line stronger; hidden when zoomed out too far.
    const lines = [];
    if (vb[2] / g + vb[3] / g < 400) {
      for (let n = Math.ceil(vb[0] / g); n * g <= vb[0] + vb[2]; n++)
        lines.push(`<line class="${n % 5 ? "g1" : "g5"}" x1="${round(n * g)}" y1="${vb[1]}" x2="${round(n * g)}" y2="${vb[1] + vb[3]}"/>`);
      for (let n = Math.ceil(vb[1] / g); n * g <= vb[1] + vb[3]; n++)
        lines.push(`<line class="${n % 5 ? "g1" : "g5"}" x1="${vb[0]}" y1="${round(n * g)}" x2="${vb[0] + vb[2]}" y2="${round(n * g)}"/>`);
    }

    const handles = [];
    const isSel = (kind, i) => this._isSel(kind, i);
    const lineBody = (kind, i, a, b) =>
      `<line class="lbody${isSel(kind, i) ? " sel" : ""}" data-h="${kind}:${i}:body" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke-width:${16 * u}"/>`;

    // Bodies: invisible shapes to grab whole objects. Later ones lie on top.
    (c.rooms || []).forEach((room, i) => {
      const geo = roomGeometry(room);
      if (geo) handles.push(`<path class="body${isSel("room", i) ? " sel" : ""}" data-h="room:${i}:body" d="${geo.d}"/>`);
    });
    (c.stairs || []).forEach((s, i) => {
      if (!isRect(s.rect)) return;
      const [x1, y1, x2, y2] = normRect(s.rect);
      handles.push(`<rect class="body${isSel("stairs", i) ? " sel" : ""}" data-h="stairs:${i}:body" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}"/>`);
    });
    // Doors can be grabbed anywhere on their swing area, not only on the opening.
    (c.doors || []).forEach((d, i) => {
      const path = doorPath(d);
      if (path) handles.push(`<path class="body${isSel("door", i) ? " sel" : ""}" data-h="door:${i}:body" d="${path} Z"/>`);
      handles.push(lineBody("door", i, d.hinge, d.to));
    });
    (c.windows || []).forEach((w, i) => handles.push(lineBody("window", i, w.from, w.to)));
    (c.radiators || []).forEach((rad, i) => handles.push(lineBody("radiator", i, rad.from, rad.to)));
    (c.labels || []).forEach((l, i) => {
      if (isPoint(l.position)) handles.push(`<circle class="pt label${isSel("label", i) ? " sel" : ""}" data-h="label:${i}:pos" cx="${l.position[0]}" cy="${l.position[1]}" r="${r}"/>`);
    });

    // Handles of the (single) selected object.
    const sel = this._item(this._sel);
    if (sel) {
      const k = this._sel.kind;
      const i = this._sel.index;
      if (k === "room") {
        if (isRect(sel.ellipse)) {
          // Ellipse: one handle on each side (left, top, right, bottom).
          const [x1, y1, x2, y2] = normRect(sel.ellipse);
          const [cx, cy] = [(x1 + x2) / 2, (y1 + y2) / 2];
          [[x1, cy], [cx, y1], [x2, cy], [cx, y2]].forEach((p, v) => handles.push(`<circle class="pt" data-h="room:${i}:e:${v}" cx="${p[0]}" cy="${p[1]}" r="${r}"/>`));
        } else if (roomGeometry(sel)) {
          const pts = roomPoints(sel);
          // A diamond in the middle of every wall bends it into an arc.
          pts.forEach((_, v) => {
            const { m } = wallFrame(pts, v, Number(sel.arcs?.[v]) || 0);
            handles.push(`<rect class="pt mid" data-h="room:${i}:arc:${v}" x="${m[0] - r * 0.8}" y="${m[1] - r * 0.8}" width="${r * 1.6}" height="${r * 1.6}" transform="rotate(45 ${m[0]} ${m[1]})"/>`);
          });
          pts.forEach((p, v) => handles.push(`<circle class="pt" data-h="room:${i}:v:${v}" cx="${p[0]}" cy="${p[1]}" r="${r}"/>`));
        }
        if (sel.name && sel.label !== false) {
          const [x, y] = roomCenter(sel);
          handles.push(`<rect class="pt label" data-h="room:${i}:label" x="${x - 2 * r}" y="${y - r}" width="${4 * r}" height="${2 * r}" rx="${r / 2}"/>`);
        }
      } else if (k === "window" || k === "radiator") {
        handles.push(`<circle class="pt" data-h="${k}:${i}:from" cx="${sel.from[0]}" cy="${sel.from[1]}" r="${r}"/>`);
        handles.push(`<circle class="pt" data-h="${k}:${i}:to" cx="${sel.to[0]}" cy="${sel.to[1]}" r="${r}"/>`);
      } else if (k === "door") {
        // The three other ways this door could sit, as clickable grey outlines.
        this._doorVariants(sel).forEach((v, n) => {
          if (v.hinge[0] === sel.hinge[0] && v.hinge[1] === sel.hinge[1] && v.swing === (sel.swing || "left")) return;
          handles.push(`<path class="ghost" d="${doorPath(v)}"/><path class="ghost-hit" data-h="door:${i}:variant:${n}" d="${doorPath(v)}" style="stroke-width:${10 * u}"/>`);
        });
        handles.push(`<circle class="pt hinge" data-h="door:${i}:hinge" cx="${sel.hinge[0]}" cy="${sel.hinge[1]}" r="${r}"/>`);
        handles.push(`<circle class="pt" data-h="door:${i}:to" cx="${sel.to[0]}" cy="${sel.to[1]}" r="${r}"/>`);
      } else if (k === "stairs") {
        const [x1, y1, x2, y2] = sel.rect;
        handles.push(`<circle class="pt" data-h="stairs:${i}:c1" cx="${x1}" cy="${y1}" r="${r}"/>`);
        handles.push(`<circle class="pt" data-h="stairs:${i}:c2" cx="${x2}" cy="${y2}" r="${r}"/>`);
      }
    }

    // Elements (icons/values) as markers.
    (c.elements || []).forEach((el, i) => {
      if (!isPoint(el.position)) return;
      handles.push(`<circle class="marker${isSel("element", i) ? " sel" : ""}${el.entity ? "" : " empty"}" data-h="element:${i}:pos" cx="${el.position[0]}" cy="${el.position[1]}" r="${11 * uc}"/>`);
    });

    // Template image below grid and plan; while it shows, the room fills turn see-through.
    const img = this._traceShown;
    let trace = "";
    if (img) {
      const [x, y] = img.position;
      const [w, h] = img.size;
      const [cx, cy] = traceCenter(img);
      const frame = this._mode === "trace-move" ? `<rect class="traceframe" x="${x}" y="${y}" width="${w}" height="${h}"/>` : "";
      trace = `<g class="trace" transform="rotate(${Number(img.rotation) || 0} ${cx} ${cy})">
        <image href="${esc(img.url)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" style="opacity:${traceOpacity(img)}"/>${frame}</g>`;
    }

    this._svg.setAttribute("viewBox", vb.join(" "));
    this._svg.classList.toggle("drawing", this._mode !== "select");
    this._svg.classList.toggle("tracing", Boolean(img));
    this._svg.classList.toggle("trace-move", this._mode === "trace-move");
    this._svg.innerHTML = `
      ${trace}
      <g class="gridlines" style="stroke-width:${0.6 * u}">${lines.join("")}</g>
      ${planMarkup(c, this._hass, cardViewBox(c), this._lang)}
      <g class="handles" style="stroke-width:${1.5 * u}">${handles.join("")}</g>
      <g class="drafts">${this._draftMarkup(u, uc, r)}</g>`;

    // Element markers get the real icon on top so they are recognizable.
    this.shadowRoot.querySelector(".overlay").innerHTML = (c.elements || [])
      .map((el) => {
        if (!isPoint(el.position) || !el.entity) return "";
        const left = ((el.position[0] - vb[0]) / vb[2]) * 100;
        const top = ((el.position[1] - vb[1]) / vb[3]) * 100;
        if (left < -5 || left > 105 || top < -5 || top > 105) return "";
        return `<ha-state-icon style="left:${left}%;top:${top}%" data-entity="${esc(el.entity)}"${el.icon ? ` icon="${esc(el.icon)}"` : ""}></ha-state-icon>`;
      })
      .join("");
    this.shadowRoot.querySelectorAll(".overlay ha-state-icon").forEach((node) => {
      node.hass = this._hass;
      node.stateObj = this._hass?.states[node.dataset.entity];
    });
    this._renderCoords();
  }

  // Preview of whatever is being drawn right now, with dimensions.
  _draftMarkup(u, uc, r) {
    const out = [];
    const cur = this._cursor && this._mode !== "select" ? this._snapFor(this._mode, this._cursor) : null;
    const unit = this._unit ? ` ${this._unit}` : "";
    const dim = (x, y, value) => `<text class="dim" x="${x}" y="${y}" style="font-size:${12 * u}px;stroke-width:${3 * u}">${round(value)}${unit}</text>`;
    const wallMode = ["window", "door", "radiator"].includes(this._mode);

    if (this._band) {
      const [x1, y1, x2, y2] = normRect([...this._band.start, ...this._band.cur]);
      out.push(`<rect class="band" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}"/>`);
    }

    // Highlight the wall the next point will snap to.
    if (wallMode && this._wallSnap && this._cursor && !this._doorDraft) {
      const wall = this._nearestWall(this._cursor);
      if (wall) out.push(`<polyline class="wallhl" points="${wall.piece.map(fmt).join(" ")}" style="stroke-width:${Math.max(7 * uc, 4 * u)}"/>`);
    }

    // Stairs: highlight the walls the corner snaps to.
    if (this._mode === "stairs" && this._cursor) {
      for (const w of this._snapNearWalls(this._cursor).walls) {
        const [a, b] = w.axis === 0 ? [[w.at, w.lo], [w.at, w.hi]] : [[w.lo, w.at], [w.hi, w.at]];
        out.push(`<line class="wallhl" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke-width:${Math.max(7 * uc, 4 * u)}"/>`);
      }
    }

    if (this._mode === "room-ellipse" && this._pending && cur) {
      const [x1, y1, x2, y2] = this._ellipseBox(this._pending, cur);
      out.push(`<rect class="band" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}"/>`);
      out.push(`<ellipse class="room preview" cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" rx="${(x2 - x1) / 2}" ry="${(y2 - y1) / 2}" style="stroke-width:${3 * uc}"/>`);
      out.push(dim((x1 + x2) / 2, y1 - 10 * u, x2 - x1), dim(x2 + 14 * u, (y1 + y2) / 2, y2 - y1));
    }

    // Rounding: show the corner under the mouse as it would look.
    if (this._mode === "fillet" && this._cursor) {
      const hit = this._findCorner(this._cursor);
      if (hit) {
        const room = clone(this._config.rooms[hit.room]);
        setCornerRadius(room, hit.corner, this._radius);
        const geo = roomGeometry(room);
        const v = roomPoints(room)[hit.corner];
        if (geo) out.push(`<path class="shapepreview" d="${geo.d}"/>`);
        out.push(`<circle class="pt" cx="${v[0]}" cy="${v[1]}" r="${r}"/>`);
      }
    }

    // Arc wall: highlight the wall under the mouse, then follow the mouse with the bend.
    if (this._mode === "arc" && this._cursor) {
      if (this._arcEdge) {
        const { room: ri, edge } = this._arcEdge;
        const room = clone(this._config.rooms[ri]);
        const s = this._arcBend(room, edge, this._cursor);
        setWallArc(room, edge, s);
        const geo = roomGeometry(room);
        const { m } = wallFrame(roomPoints(room), edge, s);
        if (geo) out.push(`<path class="shapepreview" d="${geo.d}"/>`);
        out.push(dim(m[0], m[1] - 12 * u, Math.abs(s)));
      } else {
        const hit = this._findEdge(this._cursor);
        if (hit) out.push(`<polyline class="wallhl" points="${hit.piece.map(fmt).join(" ")}" style="stroke-width:${Math.max(7 * uc, 4 * u)}"/>`);
      }
    }

    if ((this._mode === "room-rect" || this._mode === "stairs") && this._pending && cur) {
      const [x1, y1, x2, y2] = this._mode === "stairs" ? this._flushRect([...this._pending, ...cur]) : normRect([...this._pending, ...cur]);
      out.push(`<rect class="${this._mode === "stairs" ? "stair-body" : "room"} preview" x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" style="stroke-width:${3 * uc}"/>`);
      out.push(dim((x1 + x2) / 2, y1 - 10 * u, x2 - x1), dim(x2 + 14 * u, (y1 + y2) / 2, y2 - y1));
    }

    if (this._mode === "room-poly" && this._draft.length) {
      const pts = [...this._draft, ...(cur ? [cur] : [])];
      out.push(`<polyline class="wallpreview" points="${pts.map((p) => p.join(",")).join(" ")}" style="stroke-width:${3 * uc}"/>`);
      if (cur) {
        const last = this._draft[this._draft.length - 1];
        out.push(dim((last[0] + cur[0]) / 2, (last[1] + cur[1]) / 2 - 10 * u, Math.hypot(cur[0] - last[0], cur[1] - last[1])));
      }
      this._draft.forEach((p, n) => out.push(`<circle class="pt${n === 0 ? " first" : ""}" cx="${p[0]}" cy="${p[1]}" r="${r}"/>`));
    }

    if (this._mode === "window" && this._pending && cur) {
      out.push(`<line class="winpreview" x1="${this._pending[0]}" y1="${this._pending[1]}" x2="${cur[0]}" y2="${cur[1]}" style="stroke-width:${8 * uc}"/>`);
      out.push(dim((this._pending[0] + cur[0]) / 2, (this._pending[1] + cur[1]) / 2 - 12 * u, Math.hypot(cur[0] - this._pending[0], cur[1] - this._pending[1])));
    }

    if (this._mode === "door") {
      if (this._doorDraft) {
        const swing = this._cursor ? sideOf(this._doorDraft, this._cursor) : "left";
        out.push(`<path class="doorpreview" d="${doorPath({ ...this._doorDraft, swing })}" style="stroke-width:${2 * uc}"/>`);
      } else if (this._pending && cur) {
        out.push(`<line class="winpreview" x1="${this._pending[0]}" y1="${this._pending[1]}" x2="${cur[0]}" y2="${cur[1]}" style="stroke-width:${6 * uc}"/>`);
        out.push(dim((this._pending[0] + cur[0]) / 2, (this._pending[1] + cur[1]) / 2 - 12 * u, Math.hypot(cur[0] - this._pending[0], cur[1] - this._pending[1])));
      }
      if (this._pending || this._doorDraft) {
        const h = this._doorDraft ? this._doorDraft.hinge : this._pending;
        out.push(`<circle class="pt hinge" cx="${h[0]}" cy="${h[1]}" r="${r}"/>`);
      }
    }

    if (this._mode === "radiator" && this._pending && cur) {
      const ends = this._radiatorEnds(this._pending, cur, this._cursor);
      if (ends) {
        const rr = radiatorRect({ from: ends[0], to: ends[1] }, uc);
        out.push(`<rect class="radpreview" x="${rr.x}" y="${rr.y}" width="${rr.w}" height="${rr.h}" style="stroke-width:${1.5 * uc}"/>`);
      }
    }

    // Scale of the template image: line between the two points with its length on the image.
    if (this._mode === "trace-scale" && this._calib) {
      const [a, b] = [this._calib[0], this._calib[1] || cur];
      if (b) {
        out.push(`<line class="calib" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`);
        out.push(dim((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 12 * u, Math.hypot(b[0] - a[0], b[1] - a[1])));
      }
      this._calib.forEach((p) => out.push(`<circle class="pt" cx="${p[0]}" cy="${p[1]}" r="${r}"/>`));
    }

    if (this._pending && this._mode !== "door") out.push(`<circle class="pt" cx="${this._pending[0]}" cy="${this._pending[1]}" r="${r}"/>`);
    if (cur && !this._doorDraft && !["fillet", "arc", "trace-move"].includes(this._mode)) out.push(`<circle class="cursor" cx="${cur[0]}" cy="${cur[1]}" r="${r * 0.7}"/>`);
    return out.join("");
  }

  _entityOptions(kind) {
    const domains = ENTITY_DOMAINS[kind];
    return Object.keys(this._hass?.states || {})
      .filter((id) => !domains || domains.includes(id.split(".")[0]))
      .sort()
      .map((id) => `<option value="${esc(id)}">${esc(this._hass.states[id].attributes.friendly_name || "")}</option>`)
      .join("");
  }

  _renderPanel() {
    const panel = this.shadowRoot.querySelector(".panel");
    if (this._sels.length > 1) {
      panel.innerHTML = `<div class="head"><b>${esc(this._t("n_selected", { n: this._sels.length }))}</b>
        <button class="danger" data-cmd="delete"><ha-icon icon="mdi:delete-outline"></ha-icon> ${esc(this._t("delete"))}</button></div>`;
      return;
    }
    if (!this._sels.length && (this._tab === "tab_trace" || this._mode.startsWith("trace-"))) {
      panel.innerHTML = this._tracePanel();
      return;
    }
    const item = this._item(this._sel);
    if (!item) {
      panel.innerHTML = `<div class="empty">${esc(this._t("nothing_selected"))}</div>`;
      return;
    }
    const k = this._sel.kind;
    const field = (key, label, value, extra = "") =>
      `<label><span>${esc(label)}</span><input data-field="${key}" value="${esc(value ?? "")}" ${extra}></label>`;
    const entityField = () =>
      `${field("entity", this._t("entity"), item.entity, `list="fp-entities" placeholder="${k === "window" ? "binary_sensor." : k === "radiator" ? "climate." : ""}"`)}
       <datalist id="fp-entities">${this._entityOptions(k)}</datalist>`;
    const rows = [];
    if (k === "room") {
      rows.push(field("name", this._t("name"), item.name));
      rows.push(`<label><span>${esc(this._t("type"))}</span><select data-field="type">
        ${["room", "outdoor", "zone"].map((v) => `<option value="${v}"${(item.type || "room") === v ? " selected" : ""}>${esc(this._t("type_" + v))}</option>`).join("")}
        </select></label>`);
      if (!isRect(item.ellipse)) {
        const mixed = item.radii ? ` placeholder="${esc(this._t("corner_radius_mixed"))}"` : "";
        rows.push(field("radius", this._t("corner_radius"), item.radius, `type="number" min="0" step="${this._grid}"${mixed}`));
      }
      rows.push(field("navigation_path", this._t("navigation"), item.navigation_path, `placeholder="/dashboard/room"`));
      rows.push(entityField());
    } else if (k === "window" || k === "radiator") {
      rows.push(field("name", this._t("name"), item.name));
      rows.push(entityField());
    } else if (k === "door") {
      const width = round(Math.hypot(item.to[0] - item.hinge[0], item.to[1] - item.hinge[1]));
      rows.push(field("width", this._t("width"), width, `type="number" min="0" step="${this._grid}"`));
      rows.push(`<div class="buttons">
        <button data-cmd="swap-hinge"><ha-icon icon="mdi:swap-horizontal"></ha-icon>${esc(this._t("swap_hinge"))}</button>
        <button data-cmd="swap-side"><ha-icon icon="mdi:swap-vertical"></ha-icon>${esc(this._t("swap_side"))}</button></div>`);
      rows.push(`<div class="note">${esc(this._t("door_hint"))}</div>`);
      rows.push(`<label class="check"><input type="checkbox" data-field="gap"${item.gap === false ? "" : " checked"}> ${esc(this._t("gap"))}</label>`);
    } else if (k === "stairs") {
      const [x1, y1, x2, y2] = normRect(item.rect);
      const dir = item.direction || (y2 - y1 >= x2 - x1 ? "up" : "right");
      rows.push(`<div class="note">${esc(this._t("direction"))}</div><div class="buttons dirs">${STAIR_DIRS.map(
        ([d, mdi]) => `<button class="${dir === d ? "on" : ""}" data-dir="${d}"><ha-icon icon="${mdi}"></ha-icon></button>`
      ).join("")}</div>`);
      rows.push(field("steps", this._t("steps"), item.steps, `type="number" min="2" max="40" step="1" placeholder="auto"`));
      rows.push(field("name", this._t("name"), item.name, `placeholder="${esc(this._t("up"))}"`));
      rows.push(field("navigation_path", this._t("navigation"), item.navigation_path, `placeholder="/dashboard/upstairs"`));
    } else if (k === "element") {
      rows.push(entityField());
      rows.push(`<label><span>${esc(this._t("show_as"))}</span><select data-field="type">
        <option value="icon"${(item.type || "icon") === "icon" ? " selected" : ""}>${esc(this._t("show_icon"))}</option>
        <option value="state"${item.type === "state" ? " selected" : ""}>${esc(this._t("show_state"))}</option></select></label>`);
      rows.push(field("title", this._t("title"), item.title));
    } else if (k === "label") {
      rows.push(field("text", this._t("text"), item.text));
    }
    panel.innerHTML = `<div class="head"><b>${esc(this._t("sel_" + k))}</b>
        <button class="danger" data-cmd="delete"><ha-icon icon="mdi:delete-outline"></ha-icon> ${esc(this._t("delete"))}</button></div>
      <div class="fields">${rows.join("")}</div>`;
  }

  // Properties of the template image, or the distance input while setting its scale.
  _tracePanel() {
    const img = this._trace;
    const field = (key, label, value, extra = "") =>
      `<label><span>${esc(label)}</span><input data-trace="${key}" value="${esc(value ?? "")}" ${extra}></label>`;
    if (this._mode === "trace-scale" && this._calib?.length === 2) {
      const [a, b] = this._calib;
      const d = round(Math.hypot(b[0] - a[0], b[1] - a[1]));
      return `<div class="head"><b>${esc(this._t("trace_scale"))}</b></div>
        <div class="fields">${field("distance", this._t("trace_distance", { unit: this._unit || this._t("unit_none") }), d, `type="number" min="0" step="any"`)}
        <div class="note">${esc(this._t("trace_distance_note", { d: `${d}${this._unit ? " " + this._unit : ""}` }))}${this._unit ? "" : `<br>${esc(this._t("trace_no_unit"))}`}</div>
        <div class="buttons"><button class="primary" data-cmd="trace-apply"><ha-icon icon="mdi:check"></ha-icon>${esc(this._t("apply"))}</button>
          <button data-cmd="cancel">${esc(this._t("cancel"))}</button></div></div>`;
    }
    const url = field("url", this._t("trace_url"), this._config.trace_image?.url, `placeholder="/local/..."`);
    if (!img) {
      return `<div class="head"><b>${esc(this._t("sel_trace"))}</b>
          <button class="primary" data-cmd="trace-upload"><ha-icon icon="mdi:image-plus-outline"></ha-icon>${esc(this._t("trace_upload"))}</button></div>
        <div class="fields">${url}<div class="note">${esc(this._t("trace_url_hint"))}</div></div>`;
    }
    return `<div class="head"><b>${esc(this._t("sel_trace"))}</b>
        <button class="danger" data-cmd="trace-remove"><ha-icon icon="mdi:image-remove-outline"></ha-icon> ${esc(this._t("trace_remove"))}</button></div>
      <div class="fields">
        ${field("width", `${this._t("trace_width")}${this._unit ? ` (${this._unit})` : ""}`, img.size[0], `type="number" min="0" step="any"`)}
        ${field("rotation", this._t("rotation"), Number(img.rotation) || 0, `type="number" step="0.5"`)}
        ${url}<div class="note">${esc(this._t("trace_url_hint"))}</div></div>`;
  }

  // --- geometry helpers ---------------------------------------------------------------------------

  _toPlan(ev) {
    const pt = this._svg.createSVGPoint();
    pt.x = ev.clientX;
    pt.y = ev.clientY;
    const p = pt.matrixTransform(this._svg.getScreenCTM().inverse());
    return [p.x, p.y];
  }

  _snap(p) {
    const g = this._grid;
    return [round(Math.round(p[0] / g) * g), round(Math.round(p[1] / g) * g)];
  }

  _nearestWall(p) {
    let best = null;
    let bestD = Infinity;
    for (const room of this._config.rooms || []) {
      for (const piece of roomGeometry(room)?.pieces || []) {
        for (let k = 0; k < piece.pts.length - 1; k++) {
          const [a, b] = [piece.pts[k], piece.pts[k + 1]];
          const q = projectOnSegment(p, a, b);
          const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
          if (d < bestD) {
            bestD = d;
            best = { q, a, b, piece: piece.pts };
          }
        }
      }
    }
    return best;
  }

  // Corner of a polygon or rectangle room near p (at the corner point or on its rounding).
  _findCorner(p) {
    let best = null;
    let bestD = 20 * unitOf(this._vb);
    (this._config.rooms || []).forEach((room, ri) => {
      const geo = roomGeometry(room);
      if (!geo || isRect(room.ellipse)) return;
      const near = (d, corner) => {
        if (d < bestD) [bestD, best] = [d, { room: ri, corner }];
      };
      roomPoints(room).forEach((v, ci) => near(Math.hypot(v[0] - p[0], v[1] - p[1]), ci));
      geo.pieces.forEach((pc) => pc.corner !== undefined && near(distToPolyline(p, pc.pts), pc.corner));
    });
    return best;
  }

  // Wall of a polygon or rectangle room near p.
  _findEdge(p) {
    let best = null;
    let bestD = 20 * unitOf(this._vb);
    (this._config.rooms || []).forEach((room, ri) => {
      if (isRect(room.ellipse)) return;
      for (const pc of roomGeometry(room)?.pieces || []) {
        const d = pc.edge === undefined ? Infinity : distToPolyline(p, pc.pts);
        if (d < bestD) [bestD, best] = [d, { room: ri, edge: pc.edge, piece: pc.pts }];
      }
    });
    return best;
  }

  // Bend of wall "edge" so that its middle follows p, on the grid.
  _arcBend(room, edge, p) {
    const { mid, n } = wallFrame(roomPoints(room), edge);
    const s = (p[0] - mid[0]) * n[0] + (p[1] - mid[1]) * n[1];
    return round(Math.round(s / this._grid) * this._grid);
  }

  // Box of an ellipse from two corners; with Shift a square, i.e. a circle.
  _ellipseBox(a, q) {
    if (!this._shift) return normRect([...a, ...q]);
    const size = Math.max(Math.abs(q[0] - a[0]), Math.abs(q[1] - a[1]));
    return normRect([...a, round(a[0] + Math.sign(q[0] - a[0] || 1) * size), round(a[1] + Math.sign(q[1] - a[1] || 1) * size)]);
  }

  // With wall snap, windows, doors and radiators always land on the nearest wall; without it only on the grid.
  _snapToWall(p) {
    const wall = this._wallSnap && this._nearestWall(p);
    if (!wall) return this._snap(p);
    // Stay exactly on the wall; along straight walls also land on the grid.
    const { q, a, b } = wall;
    const s = this._snap(q);
    if (Math.abs(a[1] - b[1]) < 1e-9) return [Math.min(Math.max(s[0], Math.min(a[0], b[0])), Math.max(a[0], b[0])), a[1]];
    if (Math.abs(a[0] - b[0]) < 1e-9) return [a[0], Math.min(Math.max(s[1], Math.min(a[1], b[1])), Math.max(a[1], b[1]))];
    return [round(q[0]), round(q[1])];
  }

  // Moving a whole window/door: with wall snap it slides along (or jumps to) the nearest wall and keeps its length.
  _moveOnWall(a, b, delta) {
    const shifted = [[a[0] + delta[0], a[1] + delta[1]], [b[0] + delta[0], b[1] + delta[1]]];
    const mid = [(shifted[0][0] + shifted[1][0]) / 2, (shifted[0][1] + shifted[1][1]) / 2];
    const wall = this._wallSnap && this._nearestWall(mid);
    if (!wall) return shifted.map((pt) => [round(pt[0]), round(pt[1])]);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const wl = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1]) || 1;
    let dir = [(wall.b[0] - wall.a[0]) / wl, (wall.b[1] - wall.a[1]) / wl];
    if (dir[0] * (b[0] - a[0]) + dir[1] * (b[1] - a[1]) < 0) dir = [-dir[0], -dir[1]];
    // The move itself is already on the grid, so only project onto the wall (no extra snapping of the middle).
    const m = wall.q;
    return [
      [round(m[0] - (dir[0] * len) / 2), round(m[1] - (dir[1] * len) / 2)],
      [round(m[0] + (dir[0] * len) / 2), round(m[1] + (dir[1] * len) / 2)],
    ];
  }

  // Radiators stand in front of the wall: shift the wall line q1→q2 to the side of "sideRef"
  // (or into the room if that is unclear) by half a wall plus the radiator depth.
  _radiatorEnds(q1, q2, sideRef) {
    const len = Math.hypot(q2[0] - q1[0], q2[1] - q1[1]);
    if (!len) return null;
    if (!this._wallSnap) return [q1, q2];
    const [dx, dy] = [(q2[0] - q1[0]) / len, (q2[1] - q1[1]) / len];
    const n = [-dy, dx];
    const off = 7.5 * this._u;
    let s = sideRef ? (sideRef[0] - q1[0]) * n[0] + (sideRef[1] - q1[1]) * n[1] : 0;
    if (Math.abs(s) < off / 4) {
      const probe = [(q1[0] + q2[0]) / 2 + n[0] * off, (q1[1] + q2[1]) / 2 + n[1] * off];
      s = (this._config.rooms || []).some((room) => roomGeometry(room) && insidePolygon(probe, roomGeometry(room).outline)) ? 1 : -1;
    }
    const k = Math.sign(s) * off;
    return [
      [round(q1[0] + n[0] * k), round(q1[1] + n[1] * k)],
      [round(q2[0] + n[0] * k), round(q2[1] + n[1] * k)],
    ];
  }

  _snapFor(mode, p) {
    // Points on the template image are wherever the image shows them, not on the grid.
    if ((mode === "door" && this._doorDraft) || mode.startsWith("trace-")) return p;
    // On a wall the wall gives the direction; free (wall snap off) ortho keeps them horizontal or vertical.
    if (mode === "window" || mode === "radiator" || mode === "door") {
      const q = this._snapToWall(p);
      return this._wallSnap ? q : this._orthoFrom(this._pending, q);
    }
    if (mode === "stairs") return this._snapNearWalls(p).q;
    // Polygon room with ortho: continue horizontally or vertically from the last corner.
    if (mode === "room-poly") return this._orthoFrom(this._draft[this._draft.length - 1], this._snap(p));
    return this._snap(p);
  }

  // With ortho, q moves onto the horizontal or vertical line through "from".
  _orthoFrom(from, q) {
    if (!this._ortho || !from) return q;
    return Math.abs(q[0] - from[0]) >= Math.abs(q[1] - from[1]) ? [q[0], from[1]] : [from[0], q[1]];
  }

  // How far stairs reach for a wall: about 30 px on screen.
  get _wallLim() {
    return 30 * unitOf(this._vb);
  }

  // Straight horizontal and vertical walls as { axis, at, lo, hi }: axis 0 is a vertical wall at x = at from y lo to hi.
  _axisWalls() {
    return (this._config.rooms || []).flatMap((room) =>
      (roomGeometry(room)?.pieces || []).flatMap((pc) => {
        if (pc.pts.length !== 2) return [];
        const [a, b] = pc.pts;
        const axis = Math.abs(a[0] - b[0]) < 1e-9 ? 0 : Math.abs(a[1] - b[1]) < 1e-9 ? 1 : -1;
        return axis < 0 ? [] : [{ axis, at: a[axis], lo: Math.min(a[1 - axis], b[1 - axis]), hi: Math.max(a[1 - axis], b[1 - axis]) }];
      })
    );
  }

  // Corner of stairs: on the grid, but pulled onto walls nearby (in a room corner onto both).
  _snapNearWalls(p) {
    const q = this._snap(p);
    const walls = [];
    if (!this._wallSnap) return { q, walls };
    const lim = this._wallLim;
    for (const axis of [0, 1]) {
      let best = null;
      let bestD = lim;
      for (const w of this._axisWalls()) {
        if (w.axis !== axis || p[1 - axis] < w.lo - lim || p[1 - axis] > w.hi + lim) continue;
        const d = Math.abs(p[axis] - w.at);
        if (d < bestD) [bestD, best] = [d, w];
      }
      if (best) {
        q[axis] = round(best.at);
        walls.push(best);
      }
    }
    return { q, walls };
  }

  // Wall snap for stairs: edges close to a straight horizontal or vertical wall move onto its inner face.
  // "keepSize" (moving) shifts the whole rectangle instead of stretching it.
  _flushRect(rect, keepSize = false) {
    const r = normRect(rect);
    if (!this._wallSnap) return r;
    const lim = this._wallLim;
    const half = 1.5 * this._u; // half the wall line
    const walls = this._axisWalls();
    // axis 0: vertical walls move x1/x2, axis 1: horizontal walls move y1/y2.
    const target = (axis, value, inward) => {
      let best = null;
      let bestD = lim;
      for (const w of walls) {
        // The wall must run alongside the rectangle.
        if (w.axis !== axis || w.hi <= r[1 - axis] || w.lo >= r[3 - axis]) continue;
        const d = Math.abs(value - w.at);
        if (d < bestD) [bestD, best] = [d, round(w.at + inward * half)];
      }
      return best;
    };
    for (const axis of [0, 1]) {
      const [lo, hi] = [target(axis, r[axis], 1), target(axis, r[axis + 2], -1)];
      if (keepSize) {
        const shifts = [lo === null ? null : lo - r[axis], hi === null ? null : hi - r[axis + 2]].filter((v) => v !== null);
        if (!shifts.length) continue;
        const k = shifts.reduce((m, v) => (Math.abs(v) < Math.abs(m) ? v : m));
        [r[axis], r[axis + 2]] = [round(r[axis] + k), round(r[axis + 2] + k)];
      } else {
        const [n1, n2] = [lo ?? r[axis], hi ?? r[axis + 2]];
        if (n2 > n1) [r[axis], r[axis + 2]] = [n1, n2];
      }
    }
    return r;
  }

  // --- changes ------------------------------------------------------------------------------------

  _commit(before) {
    this._history.push(before);
    if (this._history.length > 50) this._history.shift();
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: clone(this._config) }, bubbles: true, composed: true }));
  }

  _change(fn) {
    const before = clone(this._config);
    fn(this._config);
    this._commit(before);
    this._renderAll();
  }

  _add(kind, item) {
    this._change((c) => {
      const list = (c[LISTS[kind]] = c[LISTS[kind]] || []);
      list.push(item);
      this._select(kind, list.length - 1);
    });
    this._setMode("select");
  }

  // --- pointer ------------------------------------------------------------------------------------

  _onDown(ev) {
    ev.preventDefault();
    this.shadowRoot.querySelector(".canvas").focus({ preventScroll: true });
    this._pointers.set(ev.pointerId, [ev.clientX, ev.clientY]);

    // Two fingers: zoom and pan the view; whatever the first finger started is undone.
    if (this._pointers.size === 2) {
      if (this._drag?.moved) this._config = this._drag.before;
      this._drag = null;
      this._band = null;
      const [a, b] = [...this._pointers.values()];
      this._pinch = { vb: [...this._vb], dist: Math.hypot(b[0] - a[0], b[1] - a[1]), mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
      this._svg.setPointerCapture(ev.pointerId);
      this._renderCanvas();
      return;
    }

    // Right click: cancel the drawing in progress, a second one returns to "Select".
    if (ev.button === 2) {
      if (this._drafting) this._setMode(this._mode);
      else if (this._mode !== "select") this._setMode("select");
      return;
    }

    // Middle button or space + drag: move the view.
    if (ev.button === 1 || (ev.button === 0 && this._space)) {
      this._pan = { client: [ev.clientX, ev.clientY], vb: [...this._vb] };
      this._svg.setPointerCapture(ev.pointerId);
      return;
    }
    if (ev.button !== 0) return;
    const p = this._toPlan(ev);
    this._shift = ev.shiftKey;

    if (this._mode === "select") {
      const h = ev.target.dataset?.h;
      if (!h) {
        // Empty space: start a selection frame.
        this._band = { start: p, cur: p, add: ev.shiftKey };
        this._svg.setPointerCapture(ev.pointerId);
        return;
      }
      const [kind, index, part, v] = h.split(":");
      const i = Number(index);
      if (part === "variant") {
        this._change((c) => Object.assign(c.doors[i], this._doorVariants(c.doors[i])[Number(v)]));
        return;
      }
      if (ev.shiftKey) {
        // Shift + click adds or removes an object from the selection.
        this._sels = this._isSel(kind, i) ? this._sels.filter((s) => !(s.kind === kind && s.index === i)) : [...this._sels, { kind, index: i }];
        this._renderAll();
        return;
      }
      const group = this._sels.length > 1 && this._isSel(kind, i) && (part === "body" || part === "pos");
      if (!group) this._select(kind, i);
      this._drag = {
        kind, index: i, part, v: v === undefined ? null : Number(v), start: p, before: clone(this._config), moved: false,
        orig: clone(this._item({ kind, index: i })),
        group: group ? this._sels.map((s) => ({ ...s, o: clone(this._item(s)) })) : null,
      };
      this._svg.setPointerCapture(ev.pointerId);
      this._renderAll();
      return;
    }

    // Rounding and arc walls change an existing room; the tool stays active for the next corner or wall.
    if (this._mode === "fillet") {
      const hit = this._findCorner(p);
      if (hit) this._change((c) => setCornerRadius(c.rooms[hit.room], hit.corner, this._radius));
      return;
    }
    if (this._mode === "arc") {
      if (this._arcEdge) {
        const { room, edge } = this._arcEdge;
        this._arcEdge = null;
        this._change((c) => setWallArc(c.rooms[room], edge, this._arcBend(c.rooms[room], edge, p)));
      } else {
        const hit = this._findEdge(p);
        if (hit) this._arcEdge = { room: hit.room, edge: hit.edge };
        this._renderToolbar();
        this._renderCanvas();
      }
      return;
    }

    // Template image: drag it anywhere, or click the two points for its scale (a third click starts over).
    if (this._mode === "trace-move") {
      if (!this._trace) return;
      this._drag = { kind: "trace", start: p, before: clone(this._config), orig: [...this._trace.position], moved: false };
      this._svg.setPointerCapture(ev.pointerId);
      return;
    }
    if (this._mode === "trace-scale") {
      const a = this._calib?.length === 1 && this._calib[0];
      if (a && Math.hypot(p[0] - a[0], p[1] - a[1]) < 4 * unitOf(this._vb)) return;
      this._calib = a ? [a, p] : [p];
      this._renderAll();
      if (a) this.shadowRoot.querySelector('.panel [data-trace="distance"]')?.select?.();
      return;
    }

    const q = this._snapFor(this._mode, p);

    if (this._mode === "room-poly") {
      const first = this._draft[0];
      const raw = this._snap(p); // closing is checked without the ortho constraint
      if (first && this._draft.length >= 3 && Math.hypot(raw[0] - first[0], raw[1] - first[1]) < this._grid / 2) {
        this._finishRoom();
        return;
      }
      if (!this._draft.length || this._draft.some((d) => d[0] !== q[0] || d[1] !== q[1])) this._draft.push(q);
      this._renderToolbar();
      this._renderCanvas();
      return;
    }

    if (this._mode === "element") {
      this._add("element", { position: q });
      return;
    }

    if (this._mode === "label") {
      this._add("label", { text: this._t("text_default"), position: q, size: "small" });
      return;
    }

    if (this._mode === "door" && this._doorDraft) {
      this._add("door", { ...this._doorDraft, swing: sideOf(this._doorDraft, p) });
      this._doorDraft = null;
      return;
    }

    // All other tools take two clicks.
    if (!this._pending) {
      this._pending = q;
      this._renderToolbar();
      this._renderCanvas();
      return;
    }
    const a = this._pending;
    this._pending = null;
    if (a[0] === q[0] && a[1] === q[1]) {
      this._renderAll();
      return;
    }
    switch (this._mode) {
      case "room-rect":
        if (a[0] === q[0] || a[1] === q[1]) return this._renderAll();
        this._add("room", { name: this._t("room_n", { n: (this._config.rooms || []).length + 1 }), rect: normRect([...a, ...q]) });
        break;
      case "room-ellipse": {
        const box = this._ellipseBox(a, q);
        if (box[0] === box[2] || box[1] === box[3]) return this._renderAll();
        this._add("room", { name: this._t("room_n", { n: (this._config.rooms || []).length + 1 }), ellipse: box });
        break;
      }
      case "stairs":
        if (a[0] === q[0] || a[1] === q[1]) return this._renderAll();
        this._add("stairs", { rect: this._flushRect([...a, ...q]) });
        break;
      case "window":
        this._add("window", { from: a, to: q });
        break;
      case "radiator": {
        const ends = this._radiatorEnds(a, q, p);
        if (ends) this._add("radiator", { from: ends[0], to: ends[1] });
        break;
      }
      case "door":
        this._doorDraft = { hinge: a, to: q };
        this._renderToolbar();
        this._renderCanvas();
        break;
    }
  }

  _onMove(ev) {
    if (this._pointers.has(ev.pointerId)) this._pointers.set(ev.pointerId, [ev.clientX, ev.clientY]);

    if (this._pinch && this._pointers.size >= 2) {
      const [a, b] = [...this._pointers.values()];
      const pi = this._pinch;
      const f = pi.dist / Math.max(1, Math.hypot(b[0] - a[0], b[1] - a[1]));
      const anchor = this._screenToPlan(pi.mid[0], pi.mid[1], pi.vb); // plan point that was under the fingers
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const rect = this._svg.getBoundingClientRect();
      const [w, h] = [pi.vb[2] * f, pi.vb[3] * f];
      this._vb = [anchor[0] - ((mid[0] - rect.left) / rect.width) * w, anchor[1] - ((mid[1] - rect.top) / rect.height) * h, w, h];
      this._renderCanvas();
      return;
    }
    if (this._pan) {
      const rect = this._svg.getBoundingClientRect();
      const [vx, vy, vw, vh] = this._pan.vb;
      this._vb = [vx - ((ev.clientX - this._pan.client[0]) / rect.width) * vw, vy - ((ev.clientY - this._pan.client[1]) / rect.height) * vh, vw, vh];
      this._renderCanvas();
      return;
    }

    const p = this._toPlan(ev);
    this._cursor = p;
    this._shift = ev.shiftKey;
    if (this._band) {
      this._band.cur = p;
      this._renderCanvas();
      return;
    }
    const d = this._drag;
    if (!d) {
      if (this._mode !== "select") this._renderCanvas();
      else this._renderCoords();
      return;
    }
    // The template image moves freely, it does not follow the grid.
    if (d.kind === "trace") {
      this._config.trace_image.position = [round(d.orig[0] + p[0] - d.start[0]), round(d.orig[1] + p[1] - d.start[1])];
      d.moved = true;
      this._renderCanvas();
      return;
    }
    const delta = [round(Math.round((p[0] - d.start[0]) / this._grid) * this._grid), round(Math.round((p[1] - d.start[1]) / this._grid) * this._grid)];
    if (!d.moved && !delta[0] && !delta[1]) return;
    d.moved = true;

    // Several objects: move them all together.
    if (d.group) {
      for (const s of d.group) this._config[LISTS[s.kind]][s.index] = shiftObject(s.kind, s.o, delta);
      this._renderCanvas();
      return;
    }

    const o = d.orig;
    const list = this._config[LISTS[d.kind]];
    const item = clone(o);

    if (d.kind === "room") {
      if (d.part === "body") Object.assign(item, shiftObject("room", o, delta));
      else if (d.part === "v") {
        const pts = roomPoints(o).map((pt) => [...pt]);
        const old = pts[d.v];
        const nw = this._snap(p);
        if (this._ortho) {
          // Keep right angles: neighbours on the same horizontal/vertical wall move along.
          for (const n of [(d.v - 1 + pts.length) % pts.length, (d.v + 1) % pts.length]) {
            if (Math.abs(pts[n][1] - old[1]) < 1e-9) pts[n] = [pts[n][0], nw[1]];
            else if (Math.abs(pts[n][0] - old[0]) < 1e-9) pts[n] = [nw[0], pts[n][1]];
          }
        }
        pts[d.v] = nw;
        delete item.rect;
        item.points = pts;
      } else if (d.part === "e") {
        // Ellipse side handle: move that side of the surrounding box.
        const box = normRect(o.ellipse);
        const sp = this._snap(p);
        box[d.v] = sp[d.v % 2];
        if (box[0] !== box[2] && box[1] !== box[3]) item.ellipse = normRect(box);
      } else if (d.part === "arc") {
        setWallArc(item, d.v, this._arcBend(o, d.v, p));
      } else if (d.part === "label") {
        const base = roomCenter(o);
        item.label_position = [round(base[0] + delta[0]), round(base[1] + delta[1])];
      }
    } else if (d.kind === "door") {
      if (d.part === "body") [item.hinge, item.to] = this._moveOnWall(o.hinge, o.to, delta);
      else item[d.part] = this._wallSnap ? this._snapToWall(p) : this._orthoFrom(o[d.part === "hinge" ? "to" : "hinge"], this._snap(p));
    } else if (d.kind === "window") {
      if (d.part === "body") [item.from, item.to] = this._moveOnWall(o.from, o.to, delta);
      else item[d.part] = this._wallSnap ? this._snapToWall(p) : this._orthoFrom(o[d.part === "from" ? "to" : "from"], this._snap(p));
    } else if (d.kind === "radiator") {
      if (d.part === "body") {
        // Slide along the nearest wall, staying in front of it on the side the radiator is moved to.
        const len = Math.hypot(o.to[0] - o.from[0], o.to[1] - o.from[1]);
        const mid = [(o.from[0] + o.to[0]) / 2 + delta[0], (o.from[1] + o.to[1]) / 2 + delta[1]];
        const wall = this._wallSnap && this._nearestWall(mid);
        if (wall) {
          const m = wall.q;
          const wl = Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1]) || 1;
          let dir = [(wall.b[0] - wall.a[0]) / wl, (wall.b[1] - wall.a[1]) / wl];
          if (dir[0] * (o.to[0] - o.from[0]) + dir[1] * (o.to[1] - o.from[1]) < 0) dir = [-dir[0], -dir[1]];
          const ends = this._radiatorEnds([m[0] - (dir[0] * len) / 2, m[1] - (dir[1] * len) / 2], [m[0] + (dir[0] * len) / 2, m[1] + (dir[1] * len) / 2], mid);
          if (ends) [item.from, item.to] = ends;
        } else {
          Object.assign(item, shiftObject("radiator", o, delta));
        }
      } else {
        // Ends move along the radiator's own line, so it stays in front of the wall.
        const [a, b] = [o.from, o.to];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const dir = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
        const s = this._snap(p);
        const k = (s[0] - a[0]) * dir[0] + (s[1] - a[1]) * dir[1];
        item[d.part] = [round(a[0] + dir[0] * k), round(a[1] + dir[1] * k)];
      }
    } else if (d.kind === "stairs") {
      const [x1, y1, x2, y2] = o.rect;
      if (d.part === "body") item.rect = this._flushRect(shiftObject("stairs", o, delta).rect, true);
      else if (d.part === "c1") item.rect = this._flushRect([...this._snapNearWalls(p).q, x2, y2]);
      else item.rect = this._flushRect([x1, y1, ...this._snapNearWalls(p).q]);
    } else {
      Object.assign(item, shiftObject(d.kind, o, delta));
    }
    list[d.index] = item;
    this._renderCanvas();
  }

  _onUp(ev) {
    this._pointers.delete(ev.pointerId);
    try {
      this._svg.releasePointerCapture(ev.pointerId);
    } catch (e) {
      /* already released */
    }
    if (this._pinch) {
      if (this._pointers.size < 2) this._pinch = null;
      return;
    }
    if (this._pan) {
      this._pan = null;
      return;
    }
    if (this._band) {
      const band = this._band;
      this._band = null;
      const [x1, y1, x2, y2] = normRect([...band.start, ...band.cur]);
      const tiny = Math.max(x2 - x1, y2 - y1) < 4 * unitOf(this._vb);
      const found = [];
      if (!tiny) {
        for (const [kind, list] of Object.entries(LISTS)) {
          (this._config[list] || []).forEach((item, index) => {
            const pts = objectPoints(kind, item).filter(isPoint);
            if (pts.length && pts.every(([x, y]) => x >= x1 && x <= x2 && y >= y1 && y <= y2)) found.push({ kind, index });
          });
        }
      }
      if (band.add) this._sels = [...this._sels, ...found.filter((f) => !this._isSel(f.kind, f.index))];
      else this._sels = found;
      this._renderAll();
      return;
    }
    const d = this._drag;
    if (!d) return;
    this._drag = null;
    if (d.moved) {
      this._commit(d.before);
      this._renderAll();
    }
  }

  _onKey(ev) {
    if (ev.key === " ") {
      this._space = true;
      ev.preventDefault();
    } else if (ev.key === "Escape") {
      if (this._drafting) this._setMode(this._mode);
      else if (this._mode !== "select") this._setMode("select");
      else {
        this._select(null);
        this._renderAll();
      }
    } else if ((ev.key === "Delete" || ev.key === "Backspace") && this._sels.length) {
      ev.preventDefault();
      this._deleteSelected();
    } else if (ev.key === "Enter" && this._mode === "room-poly" && this._draft.length >= 3) {
      this._finishRoom();
    } else if ((ev.ctrlKey || ev.metaKey) && ev.key === "z") {
      ev.preventDefault();
      this._undo();
    } else if (ev.key === "+" || ev.key === "=") this._zoomCenter(0.8);
    else if (ev.key === "-") this._zoomCenter(1.25);
  }

  // --- commands -----------------------------------------------------------------------------------

  _setMode(mode) {
    this._mode = mode;
    this._draft = [];
    this._pending = null;
    this._doorDraft = null;
    this._arcEdge = null;
    this._calib = null;
    this._notice = null;
    if (mode !== "select") this._select(null);
    this._renderAll();
  }

  _finishRoom() {
    const pts = this._draft;
    this._draft = [];
    // Ortho: add the missing corner if the last wall would run diagonally back to the start.
    const [first, last] = [pts[0], pts[pts.length - 1]];
    if (this._ortho && first[0] !== last[0] && first[1] !== last[1]) pts.push([first[0], last[1]]);
    this._add("room", { name: this._t("room_n", { n: (this._config.rooms || []).length + 1 }), points: pts });
  }

  _deleteSelected() {
    if (!this._sels.length) return;
    // The card needs at least one room: if every room is selected, the first one stays.
    let sels = [...this._sels];
    const rooms = (this._config.rooms || []).length;
    if (sels.filter((s) => s.kind === "room").length >= rooms) sels = sels.filter((s) => !(s.kind === "room" && s.index === 0));
    this._select(null);
    this._change((c) => {
      // Highest index first, so the other indexes stay valid.
      for (const s of sels.sort((a, b) => b.index - a.index)) c[LISTS[s.kind]].splice(s.index, 1);
      for (const [kind, list] of Object.entries(LISTS)) if (kind !== "room" && c[list] && !c[list].length) delete c[list];
    });
  }

  _undo() {
    const before = this._history.pop();
    if (!before) return;
    this._config = before;
    this._sels = this._sels.filter((s) => this._item(s));
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: clone(before) }, bubbles: true, composed: true }));
    this._renderAll();
  }

  _onToolbar(ev) {
    const btn = ev.target.closest("button");
    if (!btn) return;
    const cmd = btn.dataset.cmd;
    if (btn.dataset.tab) {
      this._tab = btn.dataset.tab;
      this._notice = null;
      this._renderToolbar();
      this._renderPanel();
      this.shadowRoot.querySelector(".ribbon").scrollLeft = 0;
    } else if (btn.dataset.tool) this._setMode(btn.dataset.tool);
    else if (cmd?.startsWith("trace-")) this._traceCommand(cmd);
    else if (cmd === "ortho") {
      this._ortho = !this._ortho;
      this._renderToolbar();
    } else if (cmd === "wallsnap") {
      this._wallSnap = !this._wallSnap;
      this._renderToolbar();
    } else if (cmd === "fullscreen") {
      if (document.fullscreenElement) document.exitFullscreen();
      else this._enterFullscreen();
    } else if (cmd === "save") this._save();
    else if (cmd === "zoom-in") this._zoomCenter(0.8);
    else if (cmd === "zoom-out") this._zoomCenter(1.25);
    else if (cmd === "zoom-fit") {
      this._fitView();
      this._renderCanvas();
    } else if (cmd === "undo") this._undo();
    else if (cmd === "delete") this._deleteSelected();
    else if (cmd === "finish") this._finishRoom();
    else if (cmd === "cancel") this._setMode(this._mode);
  }

  // Browsers leave full screen on Escape. Where the Keyboard Lock API exists (Chrome, Edge) Escape goes to the
  // editor instead; holding Escape still leaves full screen. Elsewhere the full screen button is the way out.
  async _enterFullscreen() {
    if (!this.requestFullscreen) return;
    await this.requestFullscreen().catch(() => {});
    if (this._isFullscreen) navigator.keyboard?.lock?.(["Escape"]).catch(() => {});
    this.shadowRoot.querySelector(".canvas")?.focus();
  }

  _saveButton() {
    const [icon, label, cls] = {
      saving: ["mdi:loading", "save", " busy"],
      saved: ["mdi:check", "saved", ""],
      failed: ["mdi:alert-circle-outline", "save_failed", " failed"],
    }[this._saveState] || ["mdi:content-save-outline", "save", ""];
    return `<button class="save${cls}" data-cmd="save"${this._saveState === "saving" ? " disabled" : ""}><ha-icon icon="${icon}"></ha-icon>${esc(this._t(label))}</button>`;
  }

  // Save button in full screen: save the card but keep the dialog (and full screen) open.
  // HA has no public API for that, so use the save function HA's card editor dialog got for this card.
  // A card that is being added has none that can run twice: there HA's own Save runs (and closes the dialog).
  async _save() {
    if (this._saveState === "saving") return;
    let node = this;
    while (node && node.localName !== "hui-dialog-edit-card") node = node.parentNode || node.host;
    const params = node?._params;
    if (typeof params?.saveCardConfig !== "function" || params.isNew || !node._cardConfig) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
      if (typeof node?._save === "function") node._save();
      return;
    }
    this._saveState = "saving";
    this._renderToolbar();
    try {
      await params.saveCardConfig(node._cardConfig);
      node._markDirtyStateClean?.();
      this._saveState = "saved";
    } catch (e) {
      this._saveState = "failed";
    }
    this._renderToolbar();
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      this._saveState = null;
      this._renderToolbar();
    }, 2500);
  }

  // The four ways a door can sit in its opening: hinge at either end, opening to either side.
  _doorVariants(door) {
    return [
      { hinge: door.hinge, to: door.to, swing: "left" },
      { hinge: door.hinge, to: door.to, swing: "right" },
      { hinge: door.to, to: door.hinge, swing: "right" },
      { hinge: door.to, to: door.hinge, swing: "left" },
    ];
  }

  _onPanelClick(ev) {
    const btn = ev.target.closest("button");
    if (!btn) return;
    const sel = this._sel;
    if (btn.dataset.cmd === "trace-apply") this._applyCalib(this.shadowRoot.querySelector('.panel [data-trace="distance"]')?.value);
    else if (btn.dataset.cmd?.startsWith("trace-")) this._traceCommand(btn.dataset.cmd);
    else if (btn.dataset.cmd === "cancel") this._setMode(this._mode);
    else if (btn.dataset.cmd === "delete") this._deleteSelected();
    else if (btn.dataset.cmd === "swap-hinge") {
      // Hinge to the other end, door still opens to the same side of the wall.
      this._change((c) => {
        const door = c.doors[sel.index];
        Object.assign(door, { hinge: door.to, to: door.hinge, swing: (door.swing || "left") === "left" ? "right" : "left" });
      });
    } else if (btn.dataset.cmd === "swap-side") {
      this._change((c) => {
        const door = c.doors[sel.index];
        door.swing = (door.swing || "left") === "left" ? "right" : "left";
      });
    } else if (btn.dataset.dir) {
      this._change((c) => {
        c.stairs[sel.index].direction = btn.dataset.dir;
      });
    }
  }

  // --- template image -----------------------------------------------------------------------------

  _traceCommand(cmd) {
    if (cmd === "trace-upload") this.shadowRoot.querySelector(".tracefile").click();
    else if (cmd === "trace-toggle" && this._trace) {
      const hide = this._trace.show !== false;
      if (hide && this._mode.startsWith("trace-")) this._setMode("select");
      this._change((c) => {
        if (hide) c.trace_image.show = false;
        else delete c.trace_image.show;
      });
    } else if (cmd === "trace-remove" && this._config.trace_image) {
      if (this._mode.startsWith("trace-")) this._setMode("select");
      this._change((c) => delete c.trace_image);
    }
  }

  _showNotice(text) {
    this._notice = text;
    this._renderToolbar();
  }

  // Upload to Home Assistant's image storage (the same one person pictures use), which serves it without login.
  async _uploadTrace(file) {
    this._tab = "tab_trace";
    if (!TRACE_TYPES.includes(file.type)) return this._showNotice(this._t("trace_bad_type"));
    this._showNotice(this._t("trace_uploading"));
    let url;
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await this._hass.fetchWithAuth("/api/image/upload", { method: "POST", body });
      if (!res.ok) throw new Error(res.status === 413 ? "> 10 MB" : `HTTP ${res.status}`);
      url = `/api/image/serve/${(await res.json()).id}/original`;
    } catch (e) {
      return this._showNotice(this._t("trace_failed", { error: e.message }));
    }
    await this._setTraceUrl(url);
  }

  // A new image fills most of the visible area; a replaced one keeps place, width and rotation.
  async _setTraceUrl(url) {
    let w, h;
    try {
      [w, h] = await imageSize(url);
    } catch (e) {
      return this._showNotice(this._t("trace_load_failed", { error: e.message }));
    }
    const old = this._trace;
    this._notice = null;
    this._change((c) => {
      if (old) {
        c.trace_image = { ...c.trace_image, url, size: [old.size[0], round((old.size[0] * h) / w)] };
      } else {
        const [x, y, vw, vh] = this._vb;
        const s = Math.min((vw * 0.8) / w, (vh * 0.8) / h);
        c.trace_image = { url, position: [round(x + (vw - w * s) / 2), round(y + (vh - h * s) / 2)], size: [round(w * s), round(h * s)], opacity: 0.5 };
      }
    });
    this._tab = "tab_trace";
    this._setMode(old ? this._mode : "trace-scale");
  }

  // Scale the image around the first point, so the distance between the two points becomes the real one.
  _applyCalib(value) {
    const [a, b] = this._calib || [];
    const measured = a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 0;
    const dist = Number(String(value ?? "").replace(",", "."));
    if (!this._trace || !measured || !(dist > 0)) return;
    const f = dist / measured;
    const empty = !allPoints(this._config).length;
    this._change((c) => {
      const im = c.trace_image;
      const [cx, cy] = traceCenter(im);
      const size = [im.size[0] * f, im.size[1] * f];
      im.size = size.map(round);
      im.position = [round(a[0] + (cx - a[0]) * f - size[0] / 2), round(a[1] + (cy - a[1]) * f - size[1] / 2)];
    });
    // Nothing drawn yet: the grid follows the new size of the image.
    if (empty) this._grid = null;
    this._fitView();
    this._setMode("select");
    this._showNotice(this._t("trace_scaled"));
  }

  _onTraceChange(key, value) {
    if (key === "url") {
      if (value) this._setTraceUrl(value);
      return;
    }
    const n = Number(value.replace(",", "."));
    if (!this._trace || value === "" || !isFinite(n)) return this._renderPanel();
    if (key === "width" && n > 0) {
      // New width: the height follows, the center stays.
      this._change((c) => {
        const im = c.trace_image;
        const [cx, cy] = traceCenter(im);
        im.size = [round(n), round((n * im.size[1]) / im.size[0])];
        im.position = [round(cx - im.size[0] / 2), round(cy - im.size[1] / 2)];
      });
    } else if (key === "rotation") {
      this._change((c) => {
        const deg = round((((n % 360) + 540) % 360) - 180);
        if (deg) c.trace_image.rotation = deg;
        else delete c.trace_image.rotation;
      });
    }
  }

  _onPanelChange(ev) {
    if (ev.target.dataset.trace) return this._onTraceChange(ev.target.dataset.trace, ev.target.value.trim());
    const key = ev.target.dataset.field;
    const sel = this._sel;
    if (!key || !sel) return;
    const value = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value.trim();
    this._change((c) => {
      const item = c[LISTS[sel.kind]][sel.index];
      if (key === "gap") {
        if (value) delete item.gap;
        else item.gap = false;
      } else if (key === "width") {
        // New door width: the hinge stays, the other end moves along the wall.
        const len = Math.hypot(item.to[0] - item.hinge[0], item.to[1] - item.hinge[1]) || 1;
        const w = Number(value);
        if (w > 0) item.to = [round(item.hinge[0] + ((item.to[0] - item.hinge[0]) / len) * w), round(item.hinge[1] + ((item.to[1] - item.hinge[1]) / len) * w)];
      } else if (key === "radius") {
        // One radius for all corners replaces the per-corner ones.
        delete item.radii;
        if (Number(value) > 0) item.radius = Number(value);
        else delete item.radius;
      } else if (key === "steps") {
        if (value === "") delete item.steps;
        else item.steps = Math.max(2, Math.round(Number(value)));
      } else if (key === "type" && (value === "room" || value === "icon")) {
        delete item.type;
      } else if (value === "") {
        delete item[key];
      } else {
        item[key] = value;
      }
    });
  }
}

FloorplanCardEditor.styles = `
  :host { display: block; ${THEME_VARS} }
  button {
    display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 8px; cursor: pointer;
    border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font: inherit; font-size: 13px;
  }
  button[disabled] { opacity: .4; cursor: default; }
  button.on { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
  button.danger { color: var(--error-color); }
  button ha-icon { --mdc-icon-size: 18px; }
  .ribbon-wrap { border: 1px solid var(--divider-color); border-radius: 8px; margin-bottom: 6px; overflow: hidden; background: var(--secondary-background-color, transparent); }
  .qat { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; padding: 4px 6px; border-bottom: 1px solid var(--divider-color); }
  .qat button { padding: 3px 7px; }
  .qat button.save { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
  .qat button.save.failed { background: var(--error-color); border-color: var(--error-color); }
  .qat button.save.busy ha-icon { animation: fp-spin 1s linear infinite; }
  @keyframes fp-spin { to { transform: rotate(360deg); } }
  .spacer { flex: 1; }
  .tabs { display: flex; gap: 2px; padding: 4px 6px 0; overflow-x: auto; scrollbar-width: none; }
  .tabs .tab { flex: none; white-space: nowrap; border: 0; border-radius: 6px 6px 0 0; background: transparent; color: var(--secondary-text-color); padding: 5px 12px; font-weight: 500; }
  .tabs .tab.on { background: var(--card-background-color); color: var(--primary-color); box-shadow: inset 0 2px 0 var(--primary-color); }
  /* One row like in CAD programs: when the dialog is too narrow it scrolls sideways instead of wrapping. */
  .ribbon {
    display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; background: var(--card-background-color); min-height: 86px;
    scrollbar-width: thin; overscroll-behavior-x: contain;
  }
  .rpanel { display: flex; flex-direction: column; flex: none; border-right: 1px solid var(--divider-color); padding: 6px 6px 0; }
  .rbody { display: flex; flex-wrap: nowrap; gap: 4px; flex: 1; align-items: flex-start; }
  .rbody > * { flex: none; }
  .rtitle { font-size: 11px; color: var(--secondary-text-color); text-align: center; padding: 3px 0 4px; white-space: nowrap; }
  .ribbon button.big, .stack .field, .stack button.toggle { white-space: nowrap; }
  .ribbon button.big { flex-direction: column; gap: 2px; min-width: 64px; padding: 6px 6px 4px; border-color: transparent; background: transparent; font-size: 12px; }
  .ribbon button.big ha-icon { --mdc-icon-size: 28px; }
  .ribbon button.big:hover { border-color: var(--divider-color); }
  .ribbon button.big.on { background: color-mix(in srgb, var(--primary-color) 18%, transparent); border-color: var(--primary-color); color: var(--primary-color); }
  .stack { display: flex; flex-direction: column; gap: 3px; font-size: 12px; color: var(--secondary-text-color); }
  .stack .field { display: flex; align-items: center; gap: 4px; padding: 2px 4px; }
  .stack ha-icon { --mdc-icon-size: 16px; }
  .stack input { font: inherit; width: 5em; padding: 1px 4px; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: var(--primary-text-color); }
  .stack select { font: inherit; padding: 1px 4px; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: var(--primary-text-color); }
  .stack button.toggle { font: 600 11px monospace; letter-spacing: .05em; text-transform: uppercase; padding: 3px 8px; color: var(--secondary-text-color); justify-content: flex-start; }
  .stack button.toggle.on { background: color-mix(in srgb, var(--primary-color) 18%, transparent); color: var(--primary-color); border-color: var(--primary-color); }
  .hint { font-size: 12px; color: var(--secondary-text-color); margin-bottom: 6px; min-height: 2.4em; }
  .canvas {
    position: relative; height: min(65vh, 640px); min-height: 320px;
    border: 1px solid var(--divider-color); border-radius: 8px; overflow: hidden; outline: none; background: var(--card-background-color);
  }
  .canvas:focus-visible { border-color: var(--primary-color); }
  .statusbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 4px 0 8px; font-size: 11px; color: var(--secondary-text-color); }
  .statusbar .coords { font: 12px monospace; min-width: 9em; }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; user-select: none; }
  svg.drawing { cursor: crosshair; }
  .gridlines line { stroke: var(--divider-color); }
  .gridlines .g5 { stroke: var(--secondary-text-color); stroke-opacity: .35; }
  .handles .body { fill: transparent; stroke: none; cursor: move; }
  .handles .lbody { stroke: transparent; cursor: move; }
  .handles .body.sel { stroke: var(--primary-color); stroke-dasharray: 4 3; vector-effect: non-scaling-stroke; stroke-width: 2px; }
  .handles .lbody.sel { stroke: var(--primary-color); stroke-opacity: .35; }
  .handles .pt { fill: var(--card-background-color); stroke: var(--primary-color); cursor: grab; vector-effect: non-scaling-stroke; stroke-width: 2px; }
  .handles .pt.hinge, .drafts .pt.hinge { fill: var(--primary-color); }
  .handles .pt.label { fill: transparent; stroke-dasharray: 3 2; }
  .handles .pt.mid { fill: color-mix(in srgb, var(--primary-color) 35%, var(--card-background-color)); }
  .handles .ghost { fill: none; stroke: var(--secondary-text-color); stroke-opacity: .55; stroke-dasharray: 4 3; vector-effect: non-scaling-stroke; stroke-width: 1.5px; pointer-events: none; }
  .handles .ghost-hit { fill: none; stroke: transparent; cursor: pointer; }
  .handles .ghost-hit:hover { stroke: var(--primary-color); stroke-opacity: .25; }
  .handles .marker { fill: color-mix(in srgb, var(--primary-color) 20%, transparent); stroke: var(--primary-color); cursor: move; vector-effect: non-scaling-stroke; stroke-width: 1.5px; }
  .handles .marker.sel { stroke-width: 3px; }
  .handles .marker.empty { stroke-dasharray: 3 2; }
  svg.drawing .handles { pointer-events: none; opacity: .5; }
  .drafts { pointer-events: none; }
  .drafts .band { fill: color-mix(in srgb, var(--primary-color) 10%, transparent); stroke: var(--primary-color); stroke-dasharray: 5 4; vector-effect: non-scaling-stroke; stroke-width: 1px; }
  .drafts .preview { fill-opacity: .75; stroke: var(--fp-wall); }
  .drafts .shapepreview { fill: color-mix(in srgb, var(--primary-color) 12%, transparent); stroke: var(--primary-color); stroke-dasharray: 5 4; vector-effect: non-scaling-stroke; stroke-width: 2px; }
  .drafts .wallpreview { fill: none; stroke: var(--fp-wall); stroke-linejoin: round; stroke-linecap: round; }
  .drafts .wallhl { stroke: var(--primary-color); stroke-opacity: .45; stroke-linecap: round; }
  .drafts .winpreview { stroke: var(--fp-window); stroke-opacity: .8; }
  .drafts .doorpreview { fill: color-mix(in srgb, var(--primary-color) 12%, transparent); stroke: var(--primary-color); }
  .drafts .radpreview { fill: color-mix(in srgb, var(--fp-radiator) 40%, transparent); stroke: var(--fp-radiator); }
  .drafts .dim { fill: var(--primary-color); font-family: monospace; font-weight: 600; text-anchor: middle; dominant-baseline: central; paint-order: stroke; stroke: var(--card-background-color); }
  .drafts .pt { fill: var(--primary-color); }
  .drafts .pt.first { fill: var(--card-background-color); stroke: var(--primary-color); stroke-width: 2px; vector-effect: non-scaling-stroke; }
  .drafts .cursor { fill: var(--primary-color); opacity: .6; }
  .drafts .calib { stroke: var(--primary-color); stroke-dasharray: 6 4; vector-effect: non-scaling-stroke; stroke-width: 2px; }
  .trace { pointer-events: none; }
  .trace .traceframe { fill: none; stroke: var(--primary-color); stroke-dasharray: 6 4; vector-effect: non-scaling-stroke; stroke-width: 2px; }
  svg.trace-move { cursor: move; }
  svg.tracing .room, svg.tracing .outdoor, svg.tracing .zone { fill-opacity: .3; }
  .stack input[type="range"] { width: 8em; padding: 0; border: 0; accent-color: var(--primary-color); }
  button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
  .overlay { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .overlay ha-state-icon { position: absolute; transform: translate(-50%, -50%); --mdc-icon-size: 18px; color: var(--primary-text-color); }
  .panel { border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px 10px; }
  .panel .empty { color: var(--secondary-text-color); font-size: 13px; }
  .panel .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 0; border: 0; background: none; }
  .panel .fields { display: grid; gap: 8px; }
  .panel label { display: grid; gap: 2px; font-size: 12px; color: var(--secondary-text-color); }
  .panel label.check { display: flex; align-items: center; gap: 6px; color: var(--primary-text-color); font-size: 13px; }
  .panel .note { font-size: 12px; color: var(--secondary-text-color); }
  .panel .buttons { display: flex; flex-wrap: wrap; gap: 6px; }
  .panel .dirs button { padding: 4px 10px; }
  .panel input:not([type="checkbox"]), .panel select {
    font: inherit; font-size: 14px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--divider-color);
    background: var(--secondary-background-color, transparent); color: var(--primary-text-color);
  }
  :host(:fullscreen) {
    display: grid; grid-template-columns: 1fr minmax(260px, 340px); grid-template-rows: auto auto 1fr auto; gap: 0 16px;
    padding: 16px; box-sizing: border-box; background: var(--primary-background-color, #111); overflow: auto;
  }
  :host(:fullscreen) .ribbon-wrap, :host(:fullscreen) .hint { grid-column: 1 / -1; }
  :host(:fullscreen) .canvas { grid-column: 1; grid-row: 3; height: 100%; min-height: 0; }
  :host(:fullscreen) .statusbar { grid-column: 1; grid-row: 4; }
  :host(:fullscreen) .panel { grid-column: 2; grid-row: 3; align-self: start; }
  ${PLAN_CSS}
`;

customElements.define("floorplan-card", FloorplanCard);
customElements.define("floorplan-card-editor", FloorplanCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "floorplan-card",
  name: "Floorplan Card",
  description: "Floor plan from coordinates with live windows, doors, radiators and stairs – with a drawing editor.",
  preview: true,
  documentationURL: "https://github.com/mfurti/floorplan-card",
});

console.info(`%c FLOORPLAN-CARD %c ${VERSION} `, "color:#fff;background:#03a9f4;font-weight:700", "color:#03a9f4");
