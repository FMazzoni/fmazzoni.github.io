---
title: From vibe coding to agentic engineering
date: 2026-10-29
category: misc
tags: agents, herdr, python, phone
excerpt: "I set out to vibe-code a phone app for my coding agents. It turned into agentic engineering, and these are the habits that kept it from becoming slop."
---

I built herdr-pwa, a phone app for answering my coding agents, because managing them only from my laptop got annoying. I was also curious how hard it would be to vibe-code a real app: describe it, and let the AI write code I never read.

It turned into agentic engineering instead. The agents still wrote the code, but I planned, reviewed and tested it to keep out slop: code that demos well and falls apart. Models have improved since, so some details will age. I think the habits still hold.

## My setup

Most days I have several coding agents running at once, mostly Claude Code, Anthropic's coding agent. Each runs in its own pane, a split of one terminal window, in [herdr](https://herdr.dev), a terminal workspace built for agents.

One wants permission to run a command. Another wants me to pick between two plans. All of them wait until I'm back at my laptop.

## A pager for the herd

So I wanted my phone to show me who is stuck and let me answer. That's [herdr-pwa](https://github.com/FMazzoni/herdr-pwa), a progressive web app (PWA): a website that installs like an app.

<div class="frame phones swipe">
<span class="pane"><img src="/images/projects/herdr-feed-showcase.webp" alt="The feed: two agents need an answer, one is working, one is idle" width="400" height="866" loading="lazy"><span class="tag">(a)</span></span>
<span class="pane"><img src="/images/projects/herdr-agent-answer-menu.webp" alt="A terminal menu from an agent, drawn as numbered buttons" width="400" height="866" loading="lazy"><span class="tag">(b)</span></span>
<span class="pane"><img src="/images/posts/herdr-chat-report.webp" alt="An agent's conversation as a chat, ending in a report with a table" width="400" height="866" loading="lazy"><span class="tag">(c)</span></span>
</div>

*Fig. 1.* (a) The feed, with the agents that need me on top, in coral. One is asking "Should I force-push to main?", which would overwrite shared history. (b) That question, turned into buttons. (c) An agent's conversation, read as a chat. All three use made-up sample data.

When an agent stops, my phone buzzes with its question.

