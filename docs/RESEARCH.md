# Research and adaptation notes

Research performed for this build on 2026-11-07. Reference captures were viewed privately and are not redistributed. The previews in this repository are original synthetic illustrations.

## Production interface sources

- [Rhys Yorke: Rocinante UI](https://rhys.artstation.com/projects/q9Am1L). A production designer’s portfolio establishing the hero-ship design-guide work and continuity with earlier screens. No art is copied into the package.
- [Rhys Yorke interview, Pushing Pixels](https://www.pushing-pixels.org/2021/09/04/the-art-and-craft-of-screen-graphics-interview-with-rhys-yorke.html). Yorke discusses practical actor-operated screens, faction distinctions and restrained warnings. His Belter guide used warm orange/brown; Martian interfaces used harsher red. Privately inspected credited Rocinante system-link, Agatha King and Behemoth captures: narrow outlines, grouped command rows, compact labels, layered diagrams and clear action strips. The Rocinante system-link frame particularly informed the cyan outline / burgundy strip / amber-action hierarchy here. These observations informed a new native composition, not a traced screen.
- [Harrison Vincent: The Expanse](https://www.harrisonvincent.com/works/the-expanse). Designer account of the 2019 Comic-Con immersive installation, with purpose-specific diagnostics and flight-coordinate panels. This is promotional installation work, explicitly distinct from television production interfaces.
- [North Front concept-art interview](https://magazine.artstation.com/2016/02/scenes-concept-art-expanse/). Discusses the physical ship design process and kitbashed functional screens. The repository’s cutter is an independent low-poly vertical-deck study, not a reproduction of their model.

## Lore and game motifs

- [SYFY Season 1, Episode 5 facts](https://www.syfy.com/the-expanse/photos/fun-facts-season-1-episode-5): Holden’s coffee-machine enthusiasm comes from the books; the ship name connects to Don Quixote and Rush’s Cygnus X-1. The two local archive cards paraphrase these details.
- [SYFY concept-art gallery](https://www.syfy.com/the-expanse/season-1/blogs/the-expanse-concept-art-gallery): identifies Rocinante as formerly Tachi, a corvette-class fast-attack light frigate. The archive uses this description without inventing a hull registry number.
- [Amazon: The Expanse’s new space](https://www.aboutamazon.com/news/entertainment/the-expanses-new-space): identifies flip-and-burn as a series maneuver. The game uses an original discrete inertial rule set, not a claim to physically accurate orbital navigation.
- Tight-beam communications are a series motif (for example the term appears in the dialogue of season 5’s finale). The 16-relay pipe puzzle is explicitly original: hop authentication, rotation budgets, colors and scoring are not canonical systems. No protocol implementation or radio-frequency claim is made.

## Invented for Herdr

The five-room navigation, real-data mappings, status colors, component notes, games, hints, crew patches, galley log, sealed blue geometric specimen and original service-cutter mesh are adaptations. The specimens do not claim biological or medical behavior. No unverified Belter vocabulary is used. UNN/Belt accents are compact palette studies; they are not full historical reconstructions.

The native renderer exposes 2D paths. The inspection view computes 3D vertex transforms, perspective, face normals and depth order before drawing those paths. This accurately earns “interactive projected 3D,” not “native 3D engine.” Face count is fixed at 48; orientation is user-controlled and does not run a redraw timer.
