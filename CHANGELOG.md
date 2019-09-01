### 0.1.8

- Update js packages and rebuild React app
- Update Readme and add changelog

### 0.1.7

- Bugfix: items poof on description update
- bugfix: adjust js handling of item delete

### 0.1.6

- Bugfix: new items can now be edited immediately after creation
- Bugfix: possible add_action ordering on API endpoints

### 0.1.5

- Bugfix: new items no longer disappear from UI due to broken
  dates when dragged/moved immediately after creation
- The new item modal now closes on `esc` keypress instead of
  having to hit the close button

### 0.1.4

- 🍍
- Frontend item management (add/update via modal) is here and mostly works!

### 0.1.3

- Allow item percent complete to be updated via frontend
- Prep API's for ability to edit items right via the frontend roadmap view
- Update CSS styles, some minor JS code organization (it's still a mess with components flying everywhere)

### 0.1.2

- Fix: include empty Roadmap taxonomies in Project Term management meta form

### 0.1.1

- Add some color beautifucation on the frontend. Stylesheet
  and class names are definitely not set in stone, so if you're
  making tweaks beware.
- Set a minimum item width and minimum display time period (one day).
  Items that are smaller than a day are tough to resize ¯\\_(ツ)_/¯

### 0.1.0

- Plugin officially has a version
- Ability to create multiple roadmaps
- Add `[wrm_roadmap roadmap_id="""]` shortcode for displaying roadmaps
- Easily attach projects to a specific roadmap via the Project Create or Project Edit screens
