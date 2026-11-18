# Install and use Socratic Bio Tutor

## ChatGPT

Send the [GitHub install prompt](../README.md#install-from-the-github-link) in a
regular chat. In an eligible workspace, you can also choose **Plugins → Skills
→ Create → Create with chat**, or use **Upload from your computer** with the
[skill ZIP](https://github.com/Vajraaaang/socratic-bio-tutor/releases/latest/download/socratic-tutor.zip).
[ChatGPT Skills](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)

## Claude and coding assistants

[Download the skill ZIP](https://github.com/Vajraaaang/socratic-bio-tutor/releases/latest/download/socratic-tutor.zip)
or use the [complete GitHub skill folder](../socratic-tutor).

| Assistant | Setup |
| --- | --- |
| **Claude** | Enable code execution and file creation if prompted. Open **Customize → Skills → + → Create skill → Upload a skill** and upload the ZIP. [Claude Skills](https://support.claude.com/en/articles/12512180-use-skills-in-claude) |
| **Codex** | Ask `$skill-installer` to install the GitHub skill folder, or unzip it into `~/.agents/skills/` or the project's `.agents/skills/`. Invoke `$socratic-tutor`. [Codex Skills](https://learn.chatgpt.com/docs/build-skills#install-curated-skills-for-local-use) |
| **Claude Code** | Unzip the folder into `~/.claude/skills/` or the project's `.claude/skills/` and invoke `/socratic-tutor`. [Claude Code Skills](https://code.claude.com/docs/en/skills#choose-where-skills-load) |
| **Gemini CLI** | Unzip it into the project's `.agents/skills/`, run `/skills reload`, and ask to use `socratic-tutor`. [Gemini CLI Skills](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md) |

## Use in any chat

Paste the [tutor prompt](https://vajraaaang.github.io/socratic-bio-tutor/tutor-prompt.txt)
and send your notes or question. For a reusable setup, add the prompt to a
ChatGPT Project's **Project settings → Instructions** or to a Gemini Gem
through **Explore Gems → New Gem**. [ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) · [Gemini Gems](https://support.google.com/gemini/answer/15235603)

## Study

Start with a question or share your course notes and ask the tutor to teach a
topic. For UCI courses, use your syllabus to set the scope for your section.
The [UCI curriculum guide](../socratic-tutor/references/uci-curriculum.md) links
to the full biology and chemistry course listings.

When the chat supports interactive rendering, the tutor decides when to build
a visual based on your question and the concept. It uses a brief explanation in
text-only chats. [ChatGPT visuals](https://learn.chatgpt.com/docs/visualizations) · [Claude visuals](https://support.claude.com/en/articles/13979539-custom-visuals-in-chat-and-cowork)

Use **show progress** to see your mastery map, **harder** or **easier** to adjust
difficulty, and **just tell me** for a direct answer. Use **save state** and
then **resume from:** with your saved block to continue in a new chat.

[Sample browser models for independent practice](https://vajraaaang.github.io/socratic-bio-tutor/) ·
[Teaching and visual design sources](../socratic-tutor/references/visual-design.md)
