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

## Frontend architecture
- Keep canonical store information in `src/lib/business.ts`; presentation must reuse it rather than introduce competing contact or hours values.
- The scroll tour uses a native sticky stage, a scoped GSAP progress timeline and a lazy R3F photographic scene driven by `src/lib/tour-path.ts`; emit existing `dima:*` events for navigation and audio. This is an artistic photo-depth interpretation, not a measured reconstruction.
- Keep the spatial route client-rendered and WebGL behind a photo fallback/error boundary; use fixed DPR and refs for continuous camera movement to avoid SSR and per-frame React rendering.
- Define visual roles in `src/styles.css` and use the shared Button for interactive controls; keep French/Arabic copy intact and Arabic text unsplit for correct shaping.
