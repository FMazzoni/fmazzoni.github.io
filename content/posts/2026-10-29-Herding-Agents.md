---
title: Vibe coding, with receipts
date: 2026-10-29
category: misc
tags: agents, herdr, python, phone
excerpt: "What I learned letting a team of AI agents build a real app, and the habits that kept it from turning into slop."
---

One night in October I handed a rewrite of my phone app to an AI agent and went to bed. My instructions ended: "When I get back ideally we'll have the finished v2." By the end of that day, the new repository had 83 commits.

Andrej Karpathy [named this "vibe coding"](https://x.com/karpathy/status/1886192184808149383): you let the model write code you never read. Done that way, you get slop: code that demos well and falls apart. Simon Willison calls the careful version ["vibe engineering"](https://simonwillison.net/2025/Oct/7/vibe-engineering/). This post is my attempt at the second.

## Agents that wait for me

Most days I have several coding agents running at once, mostly Claude Code, Anthropic's coding agent. Each lives in its own pane, a split of one terminal window, in [herdr](https://herdr.dev), a terminal workspace built for agents.

They work well on their own until they need me. One wants permission to run a command. Another wants to know which of two plans I prefer.

All of them wait until I'm back at my desk.

## A pager for the herd

So I wanted my phone to show me who is stuck and let me answer. That's [herdr-pwa](https://github.com/FMazzoni/herdr-pwa), a progressive web app (PWA): a website that installs like an app.

<div class="frame phones swipe">
<span class="pane"><img src="/images/projects/herdr-feed-showcase.webp" alt="The feed: two agents need an answer, one is working, one is idle" width="400" height="866" loading="lazy"><span class="tag">(a)</span></span>
<span class="pane"><img src="/images/projects/herdr-agent-answer-menu.webp" alt="A terminal menu from an agent, drawn as numbered buttons" width="400" height="866" loading="lazy"><span class="tag">(b)</span></span>
<span class="pane"><img src="/images/posts/herdr-chat-report.webp" alt="An agent's conversation as a chat, ending in a report with a table" width="400" height="866" loading="lazy"><span class="tag">(c)</span></span>
</div>

*Fig. 1.* (a) The feed, with the agents that need me on top, in coral. (b) An agent's terminal question, turned into buttons. (c) An agent's conversation, read as a chat. All three use made-up sample data.

When an agent stops, my phone buzzes with its question.

Two rules shaped most of the design. The first is about trust: the app has no password, because [Tailscale](https://tailscale.com), a private network between my own devices, is the only lock. So the app refuses to start until it knows the one account it answers to. Its log records who sent a message and when, never the words, so a password typed on the phone can't end up there.

The second rule: a tap is a keystroke with no undo. Between the phone drawing a screen and my thumb landing, the agent may have moved on. So before every tap, the app reads the agent's screen again and refuses if it changed:

```python
now = control_token(prompt) if prompt is not None else ""
if ask.drawn_from != now:
    return Refused(Refusal.SCREEN_CHANGED, _VERB, screen=now, prompt=prompt)
```

On the phone, that refusal reads: "Nothing was sent: the screen changed since this was drawn. Look again."

## Built by the herd it watches

The agents that built herdr-pwa were running in herdr panes. They built the app that watches agents in herdr panes, and some evenings I watched them from that same app.

I'd built a first version over a few weeks in late summer. It worked, but it had grown messy, and as I told an agent at the time, the agents were "generally smarter" by October. So I started over.

For the rewrite, I handed the plan to a coordinator agent. Its only job is to split the plan and hand out the pieces. I asked it to check on its agents every 30 minutes.

The new version is 675 commits in under three weeks, and I typed very few of them. It has about 3,800 automated tests, and more lines of tests than lines of app.

## How I keep it from being slop

The agents write the code. My job is to decide, to review and to check.

The agents keep their work on a shared board of tickets, to-do cards they read and write the way a team uses a tracker. My loop has four steps.

1. **Decide first.** Big work starts as decision tickets, settled before anyone writes code. I ask the agents for "a rigorous grill session": they question every part of the plan, to keep it small.
2. **Slice it.** Each slice gets its own agent and its own copy of the repository. The agents run Opus, Claude's most capable model. A batch of slices built side by side is a wave.
3. **Send in the critics.** After each wave, reviewer agents read the merged work, each looking for one kind of problem. One found a timing bug in how the new notification code wrote its log. The worker fixed it before it merged.
4. **Check, then merge.** The tests and a rule checker I wrote run before anything merges. For the rewrite, a file records the old app's decision on every captured screen, and the new app must agree.

I trust a result when three things agree: the ticket is closed, the tests pass, and the thing itself works when I try it.

The agents also keep receipts. Of 62 decisions on the board, the agents made 59, each logged with its reason. In one wave they made 47 at once, and I read all 47 the same day, keeping or reversing each.

On a good evening, two coordinators merged about 15 tickets between them, one at a time. They passed notes like these:

```text
premerge EXIT=0 (2604 passed, geometry green)
merged as 6b912e6 (service restarted, doctor OK, ticket closed)
```

In plain terms: every test passed, including a robot that checks the layout at phone widths. Then the branch merged, the app restarted and passed its health check, and the ticket closed. Nobody typed those to me. One agent was telling another that the next branch could go in.

## Things that went sideways

Some of these were the agents. Some were Safari. One was me.

**The morning review.** The morning after the rewrite, I tried it on my phone. Parts were "pretty cool", I wrote, but "the mobile design wasn't considered at all and the experience is a little funky". That became a standing rule: nothing merges on a picture nobody has seen. Agents now render every change as an iPhone would, and hand me before-and-after screenshots to approve.

<div class="frame phones">
<span class="pane"><img src="/images/posts/herdr-needs-you-before.webp" alt="An agent's chat with a coral 'Needs you' banner above the question" width="400" height="866" loading="lazy"><span class="tag">before</span></span>
<span class="pane"><img src="/images/posts/herdr-needs-you-after.webp" alt="The same chat with the question on top and the 'Needs you' bar moved to the bottom" width="400" height="866" loading="lazy"><span class="tag">after</span></span>
</div>

*Fig. 2.* One of those approvals. The coral "Needs you" banner moves out of the question's way, down into the bar above the reply box.

**Vim.** One tap from the phone opened Vim in an agent's terminal. Vim is a text editor driven entirely by keyboard shortcuts, famous for being hard to quit, and the phone couldn't drive it. Now the app never offers a keystroke that hands the terminal to another program.

**The silent alerts.** iPhone notifications quietly stopped arriving. Safari unsubscribes an app that sends a few notifications showing nothing, and my "clear this alert" messages showed nothing. Now every push shows something.

**Three cooks.** One day three coordinators typed into each other's panes and collided. One even refused orders passed along by another agent, in case they were a trick. I sent every pane the same message, "stand down", and restarted under one coordinator.

**The missing ping.** I added a way for agents to ping my phone, and the first test never arrived. I wrote that "a practical test should have been done", then "could it be that I had alerts off". Then: "there we go, I got the ping".

Each of these became a test, a check or a line in the agents' instructions. It doesn't always stick. In late October I had an agent comb my past corrections and the git history. It still found 10 kinds of mistake the agents kept repeating.

## What's next

I'd like the herd on an always-on machine, so it keeps working when I close my laptop. When I tried remote agents, the computing worked and the watching failed. Two agents sat on a dead connection for 72 minutes while their panes still said "working". So the next thing worth building is a stall detector, and after that, a way to answer a stuck agent by voice.

I may not build those into herdr-pwa. When I tried [T3 Code](https://github.com/pingdotgg/t3code) in October, it fit my loop worse than herdr did. It's moving fast, though, and if it catches up, I'll switch.

I set out to build a phone app and came out a better manager of agents. These days I spend less time writing code and more time deciding what gets built. It was an eye-opening way to learn, and a fun one.

The code is [on GitHub](https://github.com/FMazzoni/herdr-pwa). It's a personal, single-user tool, but if you run herdr and wonder what your agents are waiting for, it might help.
