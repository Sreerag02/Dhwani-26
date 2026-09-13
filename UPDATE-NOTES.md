# Dhwani 26 — reversible scroll release V5

Open the extracted Dhwani26-REVERSIBLE-v5 folder in VS Code.
Run `npm install`, then `npm run dev -- --host`.

Tap anywhere on Gates to reveal the mask. Scroll down to separate the cloud
curtain, then reveal Khai, the lettering, signs and foreground. Scroll back up
to reverse these stages and close the clouds again. The opening mask itself
plays once; the cloud and hero timeline is reversible throughout the visit.

Changes:
- A shared spring smooths the cloud and hero scroll progress in both directions.
- Removed the one-way progress lock and conditional cloud unmounting.
- Hero motion updates transform and opacity directly without per-frame React state.
- Drift pauses while the hero is covered, offscreen, or the tab is hidden.
- Theme layers follow their own reversible scroll progress, with stronger entrances.
- Added two lanterns, two notes and two edge clouds using existing assets.
- Increased idle drifting while retaining reduced-motion support.
- Desktop theme remains 16:9; mobile retains a separate portrait composition.
- Date Reveal remains empty until its assets are supplied.

Production build passed. The archive was verified against the updated source.
Browser screenshots and device frame-rate testing were unavailable here; actual
smoothness still needs checking on the target phone and laptop.

Asset notes: This runnable release includes assets referenced by the current page,
not unused design source files. Original sign artwork contains baked-in canvas
backgrounds; CSS clips their edges. Transparent exports would improve those edges.

The supplied Galavant archive has a generic third-party license that requires
attribution and notes possible demo restrictions. The menu includes attribution;
verify the original font author's web-use permission before public deployment.
