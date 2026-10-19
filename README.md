# ARTStronomy 2026

Editable React/Vite/Three.js source for the UTAR FCI exhibition.

Website: https://jonah0412.github.io/artstronomy-2026/

## Development

Requires Node.js 22+, npm and Python 3 (for standalone scanner packaging).

```sh
npm ci
npm run dev
```

`src/` contains the editable homepage, spaceship, museum, AR interface, scanner,
quiz and transitions. `public/` contains the self-hosted artwork, models and
tracking assets. The verified roster remains in `src/cosmic/creators.js`.

## Build and publish

```sh
npm run build
npm test
npm run build:pages
```

This source migration is staged on `editable-source-migration` for review. No deployment is triggered by this branch.
The Pages build handles the `/artstronomy-2026/` base path, including runtime
model URLs and embedded AR/scanner pages. The existing `site/` folder remains the deployment input for the unchanged Pages workflow. Switching that workflow to `dist/client/` requires deployment approval.
The legacy `node preview.mjs` command still previews that old snapshot.
Use `npm run preview` after a build to inspect the new build.

This migration imports the current published mascot-scanner version. The proposed
assembled GLB cockpit renovation is NOT included or approved for deployment.
Hardware camera/AR and physical-mobile testing remain necessary. Build/unit tests
are not a substitute for visual review.

Third-party licenses remain alongside their files. Exhibition artwork and creator
content remain the property of their respective owners.
