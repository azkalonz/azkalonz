# Design lab workflow

Run `npm run dev`, then open **Design lab** in the lower-right corner. The toolbar is available only in development and includes 31 complete color-and-type systems. The selected preview persists across routes and reloads while the tracked production theme remains unchanged.

Use the site header's theme control to inspect the selected family in both light and dark mode.

Google-font themes load only the selected preview's two-family stylesheet. Other catalog fonts are not requested, and the local Source Sans baseline remains bundled for production and fallback use.

## Apply a palette permanently

List the available IDs:

```sh
npm run theme:list
```

Apply any catalog theme with the scalable command shown by the Design Lab:

```sh
npm run theme:apply -- signal-brutalist
```

Applying a theme updates `themes/current-theme.json` plus the static manifest, 404 fallback, and design-system color reference. A selected Google font is also added to the production document head and standalone 404 page. Commit those generated changes when you decide to deploy the palette. A browser preview never modifies those files and is excluded from production builds and GitHub Pages output.
