# Wisteria Roadmap

Welcome to Wisteria!

This is still very much a beta project, so feel free to 
create issues in this repo or find @mlteal on the WP core 
Slack with any questions, comments, etc. 

To run the app on the frontend, include the 
following shortcode anywhere on the page, using the 
term ID for the roadmap you'd like to display: 

```html
[wrm_roadmap roadmap_id="{roadmap_id}"]
```

Note: only one roadmap can be displayed per page.

After adding the HTML somewhere in your app, here are some basics to get you started: 

- (Future Feature) To add an item, double-click in the location you'd like to 
  add to and complete the form that pops up.
- Right click on an item to delete it. Be sure to confirm when the confirmation box appears.
- Scrolling with your cursor within the roadmap bouandries will zoom in or out.

# Release Notes

### 0.1.0

- Plugin officially has a version
- Ability to create multiple roadmaps
- Add `[wrm_roadmap roadmap_id="""]` shortcode for displaying roadmaps
- Easily attach projects to a specific roadmap via the Project Create or Project Edit screens