Two rules shaped most of the design. The first is about trust: the app has no password, because [Tailscale](https://tailscale.com), a private network between my own devices, is the only lock. So the app refuses to start until it knows the one account it answers to. Its log records who sent a message and when, never the words, so a password typed on the phone can't end up there.

The second rule: a tap is a keystroke with no undo. Between the phone drawing a screen and my thumb landing, the agent may have moved on. So before every tap, the app reads the agent's screen again and refuses if it changed:

```python
now = control_token(prompt) if prompt is not None else ""
if ask.drawn_from != now:
    return Refused(Refusal.SCREEN_CHANGED, _VERB, screen=now, prompt=prompt)
```

On the phone, that refusal reads: "Nothing was sent: the screen changed since this was drawn. Look again."

Some calls were plain taste. I pushed back on a gear emoji because it "does evoke more ai-generated feel than I'd like".

## Agents building the app

The agents that built herdr-pwa ran in herdr, the same tool the app monitors. Some evenings I checked on the build from the app itself.

I'd built a first version over a few weeks in late summer. It worked, but it had grown messy, and newer models had come out since. So I started over, and cleared out old ideas as I went: a library of saved screenshots "was a dumb idea really".

For the rewrite, I handed the plan to a coordinator agent. Its only job is to split the plan and hand out the pieces. I asked it to check on its agents every 30 minutes. I was "ok with the server going down while I sleep", so I went to bed. My instructions ended: "When I get back ideally we'll have the finished v2." The rewrite's first day ended with 83 commits.

The new version is 675 commits in under three weeks, and I typed very few of them. It has about 3,800 automated tests, and more lines of tests than lines of app.

## How I keep it from being slop

The agents keep their work on a shared board of tickets, to-do cards they read and write the way a team uses a tracker. My loop has four steps.

1. **Decide first.** Big work starts as decision tickets, settled before anyone writes code. I ask the agents for "a rigorous grill session": they question every part of the plan, to keep it small.
2. **Slice it.** Each slice gets its own agent and its own copy of the repository. The agents run Opus, Claude's most capable model. A batch of slices built side by side is a wave.
3. **Send in the critics.** After each wave, reviewer agents read the merged work, each looking for one kind of problem. One found a timing bug in how the new notification code wrote its log. The worker fixed it before it merged.
4. **Check, then merge.** The tests and a rule checker I wrote run before anything merges. For the rewrite, a file records the old app's decision on every captured screen, and the new app must agree.

I trust a result when three things agree: the ticket is closed, the tests pass, and the thing itself works when I try it.

The agents also log their decisions. Of 62 decisions on the board, the agents made 59, each with its reason. In one wave they made 47 at once, and I read all 47 the same day, keeping or reversing each.

On a good evening, two coordinators merged about 15 tickets between them, one at a time. Their status lines looked like this:

```text
premerge EXIT=0 (2604 passed, geometry green)
merged as 6b912e6 (service restarted, doctor OK, ticket closed)
```

In plain terms: every test passed, including an automated check of the layout at phone widths. Then the branch merged, the app restarted and passed its health check, and the ticket closed. Those lines were status updates between the two coordinators, telling each other that the next branch could go in.

## Things that went sideways

Some of these came from the agents, one from Safari, and a few from my own setup.

**The morning review.** The morning after the rewrite, I tried it on my phone. Parts were "pretty cool", I wrote, but "the mobile design wasn't considered at all and the experience is a little funky". So the agents' instructions now say that nothing merges until I've seen it on a phone. Agents render every change as an iPhone would, and hand me before-and-after screenshots to approve.

<div class="frame phones">
<span class="pane"><img src="/images/posts/herdr-needs-you-before.webp" alt="An agent's chat with a coral 'Needs you' banner above the question" width="400" height="866" loading="lazy"><span class="tag">before</span></span>
<span class="pane"><img src="/images/posts/herdr-needs-you-after.webp" alt="The same chat with the question on top and the 'Needs you' bar moved to the bottom" width="400" height="866" loading="lazy"><span class="tag">after</span></span>
</div>

*Fig. 2.* One of those approvals. The coral "Needs you" banner moves out of the question's way, down into the bar above the reply box.

**My laptop.** Running several agents' tests at once ran my laptop out of memory. "Ugh, did one of the agents test under load? It's slowing down the computer for me." The agents added a memory guard, and I overrode it from my phone when things were quiet.

**Vim.** One tap from the phone opened Vim in an agent's terminal. Vim is a text editor driven entirely by keyboard shortcuts, famous for being hard to quit, and the phone couldn't drive it. Now the app never offers a keystroke that hands the terminal to another program.

**The silent alerts.** iPhone notifications quietly stopped arriving. Safari unsubscribes an app that sends a few notifications showing nothing, and my "clear this alert" messages showed nothing. Now every push shows something.

**Too many coordinators.** One day three coordinators typed into each other's panes and collided. Claude Code's safety check also blocked instructions relayed from one agent to another, as a possible hijack. I sent every pane the same message, "stand down", and restarted under one coordinator.

**The missing ping.** I added a way for agents to ping my phone, and the first test never arrived. I wrote that "a practical test should have been done", then "could it be that I had alerts off". Then: "there we go, I got the ping".

Each of these became a test, a check or a line in the agents' instructions. The fixes don't always hold. In late October I had an agent comb my past corrections and the git history. It still found 10 kinds of mistake the agents kept repeating.

## What's next

I'd like the agents on an always-on machine, so they keep working when I close my laptop. When I tried remote agents, running them worked fine. Noticing when one had stalled was the hard part. Two agents sat on a dead connection for 72 minutes while their panes still said "working". So the next thing worth building is a stall detector, and after that, a way to answer a stuck agent by voice.

I may not build those into herdr-pwa. When I tried [T3 Code](https://github.com/pingdotgg/t3code) in October, it fit my loop worse than herdr did. It's moving fast, though, and if it catches up, I'll switch.

Most of what I learned was about managing agents. These days I spend less time writing code and more time deciding what gets built. It was an eye-opening way to learn, and a fun one.

The code is [on GitHub](https://github.com/FMazzoni/herdr-pwa). It's a personal, single-user tool, but if you run herdr and wonder what your agents are waiting for, it might help.
