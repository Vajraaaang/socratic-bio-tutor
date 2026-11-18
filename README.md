# Socratic Bio Tutor

A question-by-question study tutor for undergraduate biology and chemistry.
Bring lecture notes, a syllabus, a practice problem, or a topic you want to
master. The tutor checks what you know, asks one question at a time, tracks
which skills you can use independently, and revisits weak spots.

[**Start tutoring**](#start-tutoring) ·
[**Open the interactive lab**](https://vajraaaang.github.io/socratic-bio-tutor/) ·
[**UCI curriculum guide**](socratic-tutor/references/uci-curriculum.md)

## Start tutoring

**Any chat.** Open the [chat prompt](https://vajraaaang.github.io/socratic-bio-tutor/tutor-prompt.txt).
Paste its contents into a new ChatGPT, Claude, Gemini, or other LLM chat,
followed by your study request. Paste your notes or attach them if your chat
supports file uploads.

> Teach me from these BIO SCI 98 notes. Focus on how to tell competitive and
> pure noncompetitive inhibition apart.

> Tutor me on CHEM 51A stereochemistry. I can assign priorities and get turned
> around when the lowest-priority group points toward me.

For a reusable setup, put the chat prompt in **Project settings → Instructions**
in a ChatGPT Project or **Explore Gems → New Gem** in Gemini. Then send your
study request inside the project or Gem. [ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) · [Gemini Gems](https://support.google.com/gemini/answer/15235603)

### Install as a skill

[**Download socratic-tutor.zip**](https://github.com/Vajraaaang/socratic-bio-tutor/releases/latest/download/socratic-tutor.zip)

| Where | How |
| --- | --- |
| **Claude** | Enable code execution and file creation if prompted. Open **Customize → Skills → + → Create skill → Upload a skill**, upload the ZIP, and enable it. [Claude Skills](https://support.claude.com/en/articles/12512180-use-skills-in-claude) |
| **ChatGPT Skills** | In an eligible workspace, open **Plugins → Skills → Create → Upload from your computer** and choose the ZIP. Availability depends on your workspace. The chat prompt above also works for ordinary chats. [ChatGPT Skills](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) |
| **Codex** | Unzip the folder into `~/.agents/skills/` or a project's `.agents/skills/`. Start with `$socratic-tutor Teach me BIO SCI 97 linkage.` [Codex Skills](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) |
| **Claude Code** | Unzip the folder into `~/.claude/skills/` or a project's `.claude/skills/`. Start with `/socratic-tutor Teach me acid–base equilibria.` [Claude Code Skills](https://code.claude.com/docs/en/skills#choose-where-skills-load) |
| **Gemini CLI** | Add the unzipped folder to your workspace's `.agents/skills/` and run `/skills reload`. Then ask to use `socratic-tutor`. [Gemini CLI Skills](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md) |

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
