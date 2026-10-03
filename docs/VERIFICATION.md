# Verification and reporting / 验证与反馈

Keep these three results distinct:

1. **Config discovery:** a fresh process reads the expected cwd for the actual Project target path.
2. **Tool startup:** the selected helper initializes and all its descendants actually start in stable directories.
3. **Product workflow:** the ordinary Project composer creates/runs local Work with the original Project association.

Direct task-creation APIs, an existing Work conversation, or a directory's existence do not substitute for step 3.

## Case evidence, redacted

Observed log field pattern, with timestamp, project identifiers and local paths omitted:

```text
ChatGPT project context sync failed
stage=filesystem sourceCount=0 syncFileCount=0
fileOrdinal=null projectSaveCount=0 status=null
```

Observed failing process topology:

```text
app-server
  browser helper       cwd = <PROJECT_MIRROR>
    interpreter child  cwd = <PROJECT_MIRROR>
```

After the complete user configuration, the actual successful task used:

```text
app-server
  node_repl                  cwd = <STABLE_NODE_REPL>
  stable browser launcher    cwd = <STABLE_CUA>
    bundled browser helper   cwd = <STABLE_CUA>
      interpreter child      cwd = <STABLE_CUA>
```

A no-delete directory-access probe changed from Windows error 32 to 0 after the old helper stack exited. This probe did not rename or delete the user's Project. It does not test every possible descendant watcher or all future filesystem operations.

The separately launched tool accepted MCP initialize and returned its tool inventory. Actual browser interaction was not part of that isolated check. The user subsequently confirmed the ordinary Work entry succeeded; the new task's running helper directories were checked.

## Reproduction checklist for contributors

- OS and desktop **display version**, build and package version.
- Existing cloud ChatGPT Project; exact Chat/Work/local choice.
- Whether typing, switching mode or first submission triggers failure.
- Targeted error timestamp with timezone and sanitized stage fields.
- Actual helper executable role, cwd and directory-handle evidence, if available.
- Effective selected server and whether a complete user config overrides the plugin definition.
- Success/failure through the ordinary composer, not just a direct API.
- Consecutive creation attempts and another Project.
- Full application quit/reopen result.
- Plugin/application update result and multiple-cache-version behavior.
- Whether existing tasks, Project association, tools and project source files remain usable.

Do not assume zero sources or `status=null` rules out every network or account problem. Do not remove read-only flags on generated instructions as a blanket fix. Do not rename/delete a real mirror merely to run a diagnostic while Work is active.

## Public-release privacy

Use placeholders for usernames, project names/IDs, conversation IDs, PIDs, paths and prompts. Share only fields needed to explain the failure. Do not attach authentication files, full user configuration, machine profiles, raw stdout with environment values, or screenshots containing private project information.

## Regression status of this release

Six Project target paths passed configuration checks. One Project passed the normal UI workflow. Other Project UI flows, a full restart after the final change, long-term update persistence and other machines have **not** been verified. The optional snippet generator was not executed during recovery. No CI or automated test-suite results are claimed.
