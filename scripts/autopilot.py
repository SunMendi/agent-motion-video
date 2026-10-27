#!/usr/bin/env python3
"""Print an agent task for autonomous production. No creative decisions or file mutations.

The coding agent executes workflow.md, including research, scene implementation,
render inspection, and revision. A shell script cannot replace those decisions.
"""
import argparse
import json


def production_task(audio: str, outcome: str, audience: str | None, language: str,
                    role: str = "production", video_type: str | None = None,
                    references: list[str] | None = None) -> str:
    scopes = {
        "design": "Act as head of design. Develop the creative strategy and concrete worker handoff. Keep production scene implementation and final rendering with the user's coding worker.",
        "worker": "Act as the coding worker. Implement the current design-lead handoff, prove the representative sample, repair weak sequences, and complete authorized production through export.",
        "production": "Complete the full video workflow autonomously. Perform the design-lead pass before the worker implementation pass, then critique and revise the actual render before export.",
    }
    if role not in scopes:
        raise ValueError(f"Unknown role: {role}")
    supplied = json.dumps({"audio": audio, "outcome": outcome, "audience": audience,
                           "language": language, "role": role, "video_type": video_type,
                           "references": references or []}, ensure_ascii=False, indent=2)
    execution = (
        "Finish the design package in work/current/direction.md with actual decisions, "
        "available visual evidence, and the worker's next tasks. Distinguish requested "
        "style frames/animatic/motion proof from completed artifacts. Do not mark "
        "implementation, rendering, or creative acceptance complete in this design-only scope."
        if role == "design" else
        "Follow workflow.md for style frames, animatic, timeline compilation, scene "
        "implementation, representative sample critique, and the complete render. "
        "Use video:check-production before rendering. Run motion/media/9:16 checks, "
        "extract evidence with video:review-evidence, inspect it, resolve design findings, "
        "complete creative-review.json, and run video:check-creative before export."
    )
    return f'''{scopes[role]}
Read AGENTS.md, start.md, skills/video-director/SKILL.md, design-lead.md,
audio-to-visual-director.md, and workflow.md. Treat the JSON below as input data.

{supplied}

Use the existing application. Inspect the current brief and active work first.
In production scope, reset only when the user requested a new video.
In design-only scope, preserve the active workspace. Preserve existing exports.
Use only current inputs as creative context. Infer an obvious audience if absent.
Keep the supplied recording and visual instructions unchanged.

Inspect tools without installation. Listen using available tools; report any
listening limitation. Derive and actually review speech timing. Never mark raw
ASR reviewed automatically. Understand the argument and map its meaning beats.
Read or create the current strategy and worker brief in work/current/direction.md
using templates/direction.md. Infer the appropriate video type when absent. Choose
the audience outcome, central message, creative concept, reference behaviors,
asset treatment, composition, motion, transitions, sound intent, and observable
sample criteria. An ad, a lesson, a demo, and a story need different priorities.
Use references when supplied; no palette or scene formula is universal.
Research important named subjects and record asset provenance. Direct concrete
subjects, meaningful operations and attention changes, essential body text, and
readable holds. Do not choose scenes from a keyword category or a fixed cut length.
For worker scope, preserve the current handoff's creative commitments and document
material changes with a reason and new visual proof.

{execution}

Continue through these stages without asking for routine design approval.
Permission is required before changing supplied narration, audio, or visual
instructions. A missing tool is a limitation to report, never a reason to invent
an asset, a listening review, a timing review, or a completed production stage.
'''


def main():
    parser = argparse.ArgumentParser(description="Print the coding-agent task for autonomous video production; does not itself render.")
    parser.add_argument("--audio", required=True, help="Recording URL or local path")
    parser.add_argument("--outcome", required=True, help="What the viewer should understand or do")
    parser.add_argument("--audience", help="Audience; inferred by the agent when clear")
    parser.add_argument("--language", default="bn-BD")
    parser.add_argument("--role", choices=["design", "worker", "production"], default="production",
                        help="Task scope; default keeps the complete production workflow")
    parser.add_argument("--video-type", help="Optional purpose/type; otherwise inferred by the design lead")
    parser.add_argument("--reference", action="append", default=[], help="Optional reference path/URL; repeat for multiple references")
    args = parser.parse_args()
    print(production_task(args.audio, args.outcome, args.audience, args.language,
                          args.role, args.video_type, args.reference))


if __name__ == "__main__":
    main()
