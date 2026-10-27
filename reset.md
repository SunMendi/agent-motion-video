# Start another video in the same project

## Purpose

Keep the project setup. Clear only the previous video's active files.
Keep its final MP4 and report in `exports/`.

Do not run this procedure during an ordinary revision.
Run it only when the user requests a new video.

## Procedure

1. Finish the current video report.
2. Run `npm run video:export` when the video is complete.
3. Run the reset preview below.

```bash
npm run video:reset
```

The preview lists the exact managed files that will be removed or restored.
It does not delete files.

4. Check the listed paths.
5. Apply the reset after the user requests the next video.

```bash
npm run video:reset -- --apply
```

The command keeps the final export and report.
It refuses reset when an identified video has no completed export pair.
It refuses symbolic links inside the reset boundary.

If the user explicitly discards an unfinished video, use:

```bash
npm run video:reset -- --apply --discard-unfinished
```

The discard option is not permission to remove unrelated files.

6. Fill in the restored `brief.json`.
7. Add optional supplied scripts under `input/` and set their brief paths. Leave absent script paths `null`; do not require the user to write a visual script.
8. Add the new recording under `public/current/`.
9. Start a new agent conversation.
10. Give the agent the prompt in `start.md`.

## Files that reset can change

```text
brief.json
input/**
public/current/**
src/video/**
work/current/**
```

The reset command restores these paths from checked-in templates.
It does not use a wildcard deletion outside these roots.

## Files that reset must keep

- `exports/` and all completed final reports.
- `setup.md`, `start.md`, `design-lead.md`, `workflow.md`, `reset.md`, and `AGENTS.md`.
- Package files, installed packages, and environment records.
- `skills/`, `templates/`, and reusable scripts.
- `src/shared/`, including layout, stage, caption, and audio helpers, and `public/fonts/`.
- Python environments and speech model caches.
- Existing Rust and DevSolutions files outside the reset boundary.

File cleanup does not clear an agent's conversation history.
Use a new conversation to prevent previous-video context from influencing the new design.
