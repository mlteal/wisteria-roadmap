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

After adding the HTML somewhere in your app, here are some 
basics to get you started: 

- To add an item, double-click in the location you'd like
  to add to and complete the form that pops up.
- Right click on an item to delete it. Be sure to confirm
  when the confirmation box appears.
- Scrolling with your cursor within the roadmap bouandries
  will zoom in or out.

## Organization

Roadmaps are top-level taxonomies that can have "project"
groupings within.

- My Product Roadmap
  - Project Marketing
    - Item 1
    - Item 2 ...
  - Project Frontend MVP
    - Item 1
    - Item 2 ...

## Development

For local JS development, you'll want to run `npm install` from
the `app/wisteria` directory. Use `npm start` to utilize hot reloading
while developing, and `npm run-script build` to create a production build
that should be commited before a release is tagged.

#TODO: add CI with a build process :)

To ensure you're using the correct scripts while developing, it's
recommended that you set `WP_DEBUG` to true in your local environment.
