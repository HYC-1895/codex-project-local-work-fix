# Configuration walkthrough / 配置步骤

This is a manual, reversible walkthrough of the method used in the case. It is not a universal installer. Paths below are **placeholders**: TOML does not expand `%USERPROFILE%` or `%CODEX_HOME%` inside quoted values.

以下路径必须换成自己的绝对路径。使用当前安装版本和已安装的 Node.js；不要复制别人的配置或身份文件。

## 1. Identify the actual failure

Record the desktop display version and Store package version separately. Reproduce through the normal Project composer and inspect the latest sync error. The target family has a `filesystem` failure and actual helper cwd/handle evidence. A missing mirror or a generic toast alone is insufficient.

Check whether `node_repl` or the bundled browser stack starts under:

```text
<CODEX_HOME>\.chatgpt-projects\<project-id>
```

Inspect the actual `CODEX_HOME`, not an old computer's path. Back up the user `config.toml`, existing shared config if any, and current plugin `.mcp.json` locally. These backups can contain private data; keep them out of this public repository.

## 2. Choose stable directories

Use a user-owned directory outside **every replaceable project mirror**, for example:

```text
<YOUR_STABLE_ROOT>\node_repl
<YOUR_STABLE_ROOT>\cua_repl
```

Copy [scripts/start-cua-stable.mjs](../scripts/start-cua-stable.mjs) into the `cua_repl` directory. Keep it there after configuration: this is its runtime location, not a temporary download.

The launcher changes its own cwd to its file directory and starts the original bundled child there. It reads the generated manifest's executable, arguments and environment at each launch. It does not install Node, alter the manifest, synchronize a Project, or call a model.

`--self-check` prints the selected manifest, child executable and cwd without starting the helper:

```powershell
& 'C:\path\to\your\node.exe' 'C:\stable\cua_repl\start-cua-stable.mjs' --self-check
```

Check which plugin is actually active before proceeding. The current launcher selects the newest numeric cached directory. If multiple versions are present or the app has been downgraded, do not assume newest equals active; review or adapt the selection first.

## 3. Discover and trust the shared config layer

Create a marker file named `.chatgpt-projects-root` in:

```text
<CODEX_HOME>\.chatgpt-projects
```

Merge these settings into the user `config.toml`. `project_root_markers` is a **top-level setting**, before any TOML table header. Preserve every existing marker, including `.git`. Reuse an existing matching trust table rather than defining it twice.

```toml
project_root_markers = [".git", ".chatgpt-projects-root"]

[projects.'C:\YOUR\ACTUAL\CODEX_HOME\.chatgpt-projects']
trust_level = "trusted"
```

This trust entry permits shared project configuration to load. Limit it to the mirror parent and use it only for a group of Project configurations you accept. Do not extend it to the entire home directory or drive.

Create or merge:

```text
<CODEX_HOME>\.chatgpt-projects\.codex\config.toml
```

Start with:

```toml
[mcp_servers.node_repl]
cwd = 'C:\YOUR\STABLE_ROOT\node_repl'
```

The application supplies the rest of the generated `node_repl` definition in the investigated version. Confirm that a fresh effective config read still has a valid command and your cwd.

## 4. Complete browser server override

Plugin policy tables such as `plugins.<plugin>.mcp_servers.<server>` do not provide general transport overrides. A bare `[mcp_servers.cua_repl]` with only `cwd` can instead become an invalid ordinary server definition. Use a **complete** ordinary server entry, and verify name resolution on your installed version.

Inspect the current active manifest:

```text
<CODEX_HOME>\plugins\cache\openai-bundled\unified-computer-use\<active-version>\.mcp.json
```

Take the current `mcpServers.cua_repl` definition. Preserve its enablement, tool policy, tool exposure/omission fields, timeouts and forwarded environment-variable names. Replace only the transport as follows:

```toml
[mcp_servers.cua_repl]
command = 'C:\path\to\your\node.exe'
args = ['C:\YOUR\STABLE_ROOT\cua_repl\start-cua-stable.mjs']
cwd = 'C:\YOUR\STABLE_ROOT\cua_repl'
env = { CODEX_HOME = 'C:\YOUR\ACTUAL\CODEX_HOME' }
# Also preserve the current manifest's remaining policy and env_vars fields.
```

This is a structural example, **not a complete policy-preserving block to paste unchanged**. Do not pin the generated runtime environment from a previous launch; the launcher obtains it from the manifest at runtime.

[scripts/make-cua-snippet.py](../scripts/make-cua-snippet.py) can generate a complete block from an explicitly selected manifest. It only prints a local snippet; it does not edit settings or stop processes. Python 3 is required for that optional generator. Use your chosen Python interpreter's absolute path.

```powershell
& 'C:\path\to\python.exe' '.\scripts\make-cua-snippet.py' `
  --codex-home 'C:\YOUR\ACTUAL\CODEX_HOME' `
  --manifest 'C:\YOUR\ACTUAL\CODEX_HOME\plugins\cache\openai-bundled\unified-computer-use\ACTIVE_VERSION\.mcp.json' `
  --node 'C:\path\to\your\node.exe' `
  --launcher 'C:\YOUR\STABLE_ROOT\cua_repl\start-cua-stable.mjs'
```

Review the result against the installed manifest and merge into the shared file. Generated snippets contain your local paths; never commit them. The optional generator has not been executed in the recovered desktop case; the manually merged configuration and launcher were verified there.

## 5. Verify server selection and normal UI

Use the actual installed Codex executable from the mirror cwd, for example `codex mcp list --json`, and inspect both `node_repl` and `cua_repl` effective cwd. Do not publish the full output: server definitions can contain private values.

In the recovered case, the complete user `cua_repl` entry took precedence even though plugin manifest `cwd` was still absent. If your version resolves a different server, stop and inspect that behavior; do not add duplicate names and assume success.

Existing processes keep their old cwd. Save work and fully quit/reopen the desktop, or let an idle prewarm stack exit. Do not terminate unrelated processes or an active task. Verify the new helpers' actual cwd and then test the **normal** composer; see [VERIFICATION.md](VERIFICATION.md).

## 6. Reversal

Keep a list of the exact keys and files changed. To undo, with tasks saved and relevant helpers stopped:

1. Remove or restore the added complete `cua_repl` block and added `node_repl.cwd` override, preserving existing unrelated tables.
2. Restore the prior root-marker list and trust entry only if this change introduced them. Retain settings used by other projects.
3. Remove the new marker or shared file only if it did not exist before and has not acquired other settings.
4. Remove the launcher only after no config references it; retain any user files in the stable directories.
5. Restart and inspect effective settings again.

If files changed after the backup, merge the reversal. Do not replace the entire modern configuration with a stale backup. The case-specific rollback script and its private backups are intentionally not published.

## 中文操作摘要

先确认是本地同步阶段与目录占用；备份；把两个工具移到项目副本外；用父目录共享配置保留解释器设置；浏览器采用完整用户配置与固定目录启动器，保持原工具策略和动态环境；核对实际服务器和进程目录；最后从正常输入框验证，并重复测试重启与更新。遇到不同版本、多个插件缓存或配置冲突，需要先重新检查，不要清空项目或聊天数据库。
