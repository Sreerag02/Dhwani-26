# Dhwani 26 — World flow V6

Open Dhwani26-WORLD-v6 in VS Code, then run npm install and npm run dev -- --host.

Order: World of Dhwani → cloud cover → cloud reveal → Carnivale Razzmatazz
→ scroll-controlled mask transition → Khai. Scroll backward to reverse the scenes.
There is no entry button, click gate, or Scroll to Meet Khai prompt.

The header starts when the first section leaves the viewport and hides when you
return to it. The drawer uses a full-screen dark layout, large left-aligned links,
logo/date header and top-right close button. It supports Escape, focus trapping,
focus return and scroll locking. Links target the implemented sections;
About CET expands inside the drawer. Date Reveal remains empty awaiting assets.

Khai uses CSS backgrounds and native text panels instead of the background/sign
images. Mascot, logo, clouds and font files load locally from public/assets.
No remotely hosted images or fonts are requested. The font attribution link is
retained. Check Galavant's original web-use permission before public deployment.

Theme and cloud layers share one smoothed scroll timeline. Transform/opacity
updates avoid per-frame React state. Idle animations pause offscreen and in a
hidden tab; reduced-motion settings are respected.

Production build and archive integrity verified. Browser rendering and physical
phone/laptop performance have not been measured in this environment.

This ZIP has one runnable project folder, includes the current page's local assets,
and excludes node_modules and dist. Keep your existing Git metadata when copying
changes into an existing repository. A .gitignore is included for future commits.
