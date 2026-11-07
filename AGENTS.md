# Expanse layout source
This repository is authoritative. Own only Expanse paths. Do not edit installed copies or other layouts. Use pnpm and mise tasks; daft for worktrees. No bundled dependencies.
Read docs/LAYOUT_GUIDE.md before changing design, native UI or installation. For local house rules read `~/.config/herdr-app/AGENTS.md`, then `CLAUDE.md`, then `LAYOUT_GUIDE.md`. Generated host types are authoritative.
Run `mise run test` and `mise run check`; native check requires an installed compatible Herdr. Coordinate live installation and QA. `mise run install` refuses collisions; `mise run update` backs up and swaps complete folders. Neither switches the window. Never restart the core or bypass sandbox restrictions.
Keep pure rules in model.js, geometry.js and telemetry.js. No animation timers. Preserve explicit command targets, optional dependency gating, accurate statuses and dark terminal colors in both appearances.
Maintain the portable guide with verified general lessons, coordinating its canonical owner. Never publish personal house rules, terminal captures, local state, logs or credentials. Previews must be original synthetic illustrations, marked as such.
