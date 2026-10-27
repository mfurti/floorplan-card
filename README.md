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

Installing with an AI assistant? Point it to [`llms.txt`](llms.txt) – compact install steps and config notes.

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

To update, replace the file and change the resource URL (e.g. `…/floorplan-card.js?v=0.9.2`) so browsers load the
new version. The browser console shows the running version (`FLOORPLAN-CARD 0.9.2`).

## Example

Coordinates can be in any unit (meters, centimeters, pixels of a photo). All keys: [Configuration reference](#configuration-reference).

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

## Configuration reference

All coordinates are plain numbers in one unit of your choice (meters, centimeters, pixels of a photo). x grows to the
right, y grows **down**. A point is `[x, y]`, a box is `[x1, y1, x2, y2]` (two opposite corners).

### Card

| Key | Type | Description |
| --- | --- | --- |
| `type` | string | `custom:floorplan-card` |
| `rooms` | list | **Required**, at least one room. |
| `windows`, `doors`, `radiators`, `stairs`, `elements`, `labels` | list | Optional, see below. |
| `title` | string | Card header. |
| `unit` | `m` \| `cm` \| `mm` | Label for dimensions in the editor. Coordinates are not converted. |
| `viewbox` | `[x, y, width, height]` | Visible area. Default: everything plus a small margin. |
| `padding` | number | Margin around the plan when `viewbox` is not set. Default: 3 % of the plan size. |
| `trace_image` | object | Template image, only shown in the editor. See [Tracing a template image](#tracing-a-template-image). |

### Rooms

One of `rect`, `points` or `ellipse` is required.

| Key | Type | Description |
| --- | --- | --- |
| `rect` | box | Rectangle. Corners in order: top left, top right, bottom right, bottom left. |
| `points` | list of points | Polygon, at least 3 corners, walls run from each point to the next. |
| `ellipse` | box | Circle or ellipse inside this box. |
| `name` | string | Shown in the middle of the room. Without a name the room shows the name of its `area`. |
| `type` | `room` \| `outdoor` \| `zone` | `outdoor`: balcony or terrace (faded). `zone`: area inside a room (dashed outline, no fill). Default `room`. |
| `area` | area ID | Home Assistant area. A click shows its devices in a popup. |
| `entity` | entity ID | The room lights up while it is `on`, `open`, `playing`, `home`, `heat`, `cool`, `heating` or `cleaning`. |
| `navigation_path` | string | Dashboard to open on click, e.g. `/dashboard-home/kitchen`. |
| `tap_action` | action | What a click does, see [Actions](#actions). |
| `radius` | number | Rounds all corners (not for `ellipse`). |
| `radii` | list of numbers | Radius per corner, in the order of the corners; overrides `radius`. |
| `arcs` | list of numbers | Bends wall *i* (from corner *i* to *i + 1*) into an arc: how far its middle moves out. The sign picks the side, `0` keeps it straight. |
| `label` | boolean | `false` hides the name. |
| `label_position` | point | Where the name goes. Default: middle of the room. |
| `label_size` | `small` | Smaller name, e.g. for small rooms. |

Without `tap_action`, a click opens `navigation_path` if set, otherwise the area popup, otherwise the details of
`entity`. Rooms without any of these are not clickable.

### Windows

| Key | Type | Description |
| --- | --- | --- |
| `from`, `to` | point | **Required.** Both ends, on a wall. |
| `entity` | entity ID | Contact sensor, cover or `input_boolean`: open red and pulsing, closed green, anything else grey. Needed for clicks. |
| `name` | string | Tooltip, default: friendly name of the entity. |
| `tap_action` | action | Default: entity details. |

### Doors

| Key | Type | Description |
| --- | --- | --- |
| `hinge` | point | **Required.** Hinge side of the opening. |
| `to` | point | **Required.** Other side of the opening; the distance is the door width. |
| `swing` | `left` \| `right` | Side the door opens to, seen from `hinge` towards `to`. Default `left`. |
| `gap` | boolean | `false` keeps the wall line drawn through the opening. |

### Radiators

| Key | Type | Description |
| --- | --- | --- |
| `from`, `to` | point | **Required.** Both ends, along a wall. |
| `entity` | `climate` entity | Glows and pulses while `hvac_action` is `heating`, faded when `off` or unavailable. Needed for clicks. |
| `width` | number | Depth of the radiator. Default: a fixed size on screen. |
| `name` | string | Tooltip. |
| `tap_action` | action | Default: entity details. |

### Stairs

| Key | Type | Description |
| --- | --- | --- |
| `rect` | box | **Required.** |
| `direction` | `up` \| `down` \| `left` \| `right` | Where the arrow points (the way up). Default: along the longer side. |
| `steps` | number | Number of steps. Default: from the shape. |
| `name` | string | Text at the start of the arrow. Default: "up" in the language of Home Assistant; `""` hides it. |
| `navigation_path` | string | Dashboard to open on click, e.g. the upper floor. |
| `tap_action` | action | See [Actions](#actions). |

### Elements

Icons or values of any entity, placed on the plan.

| Key | Type | Description |
| --- | --- | --- |
| `position` | point | **Required.** Middle of the icon or value. |
| `entity` | entity ID | **Required** to show anything. |
| `type` | `icon` \| `state` | Icon (colored when active) or the formatted state as a small chip. Default `icon`. |
| `icon` | string | Icon instead of the entity's own, e.g. `mdi:lightbulb`. |
| `prefix`, `suffix` | string | Text before and after the value (`type: state`). |
| `title` | string | Tooltip. |
| `tap_action` | action | Default: entity details. |

### Labels

| Key | Type | Description |
| --- | --- | --- |
| `position` | point | **Required.** |
| `text` | string | **Required.** |
| `size` | `small` | Smaller, lighter text. |

### Actions

`tap_action` takes `action` and the usual Home Assistant fields:

| `action` | Fields | Effect |
| --- | --- | --- |
| `more-info` | `entity` (optional) | Details dialog of the item's entity or of `entity`. |
| `navigate` | `navigation_path` (optional) | Opens a dashboard; without a path the item's `navigation_path`. |
| `area` | `area` (optional) | Popup with the devices of the item's `area` or of `area`. |
| `toggle` | `entity` (optional) | Toggles the item's entity or `entity`. |
| `perform-action` | `perform_action`, `data`, `target` | Runs a Home Assistant action, e.g. `light.turn_on`. (`call-service` / `service` also work.) |
| `url` | `url_path` | Opens a web page in a new tab. |
| `none` | | Nothing; a room is then not clickable at all. |

Any action can have `confirmation: { text: "..." }` to ask first.

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

## Feedback

Found a problem or have an idea? The easiest way is right in the editor: open the *View* tab and click
**Report a problem** or **Suggest an idea**. The form on GitHub opens with the card version, Home Assistant
version and device already filled in.

Or use these links: [Report a problem](https://github.com/mfurti/floorplan-card/issues/new?template=bug_report.yml) ·
[Suggest an idea](https://github.com/mfurti/floorplan-card/issues/new?template=feature_request.yml) ·
[Ask a question](https://github.com/mfurti/floorplan-card/discussions)

## License

MIT
