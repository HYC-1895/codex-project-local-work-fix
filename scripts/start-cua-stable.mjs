// Preserve the bundled browser helper, but launch it outside replaceable project mirrors.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const stable = path.dirname(fileURLToPath(import.meta.url));
process.chdir(stable);
const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
const cache = path.join(codexHome, 'plugins', 'cache', 'openai-bundled', 'unified-computer-use');
const versions = fs.readdirSync(cache, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && /^\d+(?:\.\d+)+$/.test(entry.name))
  .map(entry => entry.name)
  .sort((a, b) => {
    const av = a.split('.').map(Number), bv = b.split('.').map(Number);
    for (let i = 0; i < Math.max(av.length, bv.length); i++) {
      const delta = (bv[i] || 0) - (av[i] || 0);
      if (delta) return delta;
    }
    return 0;
  });
if (!versions.length) throw new Error('The bundled unified-computer-use plugin is unavailable.');
const manifestPath = path.join(cache, versions[0], '.mcp.json');
const server = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).mcpServers?.cua_repl;
if (!server || server.enabled === false || !path.isAbsolute(server.command)) {
  throw new Error('The bundled browser helper is unavailable or disabled.');
}
if (!fs.existsSync(server.command)) throw new Error('The bundled browser runtime is unavailable.');
if (process.argv.includes('--self-check')) {
  process.stdout.write(JSON.stringify({ manifest: manifestPath, childCommand: server.command, cwd: stable, version: versions[0] }) + '\n');
} else {
  const child = spawn(server.command, server.args || [], {
    cwd: stable,
    env: { ...process.env, ...(server.env || {}) },
    stdio: 'inherit',
    windowsHide: true,
  });
  child.on('error', error => { process.stderr.write(error.message + '\n'); process.exitCode = 1; });
  child.on('exit', code => { process.exitCode = code ?? 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => { if (!child.killed) child.kill(signal); });
  }
}
