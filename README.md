# Socratic Bio Tutor

A question-by-question study tutor for undergraduate biology and chemistry.
Bring lecture notes, a syllabus, a practice problem, or a topic you want to
master. The tutor checks what you know, asks one question at a time, tracks
which skills you can use independently, and revisits weak spots.

[**Start tutoring**](#start-tutoring) ·
[**Open the interactive lab**](https://vajraaaang.github.io/socratic-bio-tutor/) ·
[**UCI curriculum guide**](socratic-tutor/references/uci-curriculum.md)

## Start tutoring

### Install from the GitHub link

In a regular **ChatGPT** chat, paste this message.

```text
Can you install this GitHub as a skill?
https://github.com/Vajraaaang/socratic-bio-tutor/blob/main/socratic-tutor/SKILL.md

Use Socratic Bio Tutor as the display name. Install the full socratic-tutor folder, including its references and license.
```

Choose **Install** when ChatGPT offers it, then check **Plugins → Skills**.
If you need to start from the Skills page, choose **Create → Create with chat**
and send the same message. Skills availability depends on your account and
workspace. You can also [use the tutor in any chat](#use-in-any-chat).
[ChatGPT Skills](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)

For **Codex**, you can paste the same message. For explicit installation, ask
`$skill-installer` to install the [complete GitHub skill folder](https://github.com/Vajraaaang/socratic-bio-tutor/tree/main/socratic-tutor).
[Codex skill installer](https://learn.chatgpt.com/docs/build-skills#install-curated-skills-for-local-use)

### Use the tutor

Open a new chat, attach or paste your notes, and send a study request.

> Use Socratic Bio Tutor to teach me from these BIO SCI 98 notes.
> Start with enzyme inhibition and ask me one question at a time.

You can give it a topic instead of notes, for example, “Use Socratic Bio Tutor
to teach me CHEM 51A stereochemistry.” In ChatGPT you can also select the
installed skill with `@`. In Codex you can use `$socratic-tutor`.
[Skill invocation](https://learn.chatgpt.com/docs/build-skills#how-chatgpt-and-codex-use-skills)

### Install with the ZIP

[**Download socratic-tutor.zip**](https://github.com/Vajraaaang/socratic-bio-tutor/releases/latest/download/socratic-tutor.zip)

| Where | How |
| --- | --- |
| **Claude** | Enable code execution and file creation if prompted. Open **Customize → Skills → + → Create skill → Upload a skill**, upload the ZIP, and enable it. [Claude Skills](https://support.claude.com/en/articles/12512180-use-skills-in-claude) |
| **ChatGPT Skills** | In an eligible workspace, open **Plugins → Skills → Create → Upload from your computer** and choose the ZIP. Availability depends on your workspace. [ChatGPT Skills](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) |
| **Codex** | Unzip the folder into `~/.agents/skills/` or a project's `.agents/skills/`. [Codex Skills](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) |
| **Claude Code** | Unzip the folder into `~/.claude/skills/` or a project's `.claude/skills/`. Start with `/socratic-tutor Teach me acid–base equilibria.` [Claude Code Skills](https://code.claude.com/docs/en/skills#choose-where-skills-load) |
| **Gemini CLI** | Add the unzipped folder to your workspace's `.agents/skills/` and run `/skills reload`. Then ask to use `socratic-tutor`. [Gemini CLI Skills](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md) |

### Use in any chat

Paste the [chat prompt](https://vajraaaang.github.io/socratic-bio-tutor/tutor-prompt.txt)
into ChatGPT, Claude, Gemini, or another LLM, followed by your study request.
To reuse it, add the prompt to **Project settings → Instructions** in a
ChatGPT Project or **Explore Gems → New Gem** in Gemini.
[ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) · [Gemini Gems](https://support.google.com/gemini/answer/15235603)

Use **show progress** to see your mastery map, **harder** or **easier** to
change the difficulty, and **just tell me** when you need the answer to the
current question. Use **save state** and then **resume from:** with the saved
block in a new session.

## Interactive science lab

The tutor uses a model when you can test a prediction by changing a variable,
working through stages, or comparing evidence. Each browser model includes
controls, a text readout, and its assumptions and source.

| Biology | Chemistry |
| --- | --- |
| [Enzyme kinetics](https://vajraaaang.github.io/socratic-bio-tutor/#enzyme-kinetics) | [Acid–base titration](https://vajraaaang.github.io/socratic-bio-tutor/#titration) |
| [Gene expression](https://vajraaaang.github.io/socratic-bio-tutor/#gene-expression) | [Reaction energy](https://vajraaaang.github.io/socratic-bio-tutor/#reaction-energy) |
| [Genetic linkage](https://vajraaaang.github.io/socratic-bio-tutor/#linked-genes) | [Stereochemistry](https://vajraaaang.github.io/socratic-bio-tutor/#stereochemistry) |
| [Lac operon regulation](https://vajraaaang.github.io/socratic-bio-tutor/#gene-regulation) | [Proton NMR](https://vajraaaang.github.io/socratic-bio-tutor/#proton-nmr) |
| [Osmosis and tonicity](https://vajraaaang.github.io/socratic-bio-tutor/#membrane-transport) | [Beer–Lambert absorbance](https://vajraaaang.github.io/socratic-bio-tutor/#absorbance) |
| [Action potentials](https://vajraaaang.github.io/socratic-bio-tutor/#action-potential) | [Particle in a box](https://vajraaaang.github.io/socratic-bio-tutor/#particle-in-a-box) |
| [Population growth](https://vajraaaang.github.io/socratic-bio-tutor/#population-growth) | |
| [Natural selection](https://vajraaaang.github.io/socratic-bio-tutor/#natural-selection) | |

For other topics, the tutor can work from your notes and make a small
interactive visual when the chat supports it. The
[UCI curriculum guide](socratic-tutor/references/uci-curriculum.md) covers the
introductory sequences, upper-division areas, and lab and data reasoning.
[Teaching and visual design sources](socratic-tutor/references/visual-design.md)

[MIT license](LICENSE.md)
