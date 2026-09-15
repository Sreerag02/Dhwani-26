# Ferris wheel physics asset pack

Generated from your uploaded `new ferris.svg`.

## Files
- `rotor.svg` — only the rotating wheel/rim/spokes.
- `support.svg` — fixed axle + legs.
- `cabins/` — 12 cabins extracted from your original SVG.
- `FerrisWheel.jsx` — React component with gravity-driven gondola physics.
- `FerrisWheel.css` — layout/animation styles.
- `geometry.json` — extracted wheel center, radius, cabin pivots.

## Put into your Vite project
Copy these assets to:

```
public/assets/ferris/rotor.svg
public/assets/ferris/support.svg
public/assets/ferris/cabins/cabin-01.png ... cabin-12.png
```

Put `FerrisWheel.jsx` and `FerrisWheel.css` in your component folder.

Use:

```jsx
import FerrisWheel from "./components/FerrisWheel";

<FerrisWheel duration={48} />
```

`duration=48` means one full turn every 48 seconds.

The gondolas are not simply counter-rotated. Each is simulated as a damped pendulum under gravity, including the acceleration of its moving pivot, so it remains nearly upright at steady speed and swings naturally during the start-up ramp.
