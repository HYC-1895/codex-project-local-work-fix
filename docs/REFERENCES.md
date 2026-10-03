# Reports, attribution and documentation / 来源与署名

Checked: **2026-10-03**. Creation dates below are converted to **Asia/Shanghai (UTC+8)**; GitHub may display a different date in another timezone. All five listed issue states were fetched again from GitHub for this release and were **open**.

These are summaries of primary reports, not copied issue bodies. Linking a report does not mean its diagnosis has been confirmed by OpenAI staff.

| Link | Reporter | Creation date, UTC+8 | Relevance |
| --- | --- | --- | --- |
| [#34499 — Cannot create a local Work chat inside a ChatGPT Project](https://github.com/openai/codex/issues/34499) | [Paul722](https://github.com/Paul722) | 2026-07-21 | Exact desktop error; project-contained local Work fails |
| [#35127 — New local chat fails to sync project context](https://github.com/openai/codex/issues/35127) | [dbindley](https://github.com/dbindley) | 2026-07-24 | Existing chats remain usable; a generated mirror does not establish composer success |
| [#44736 — Prewarming locks mirrors; startup erases node_repl cwd](https://github.com/openai/codex/issues/44736) | [dustycupboardcompany](https://github.com/dustycupboardcompany) | 2026-09-11 | Helper working-directory diagnosis; shared node_repl configuration; reporter-confirmed workaround with durability limits |
| [#46898 — Local Work fails when project root is in use](https://github.com/openai/codex/issues/46898) | [lorisinvento-del](https://github.com/lorisinvento-del) | 2026-09-21 | Whole-root replacement and interference from helper cwd or directory watchers |
| [#48534 — Local Work workaround invalidated by app/plugin updates](https://github.com/openai/codex/issues/48534) | [Komatoz1337](https://github.com/Komatoz1337) | 2026-09-27 | Versioned browser-plugin cache loses custom cwd and the failure recurs |

## Community alternative entry point

[OpenAI Developer Community, post by 10Ten-O](https://community.openai.com/t/codex-could-not-use-this-project-for-a-local-chat-repair/1392960/5) reports that asking an existing Work task to create a new local task within the same Project can succeed when manual creation fails. This is a reported fallback, not proof that the ordinary input path is repaired. Confirm local execution and original cloud Project association separately.

[The broader community thread](https://community.openai.com/t/codex-could-not-use-this-project-for-a-local-chat-repair/1392960) includes additional reports and discussion. A filesystem-stage signature alone is not a full diagnosis.

## Official documentation

- [Projects and chats](https://learn.chatgpt.com/docs/projects): project context and Chat/Work workflows.
- [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference): ordinary MCP process cwd, command/arguments, root markers and scoped project trust.
- [Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp): plugin-owned transports versus host policy overlays.
- [Plugins](https://learn.chatgpt.com/docs/plugins): plugin-provided capabilities and supported surfaces.
- [Changelog](https://learn.chatgpt.com/docs/changelog) and [What's new](https://learn.chatgpt.com/docs/whats-new): release information inspected during the investigation.

No explicit permanent-fix announcement for this exact workflow was located in the investigated release documentation. This is a search result as of the date above, not proof that no build or channel has ever addressed it.

## Attribution boundary

The shared configuration idea and the warning about regenerating helper settings were informed by the reports above. The stable browser launcher and this repository's narrative describe the separate 2026-10-03 case. The complete user-server precedence was checked against the installed application and effective server listing; it is not presented as a new official plugin API.

Original third-party content and software keep their original rights. This repository does not copy screenshots, raw issue bodies, private logs, bundled app code or OpenAI runtime modules.
