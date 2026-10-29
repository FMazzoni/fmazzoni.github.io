---
title: Handing my agents whole features
date: 2026-10-29
category: misc
tags: agents, herdr, python, phone
excerpt: "Agents built herdr-pwa, a phone app for answering my coding agents, while I planned, reviewed and checked the work."
---

I built herdr-pwa, a phone app for answering my coding agents, because managing them only from my laptop got annoying. I was also curious whether I could vibe-code a real app. Vibe coding means describing an app and letting the AI write code you never read.

It turned into agentic engineering instead. The agents still wrote the code, but I planned, reviewed and tested it. I read the code too, though less to check that each line was right. Mostly I read it to see whether a change belonged, and whether it fit how the app was built. All of that kept out slop, the kind of code that demos well and then falls apart.

Models have improved since I built it, so some details will age. I think the habits still hold.

At my last job I built features with agents too, but in a closer loop. I was working inside a business and wanted to be sure of every change. This project was an exercise in being more hands-off. I wanted practice at getting agents to build useful features faster and more thoroughly.

## My setup

Most days I have several coding agents running at once, usually Anthropic's Claude Code, sometimes opencode or omp. Each runs in its own pane, a split of one terminal window. The panes live in [herdr](https://herdr.dev), a terminal workspace built for agents.

One wants permission to run a command. Another wants me to pick between two plans. All of them wait until I'm back at my laptop.

## A pager for the herd

