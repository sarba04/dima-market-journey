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
- The scroll tour uses a native sticky stage and a scoped GSAP timeline; emit the existing `dima:scene`, `dima:heroProgress`, `dima:heroDone`, and `dima:heroEnter` events so navigation and scene ticks stay synchronized.
- Define visual roles in `src/styles.css` and use the shared Button for interactive controls; keep French/Arabic copy intact and Arabic text unsplit for correct shaping.
