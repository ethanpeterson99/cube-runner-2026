# Cube Runner 2026

A modern remake of the classic Cube Runner iPhone game. Tilt to steer, dodge the cubes, survive the speed ramp.

Single-file Three.js arcade game — no build step, no dependencies beyond a CDN script tag.

## Controls

| Input | Action |
|---|---|
| Tilt phone | Steer left/right (portrait or landscape) |
| Touch drag | Steer (fallback) |
| Arrow keys / A,D | Steer (desktop) |
| Space | Restart after a crash |

## Features

- DeviceOrientation tilt steering with iOS 13+ permission flow and devicemotion fallback
- Auto-calibrates neutral grip on start and on portrait/landscape rotation
- Progressive difficulty: continuous speed ramp (1.0x to 4.0x), cube density growth, lane-biased spawning
- Instanced rendering (320 cubes, one draw call), gradient sky shader, scrolling grid ground, speed lines, FOV stretch
- Persistent best score

## Local development

Open `index.html` in a browser. Note: motion sensors require HTTPS, so tilt only works on a deployed URL or localhost — not `file://`.

```bash
npx serve .
```

## Deploy

Static site — deploys to Vercel with zero config.

```bash
vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard for automatic deploys on push.

## iOS wrapper

For the App Store version, load this in a WKWebView. Recommended: skip the web sensor APIs and inject CoreMotion data via `evaluateJavaScript` for smoother 60Hz input.
