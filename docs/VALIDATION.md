# Validation record

## Automated evidence

- 26 tests pass: full flight-course wins, budgets, collision, undo and hints; all 999 relay seeds, loss and invalid-action boundaries; score minimum selection; 48-face geometry; network/battery parsing; eight isolated installer and failure-recovery scenarios; explicit clicked targets and optional rename capability/identity.
- Real native entry and all transitive imports pass `herdr-app check`.
- 68 isolated native fixtures pass: light/dark, 12 roles, five rooms empty/populated, long synthetic names, explicit menu targets, optional rename, game win/loss states and a battery-present footer.
- Installer validates staged transitive imports, refuses collisions/symlinks, preserves unrelated configuration and unowned package-local files, installs layout last, rolls back failures and retains staging/backup files if rollback itself fails.

## Live evidence

Pending coordinated live installation and QA. No fixture or original illustration is counted as a live screenshot or click test. The currently published validation statement must be updated only with observed results.

## Limits

macOS-only local network and battery probes; no Internet reachability claim. Battery discharge and other unavailable hardware states require parser fixtures. Original previews contain synthetic examples. The native initial-render checker does not exercise all deferred or asynchronous UI behavior. Projected 3D is a bounded 48-face study, not a native engine or licensed ship mesh. Game physics and communications are simplified original rules.
