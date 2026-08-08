# Design lab workflow

Run `npm run dev`, then open **Design lab** in the lower-right corner. The toolbar is available only in development. Its **Color & type** tab includes the Mineral baseline plus ten strongly differentiated visual themes, while **Tile motion** includes ten reversible hero-transition styles. Both choices persist independently across routes and reloads. The tracked production theme and transition remain unchanged while previewing.

Use the site header's theme control to inspect the selected family in both light and dark mode.

## Apply a palette permanently

List the available IDs:

```sh
npm run theme:list
```

Apply a named palette:

```sh
npm run theme:apply:signal-brutalist
```

The scalable form is also available:

```sh
npm run theme:apply -- signal-brutalist
```

Applying a theme updates `themes/current-theme.json` plus the static manifest, 404 fallback, and design-system color reference. Commit those generated changes when you decide to deploy the palette. A browser preview never modifies those files and is excluded from production builds and GitHub Pages output.

## Apply a tile transition permanently

List the available motion IDs:

```sh
npm run transition:list
```

Apply a named transition:

```sh
npm run transition:apply:hub-pulse
```

The scalable form is also available:

```sh
npm run transition:apply -- hub-pulse
```

Applying a transition updates only `transitions/current-transition.json`. The next production build reads that tracked file. Preview styles and the Design lab interface remain excluded from the build.
