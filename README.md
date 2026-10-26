# Floorplan Card

A Lovelace card for Home Assistant that draws a floor plan from plain coordinates – rooms, windows, doors,
radiators and stairs – and colors them by entity state. It comes with a visual editor, so you can draw the
plan right in the dashboard: no SVG editor, no image, no YAML needed.

![Floorplan Card showing an apartment with rooms, windows, doors, radiators, stairs and live sensor values](https://github.com/user-attachments/assets/620d6d16-221d-41af-91cd-7621b45644a4)

## Features

- Rooms as rectangles, polygons or circles/ellipses, with rounded corners and arc walls
- Windows colored by their contact sensor (open: red and pulsing, closed: green)
- Doors with swing, radiators showing when they heat, stairs with direction
- Icons and values of any entity on the plan, labels
- Link a room to a Home Assistant area: a click shows the area's devices in a popup (switch lights, see readings)
- Choose per room what a click does: nothing, entity details, open a dashboard or show the area
- Click a window or radiator for its details
- Colors follow your Home Assistant theme
- Editor in English and German, following the Home Assistant language
- Visual editor with a CAD-like ribbon: grid, ortho and wall snap, undo, zoom, full screen
- Trace a template: upload a photo or scan of your floor plan, set its scale with two points and draw on top

## Installation

### HACS (recommended)

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mfurti&repository=floorplan-card&category=plugin)

1. Click the button above, or in HACS open *⋮ → Custom repositories*, add `https://github.com/mfurti/floorplan-card`
   with type *Dashboard*.
2. Download *Floorplan Card* and reload the browser when HACS asks.
3. Add a card, search for *Floorplan Card* and start drawing.

HACS shows new versions as updates in Home Assistant.

### Manual

1. Download `floorplan-card.js` from the [latest release](https://github.com/mfurti/floorplan-card/releases/latest)
   and copy it to `/config/www/floorplan-card/`.
2. Add it as a dashboard resource: *Settings → Dashboards → ⋮ → Resources*,
   URL `/local/floorplan-card/floorplan-card.js`, type *JavaScript module*.
3. Add a card, search for *Floorplan Card* and start drawing.

To update, replace the file and change the resource URL (e.g. `…/floorplan-card.js?v=0.9.1`) so browsers load the
new version. The browser console shows the running version (`FLOORPLAN-CARD 0.9.1`).

## Example

Coordinates can be in any unit (meters, centimeters, pixels of a photo).

```yaml
type: custom:floorplan-card
rooms:
  - name: Living room
    rect: [0, 0, 5, 4]
    radii: [0.5, 0, 0, 0]
    navigation_path: /dashboard-home/living-room
  - area: kitchen            # name and click popup come from the Home Assistant area
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

## Clicking a room

| Key | Effect |
| --- | --- |
| `area` | Area ID from Home Assistant. A room without `name` shows the area's name. |
| `navigation_path` | Dashboard to open, e.g. `/dashboard-home/kitchen`. |
| `entity` | Light or switch: the room lights up while it is on. |
| `tap_action` | `action: none`, `more-info`, `navigate`, `area` or any Home Assistant action (`toggle`, `perform-action`, `url`). |

Without `tap_action` a click opens `navigation_path` if set, otherwise the area popup, otherwise the entity details.
In the editor, pick the area and the click action in the room's properties.

## Tracing a template image

In the editor, open the *Template* tab (the first one) and upload a photo or scan of your floor plan
(JPG, PNG or GIF, up to 10 MB), or drop it onto the drawing area. The image is stored in Home Assistant's
image storage. Pick the unit of your plan (m, cm or mm), then draw the scale: click two points whose real
distance you know (e.g. both ends of a wall) and enter that distance – the image is scaled to fit. Move, rotate, fade or hide it as needed and trace the rooms on top.

The image only shows in the editor, never in the card. It is kept in the card config so it is still there
next time:

```yaml
unit: m                    # m, cm or mm – a label for dimensions, coordinates are not converted
trace_image:
  url: /api/image/serve/<id>/original   # or e.g. /local/plan.png
  position: [-0.4, -0.2]   # top left corner
  size: [12.5, 8.3]
  rotation: -1.5           # degrees, optional
  opacity: 0.5             # optional
  show: false              # optional, hides it
```

## License

MIT
