# Project skills

## Video director

Read `video-director/SKILL.md` directly.
The skill uses the project procedure in `workflow.md`.
It is available as a normal file for agents without automatic skill support.

## Official Remotion skills

Check `.agents/skills/`, `.claude/skills/`, and the agent's configured skill directories first.
Do not reinstall skills that are already available.

When installation is authorized, use the official procedure:

```bash
npx remotion skills add
```

Choose a writable project skill location supported by the coding agent.
If the standard agent directory is read-only, report that limitation.
Do not change its permissions.
The agent can read a separately installed project copy directly.

Official sources:

- https://github.com/remotion-dev/skills
- https://www.remotion.dev/docs/ai/skills

Record the installed skill revision or version in the setup report.
Keep installed skills between videos.
