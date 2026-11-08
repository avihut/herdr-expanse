# Validation record

## Automated evidence

- 27 tests pass: full flight-course wins, budgets, collision, undo and hints; all 999 relay seeds, loss and invalid-action boundaries; score minimum selection; 48-face geometry; network/battery parsing; eight isolated installer and failure-recovery scenarios; explicit clicked targets and optional rename capability/identity; and the shared parent/child space hierarchy (nesting, selectable parents with their own tabs, cycle, self-parent, stale-parent and cross-machine rejection, colliding local IDs across machines, empty lists).
- Real native entry and all transitive imports pass `herdr-app check`.
- 73 isolated native fixtures pass: light/dark, 12 roles, five rooms empty/populated, long synthetic names, explicit menu targets, optional rename, game win/loss states and a battery-present footer, and the COMMAND / SECTORS primary hierarchy with a long-named child sector expanded and folded plus a remote machine reusing the same local ID, in both appearances.
- Installer validates staged transitive imports, refuses collisions/symlinks, preserves unrelated configuration and unowned package-local files, installs layout last, rolls back failures and retains staging/backup files if rollback itself fails.

## Live evidence

Observed on macOS on 2026-11-07 during an exclusive, coordinated QA slot:

- Guarded first installation and complete-folder updates succeeded. Native checks passed before each staged update became visible.
- All five rooms rendered real workspace, tab, machine and agent data. Dark and light chrome kept running Codex and Claude terminal text readable on dark terminal surfaces.
- The native layout picker opened at its trigger in both appearances, marked Expanse, hid replaced built-ins, and switched back to Windows XP through an actual menu click. The detected-agent launch menu and all-workspace plans dialog also populated correctly; no agent was launched during QA.
- A menu opened from an initially unfocused pane retained that explicit target: choosing Focus moved focus from the original pane to the clicked pane. The original focus was restored afterwards. The optional Rename entry appeared with the compatible helper installed.
- Flip & Burn course 1 was won through real keyboard input in seven ticks with six burns, zero final velocity and score 25. Boundary failure, undo, hint and restart were exercised. Reset later cleared the saved best score.
- Tight-beam seed 1 was won through real keyboard input using 25 rotations, visiting all 16 cells and recording best score 25. Three failed transmissions produced the loss state; restart restored the budget and an alignment hint identified a misaligned relay.
- Yaw, pitch, zoom and drive selection visibly changed the original projected 3D cutter. The light appearance rendered its dark inspection viewport and explanatory text clearly.
- Coffee, both registry cards and three sample observations earned their patches. Together with the two game wins and walkaround, all six patches appeared in the archive. The reset required its second confirmation click and cleared only the layout's test progress.
- Belt accents and reduced-motion toggles changed their visible states; the default Roci palette and motion setting were restored. Sound remained muted.
- The footer's local LINK UP and 100% AC battery matched read-only host probe output. No Internet reachability claim was made.
- Live QA exposed paragraph clipping from horizontal scrolling on the entire dialog body. The installed correction constrains prose width and scrolls only bounded-height geometry rows. Rules/help then wrapped in both appearances. A light-mode hazard marker was also corrected to use a contrasting pale glyph on its burgundy tile and visually rechecked.
- Windows XP, the original workspace/tab/pane, and the originally absent appearance override were restored. Final overlays and errors were empty. No temporary tabs remained, and the shared QA lock was released.

Private QA captures remain local and are deliberately excluded from this repository. The published SVG previews are original synthetic illustrations, not live evidence.

## Limits

Live acceptance of the COMMAND / SECTORS parent/child hierarchy is pending. It needs real clicks on the room switch, the disclosure control and the parent and child rows, in light and dark. The earlier live QA above predates the hierarchy and does not cover it. Pure tests and native fixtures pass, but they are not live acceptance.

Small OS-window interaction and other operating systems were not observed. Compact-header native fixtures are not a substitute for that test. Flight courses 2–3 and relay seeds 2–999 have pure solvability tests, not live completion claims. Clipboard content transfer and the native timing of focus-then-copy/paste were not exercised against working agent prompts; command sequence and explicit-target tests pass. Rename submission and launching a new agent were not exercised. The original acknowledgment tone was not audibly verified.

macOS-only local network and battery probes; no Internet reachability claim. Battery discharge and other unavailable hardware states require parser fixtures. Original previews contain synthetic examples. The native initial-render checker does not exercise all deferred or asynchronous UI behavior. Projected 3D is a bounded 48-face study, not a native engine or licensed ship mesh. Game physics and communications are simplified original rules.
