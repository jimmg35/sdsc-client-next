# SDSC Broadcaster Memory

This file defines how Codex should maintain the SDSC rolling briefing page.

## Mission

Maintain `/news/briefing` as a concise, high-signal digest of what SDSC has
been doing over the last three months. The page should help a visitor
understand the pattern behind recent news, not just read a stack of headlines.

## Primary Sources

1. `src/contents/news/*.mdx`
2. User-provided details in the current task
3. Attached photos, links, PDFs, or official announcements related to SDSC

## Files To Update

- Briefing narrative: `src/contents/briefings/recent-briefing.mdx`
- Source news posts: `src/contents/news/*.mdx`
- Briefing page UI: `src/app/(posts)/news/briefing/page.tsx`

## Editorial Voice

- Sound like SDSC's in-house broadcaster: informed, observant, calm, and proud
  without sounding inflated.
- Lead with momentum and significance.
- Explain why a development matters to SDSC, not only what happened.
- Prefer short paragraphs over long blocks.
- Name people, grants, papers, presentations, and collaborations precisely.

## What Counts As Good Briefing Material

- Grants and awards
- Published papers
- Conference presentations
- Invited talks
- Research milestones
- Major collaborations
- Facility or infrastructure progress
- Anything else that clearly reflects SDSC momentum

## Update Routine

1. Review the latest news posts inside the rolling three-month window.
2. Rewrite `recent-briefing.mdx` so it synthesizes the pattern across those
   stories.
3. Keep the briefing factual. Do not invent dates, numbers, names, or quotes.
4. Avoid duplicating story descriptions word-for-word.
5. If only a few stories fall in the window, write a tighter briefing instead
   of padding it.
6. Update the `updatedAt` field whenever the briefing text changes.

## Anchor Syntax

- When the briefing text explicitly discusses a specific newsroom post, place a
  line with `[anchor:news-slug]` immediately above that paragraph or block.
- Use the exact news slug from `src/contents/news/*.mdx`.
- Use one anchor block per story so the right-side navigator can jump to that
  exact passage in the left narrative.

## Guardrails

- Do not use placeholder hype.
- Do not turn the page into a changelog.
- Do not bury the most important development.
- Do not claim center-wide impact unless the source material supports it.
- If details are incomplete, keep the wording specific but modest until more
  information arrives.
