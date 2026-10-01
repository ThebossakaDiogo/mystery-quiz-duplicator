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

- Keep the quiz as a single stateful page at `/` with its question sequence in the page component; the reference quiz advances without URL changes.
- Keep original quiz artwork as Lovable asset pointers under `src/assets`; the source images are externally hosted and should not be hotlinked.
- Personalized videos (P1 after name by gender/age/civil status, email after P1 ends, P2 by challenge) are H.264 MP4 asset pointers in src/assets/videos/<vturbId>.mp4.asset.json (single video + audio track, faststart). Never hotlink the original converteai CDN; never ship multi-audio-track MP4s (Chrome demuxer fails).
