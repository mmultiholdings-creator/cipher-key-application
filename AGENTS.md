<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- The C.I.P.H.E.R. page is a near-verbatim port of the user's standalone HTML: markup in `src/cipher/cipher-markup.html` (loaded `?raw`), behavior in `src/cipher/engine.ts` (imperative DOM script started once from the `/` route), styles in `src/cipher/cipher.css`. Why: keeps the original look and interactions exact; React must not re-render that markup.
- `src/styles.css` loads Tailwind theme + utilities without preflight. Why: a global reset would alter the original page's styling.
- Native prompt/confirm boxes are replaced by in-page dialogs in the page's own style. Why: browser boxes break the immersive look.
- Everything runs in the browser (localStorage only); no device APIs, network calls or backend. Why: it is a personal toy; nothing should touch real devices or systems.
- `/` is prerendered to static HTML (vite.config.ts). Why: identical for every visitor.
- Field instruments use browser-only imperative modules alongside the original engine; their datasets and access rules are separated for testing. Why: preserve DOM ownership and avoid real operations.
- Corporate sessions use a separate localStorage key and an in-memory private-workspace snapshot; purge tombstones prevent removed starter files being reseeded. Why: keep profile edits isolated and permanent removals persistent.
- Both corporate entry paths use a shared record loader that merges starter additions beneath validated saved files. Why: existing visitors receive new office records without losing edits or custom files.
- Camera footage uses silent project-hosted MP4 assets and a tested browser-only selection module; opening changes every feed and closing unloads videos. Why: Safari-compatible footage without external players or camera-system access.
