# Floorplan Card

A Lovelace card for Home Assistant that draws a floor plan from plain coordinates – rooms, windows, doors,
radiators and stairs – and colors them by entity state. It comes with a visual editor, so you can draw the
plan right in the dashboard: no SVG editor, no image, no YAML needed.

*Deutsch: [siehe unten](#deutsch).*

## Features

- Rooms as rectangles, polygons or circles/ellipses, with rounded corners and arc walls
- Windows colored by their contact sensor (open: red and pulsing, closed: green)
- Doors with swing, radiators showing when they heat, stairs with direction
- Icons and values of any entity on the plan, labels
- Click a room to open a dashboard, click a window or radiator for its details
- Colors follow your Home Assistant theme
- Visual editor with a CAD-like ribbon: grid, ortho and wall snap, undo, zoom, full screen

## Installation

1. Copy `floorplan-card.js` to `/config/www/floorplan-card/`.
2. Add it as a dashboard resource: *Settings → Dashboards → ⋮ → Resources*,
   URL `/local/floorplan-card/floorplan-card.js`, type *JavaScript module*.
3. Add a card, search for *Floorplan Card* and start drawing.

## Example

Coordinates can be in any unit (meters, centimeters, pixels of a photo).

```yaml
type: custom:floorplan-card
rooms:
  - name: Living room
    rect: [0, 0, 5, 4]
    radii: [0.5, 0, 0, 0]
    navigation_path: /dashboard-home/living-room
  - name: Kitchen
    rect: [5, 0, 8, 4]
    arcs: [0, 0.8, 0, 0]
  - name: Bay
    ellipse: [1, 4, 3, 5.5]
windows:
  - from: [1, 0]
    to: [3, 0]
    entity: binary_sensor.living_room_window
doors:
  - hinge: [5, 2.6]
    to: [5, 3.5]
    swing: left
radiators:
  - from: [0.3, 1]
    to: [0.3, 2.5]
    entity: climate.living_room
```

## License

MIT

---

## Deutsch

Eine Lovelace-Karte für Home Assistant, die einen Grundriss aus Koordinaten zeichnet – Räume, Fenster, Türen,
Heizkörper und Treppen – und sie nach dem Zustand der Entitäten einfärbt. Mit eingebautem grafischen Editor:
Der Grundriss wird direkt im Dashboard gezeichnet, ohne SVG-Programm, Bild oder YAML.

**Funktionen:** Räume als Rechteck, Vieleck oder Kreis/Ellipse, mit abgerundeten Ecken und Bogenwänden ·
Fenster in der Farbe ihres Kontakts (offen: rot und pulsierend, zu: grün) · Türen mit Aufschlag, Heizkörper
zeigen, wenn sie heizen, Treppen mit Laufrichtung · Symbole und Werte beliebiger Entitäten, Beschriftungen ·
Klick auf einen Raum öffnet ein Dashboard · Farben aus dem HA-Theme · Editor mit Ribbon wie in CAD-Programmen:
Raster, Ortho, Wandfang, Rückgängig, Zoom, Vollbild.

**Installation:** `floorplan-card.js` nach `/config/www/floorplan-card/` kopieren, unter
*Einstellungen → Dashboards → ⋮ → Ressourcen* als *JavaScript-Modul* mit der URL
`/local/floorplan-card/floorplan-card.js` eintragen, dann eine Karte hinzufügen und *Floorplan Card* wählen.

Das Beispiel oben gilt genauso; die Konfiguration ist englisch, die Oberfläche passt sich der Sprache von
Home Assistant an (Deutsch und Englisch).