So I wanted my phone to show me who is stuck and let me answer. [herdr-pwa](https://github.com/FMazzoni/herdr-pwa) does that. It's a progressive web app (PWA), a website that installs on the phone like an app.

<div class="frame phones swipe">
<span class="pane"><img src="/images/projects/herdr-feed-showcase.webp" alt="The feed: two agents need an answer, one is working, one is idle" width="400" height="866" loading="lazy"><span class="tag">(a)</span></span>
<span class="pane"><img src="/images/projects/herdr-agent-answer-menu.webp" alt="A terminal menu from an agent, drawn as numbered buttons" width="400" height="866" loading="lazy"><span class="tag">(b)</span></span>
<span class="pane"><img src="/images/posts/herdr-chat-report.webp" alt="An agent's conversation as a chat, ending in a report with a table" width="400" height="866" loading="lazy"><span class="tag">(c)</span></span>
</div>

*Fig. 1.* (a) The feed, with the agents that need me on top, in coral. One is asking "Should I force-push to main?", which would overwrite shared history. (b) That question, turned into buttons. (c) An agent's conversation, read as a chat. All three use made-up sample data.

When an agent stops, my phone buzzes with its question.

The server behind the app is Python with FastAPI, a stack I'm quite familiar with. The pages update in place with htmx, a small library I'd heard about and was curious to try.

<div class="frame diagram"><svg class="diagram" viewBox="0 0 400 488" role="img" aria-label="How herdr-pwa connects: the iPhone reaches the herdr-pwa server on my machine over Tailscale, which carries everything I read or tap. The server sends keystrokes to herdr and reads the screens back. It also reads the transcripts of agents such as Claude Code, opencode and omp, and sends only alerts through Apple's push service."><defs><marker id="d-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="d-head"/></marker><marker id="d-head-push" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="d-head-push"/></marker></defs><rect x="16" y="12" width="228" height="50" rx="6" class="d-box"/><path class="d-logo" transform="translate(28 25) scale(0.75)" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/><text x="56" y="34" class="d-title" text-anchor="start">My iPhone</text><text x="56" y="51" class="d-sub" text-anchor="start">the app, from the Home Screen</text><rect x="268" y="12" width="116" height="50" rx="6" class="d-box d-ext"/><text x="326" y="34" class="d-title" text-anchor="middle">Apple push</text><text x="326" y="51" class="d-sub" text-anchor="middle">service</text><line x1="268" y1="37" x2="247" y2="37" class="d-wire d-push" marker-end="url(#d-head-push)"/><line x1="130" y1="65" x2="130" y2="86" class="d-wire" marker-end="url(#d-head)" marker-start="url(#d-head)"/><text x="138" y="79" class="d-label" text-anchor="start">every read and tap (HTTPS)</text><rect x="16" y="89" width="228" height="50" rx="6" class="d-box"/><path class="d-logo" transform="translate(28 102) scale(0.75)" d="M24 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-9 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm0-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6-6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 24a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm18 .5a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm9-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-3 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM3 5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/><text x="56" y="111" class="d-title" text-anchor="start">Tailscale</text><text x="56" y="128" class="d-sub" text-anchor="start">tells the app who's asking</text><rect x="6" y="160" width="388" height="320" rx="10" class="d-host"/><text x="18" y="180" class="d-host-label" text-anchor="start">my machine</text><line x1="130" y1="142" x2="130" y2="192" class="d-wire" marker-end="url(#d-head)" marker-start="url(#d-head)"/><text x="138" y="172" class="d-label" text-anchor="start">the only way in</text><rect x="16" y="195" width="368" height="74" rx="6" class="d-box"/><text x="28" y="217" class="d-title" text-anchor="start">herdr-pwa</text><path class="d-logo" transform="translate(28 229) scale(0.6666666666666666)" d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/><path class="d-logo" transform="translate(50 229) scale(0.6666666666666666)" d="M12 .0387C5.3729.0384.0003 5.3931 0 11.9988c-.001 6.6066 5.372 11.9628 12 11.9625 6.628.0003 12.001-5.3559 12-11.9625-.0003-6.6057-5.3729-11.9604-12-11.96m-.829 5.4153h7.55l-7.5805 5.3284h5.1828L5.279 18.5436q2.9466-6.5444 5.892-13.0896"/><path class="d-logo" transform="translate(72 229) scale(0.6666666666666666)" d="M0 13.01v-2l7.09-2.98.58 1.94-5.1 2.05 5.16 2.05-.63 1.9Zm16.37 1.03 5.18-2-5.16-2.09.65-1.88L24 10.95v2.12L17 16zm-2.85-9.98H16l-5.47 15.88H8.05Z"/><text x="96" y="242" class="d-sub" text-anchor="start">Python · FastAPI · htmx</text><text x="28" y="260" class="d-sub" text-anchor="start">one login · audit log · checks before each tap</text><polyline points="326,195 326,148 326,65" class="d-wire d-push" marker-end="url(#d-head-push)"/><text x="334" y="140" class="d-label d-label-push" text-anchor="start">alerts</text><text x="334" y="155" class="d-label d-label-push" text-anchor="start">only</text><line x1="90" y1="269" x2="90" y2="330" class="d-wire" marker-end="url(#d-head)"/><line x1="110" y1="330" x2="110" y2="272" class="d-wire" marker-end="url(#d-head)"/><text x="120" y="290" class="d-label" text-anchor="start">local link</text><text x="120" y="305" class="d-label" text-anchor="start">sends keys,</text><text x="120" y="320" class="d-label" text-anchor="start">reads screens</text><line x1="352" y1="330" x2="352" y2="272" class="d-wire d-dash" marker-end="url(#d-head)"/><text x="344" y="290" class="d-label" text-anchor="end">transcripts</text><text x="344" y="305" class="d-label" text-anchor="end">read as chat</text><rect x="16" y="333" width="368" height="135" rx="6" class="d-box"/><text x="28" y="355" class="d-title" text-anchor="start">herdr</text><text x="76" y="355" class="d-sub" text-anchor="start">a terminal pane per agent</text><rect x="28" y="370" width="108" height="84" rx="6" class="d-box d-pane"/><path class="d-logo" transform="translate(72 382) scale(0.8333333333333334)" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/><text x="82" y="422" class="d-sub d-ink" text-anchor="middle">Claude</text><text x="82" y="438" class="d-sub d-ink" text-anchor="middle">Code</text><rect x="146" y="370" width="108" height="84" rx="6" class="d-box d-pane"/><g transform="translate(190 382) scale(0.06666666666666667)"><path class="d-logo" fill-rule="evenodd" d="M30 0H270V300H30ZM90 60V240H210V60Z"/><path class="d-logo-2" d="M90 120H210V240H90Z"/></g><text x="200" y="430" class="d-sub d-ink" text-anchor="middle">opencode</text><rect x="264" y="370" width="108" height="84" rx="6" class="d-box d-pane"/><g transform="translate(305 384) scale(0.21666666666666667)"><rect class="d-logo" x="10" y="8" width="100" height="12" rx="2"/><rect class="d-logo" x="25" y="20" width="12" height="62" rx="2"/><rect class="d-logo" x="75" y="20" width="12" height="45" rx="2"/><rect class="d-logo-2" x="71" y="55" width="20" height="16" rx="3"/></g><text x="318" y="430" class="d-sub d-ink" text-anchor="middle">omp</text></svg></div>

*Fig. 2.* How the pieces connect. Everything I read or tap on the phone reaches the app on my machine through [Tailscale](https://tailscale.com), a private network between my own devices. The app sends keystrokes straight to herdr and reads the screens back. It also reads each agent's transcript to show its conversation as a chat. Only the alerts take another route, through Apple's push service.

## Two design rules

The first is about trust. The only lock is Tailscale, so the app has no password. Instead, it refuses to start until it knows the one account it answers to. Its log records who sent a message and when, but not the words, so a password typed on the phone can't end up there.

The second is about taps. Between the phone drawing a screen and my thumb landing, the agent may have moved on, and my tap would answer the wrong question. So before every tap, the app reads the agent's screen again and refuses if it changed:

```python
now = control_token(prompt) if prompt is not None else ""
if ask.drawn_from != now:
    return Refused(Refusal.SCREEN_CHANGED, _VERB, screen=now, prompt=prompt)
```

On the phone, the refusal says "Nothing was sent: the screen changed since this was drawn. Look again."

## Agents building the app

The agents that built herdr-pwa ran in herdr, the same tool the app monitors. Some evenings I checked on the build from the app itself.

I'd built a first version over a few weeks in late summer. It worked, but it had grown messy, and newer models had come out since. So I started over and cleared out old ideas as I went. One was a library of saved screenshots. I called it "a dumb idea really".

For the rewrite, I handed the plan to a coordinator agent. Its only job is to split the plan and hand out the pieces. I asked it to check on its agents every 30 minutes. I was "ok with the server going down while I sleep", so I went to bed. My instructions closed with "When I get back ideally we'll have the finished v2." The rewrite's first day ended with 83 commits.

The new version is 675 commits in under three weeks, and I typed very few of them. It has about 3,800 automated tests, and more lines of tests than lines of app.

## How I keep it from being slop

The agents track their work on a shared board of tickets, much like a team's to-do tracker. My loop has four steps.

1. **Decide first.** Big work starts as decision tickets, settled before anyone writes code. I ask the agents for "a rigorous grill session", where they question every part of the plan to keep it small.
2. **Slice it.** Each slice gets its own agent and its own copy of the repository. The Claude Code workers run Opus, Anthropic's most capable model. A batch of slices built side by side is a wave.
3. **Send in the critics.** After each wave, reviewer agents read the merged work, each looking for one kind of problem. One found a timing bug in how the new notification code wrote its log. The worker fixed it before it merged.
4. **Check, then merge.** The tests and a rule checker I wrote run before anything merges into the main code. For the rewrite, a file records how the old app read real agent screens, and the new app must agree.

I trust a result when three things agree: the ticket is closed, the tests pass, and the thing itself works when I try it.

The agents also log their decisions. Of 62 decisions on the board, the agents made 59, each with its reason. In one wave they made 47 at once, and I read all 47 the same day, keeping or reversing each.

On a good evening, two coordinators merged about 15 tickets between them, one at a time. Their status lines looked like this:

```text
premerge EXIT=0 (2604 passed, geometry green)
merged as 6b912e6 (service restarted, doctor OK, ticket closed)
```

The first line means every test passed, including an automated check of the layout at phone widths. The second means the branch merged, the app restarted and passed its health check, and the ticket closed. Those lines were status updates between the two coordinators, telling each other that the next branch could go in.

## Things that went sideways

Some of these came from the agents, one from Safari, and a few from my own setup.

**The morning review.** The morning after the rewrite, I tried it on my phone. Parts were "pretty cool", I wrote, but "the mobile design wasn't considered at all and the experience is a little funky". So the agents' instructions now say that nothing merges until I've seen it on a phone. Agents render every change as an iPhone would, and hand me before-and-after screenshots to approve. Some calls were plain taste. I pushed back on a gear emoji because it "does evoke more ai-generated feel than I'd like".

<div class="frame phones">
<span class="pane"><img src="/images/posts/herdr-needs-you-before.webp" alt="An agent's chat with a coral 'Needs you' banner above the question" width="400" height="866" loading="lazy"><span class="tag">before</span></span>
<span class="pane"><img src="/images/posts/herdr-needs-you-after.webp" alt="The same chat with the question on top and the 'Needs you' bar moved to the bottom" width="400" height="866" loading="lazy"><span class="tag">after</span></span>
</div>

*Fig. 3.* One of those approvals. The coral "Needs you" banner moves out of the question's way, down into the bar above the reply box.

**My laptop.** Several agents running tests at once used up my laptop's memory. "Ugh, did one of the agents test under load? It's slowing down the computer for me." The agents added a memory guard, and I overrode it from my phone when things were quiet.

**Vim.** One tap from the phone opened Vim in an agent's terminal. Vim is a keyboard-driven text editor, famous for being hard to quit. My phone could neither work it nor quit it. Now the app never offers a keystroke that hands the terminal to another program.

**The silent alerts.** iPhone notifications quietly stopped arriving. Safari unsubscribes an app that sends a few notifications showing nothing, and my "clear this alert" messages showed nothing. Now every push shows something.

**Too many coordinators.** One day three coordinators typed into each other's panes and collided. Claude Code's safety check also treated instructions relayed between agents as a possible hijack, and blocked them. I sent every pane the same message, "stand down", and restarted under one coordinator.

**The missing ping.** I added a way for agents to ping my phone, and the first test never arrived. I wrote that "a practical test should have been done", then "could it be that I had alerts off". They had been off, and I'd only just turned them on. Then I wrote, "there we go, I got the ping".

Each of these became a test, a check or a line in the agents' instructions. The fixes don't always hold. In late October I had an agent comb my past corrections and the git history. It still found 10 kinds of mistake the agents kept repeating.

## What's next

I'd like the agents on an always-on machine, so they keep working when I close my laptop. When I tried remote agents, running them worked fine. Noticing when one had stalled was the hard part. Two agents sat on a dead connection for 72 minutes while their panes still said "working". Getting remote agents to work well will take more iteration. I'd also like to talk to my agents by voice instead of typing.

I may not build those into herdr-pwa. [T3 Code](https://github.com/pingdotgg/t3code) is another app for running coding agents. When I first tried it in October, it didn't seem to fit my workflow. Looking back, I probably didn't use it as fully as I could have. I've since heard a lot of good things about it, and it seems to do everything herdr-pwa does, and more. So I'll give it another fair shot, and push to make it work.

Most of what I learned was about managing agents. These days my time goes mainly into deciding what gets built. The whole project was an eye-opening way to learn, and a fun one.

The code is [on GitHub](https://github.com/FMazzoni/herdr-pwa). It's a personal, single-user tool, but if you run herdr and wonder what your agents are waiting for, it might help.
