"""Print a policy-preserving local TOML snippet; never edit configuration files."""
import argparse
import json
from pathlib import Path


def literal(value):
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, bool):
        return str(value).lower()
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        return '[' + ', '.join(literal(item) for item in value) + ']'
    if isinstance(value, dict):
        return '{' + ', '.join(json.dumps(key) + ' = ' + literal(item) for key, item in value.items()) + '}'
    raise TypeError('Unsupported manifest value: ' + type(value).__name__)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('codex-home', 'manifest', 'node', 'launcher'):
        parser.add_argument('--' + name, required=True, type=Path)
    args = parser.parse_args()
    for file in (args.manifest, args.node, args.launcher):
        if not file.is_absolute() or not file.is_file():
            parser.error('Expected an existing absolute file path: ' + str(file))
    if not args.codex_home.is_absolute() or not args.codex_home.is_dir():
        parser.error('--codex-home must be an existing absolute directory')
    manifest = json.loads(args.manifest.read_text(encoding='utf-8-sig'))
    server = dict(manifest['mcpServers']['cua_repl'])
    if server.get('enabled') is False:
        parser.error('The selected browser helper is disabled; do not silently enable it')
    if 'url' in server or 'http_headers' in server:
        parser.error('Expected the installed local stdio browser helper, not an HTTP definition')
    server.update(command=str(args.node), args=[str(args.launcher)], cwd=str(args.launcher.parent), env={'CODEX_HOME': str(args.codex_home)})
    print('# Contains local paths: review locally; do not commit this generated output.')
    print('[mcp_servers.cua_repl]')
    for key, value in server.items():
        print(json.dumps(key) + ' = ' + literal(value))


if __name__ == '__main__':
    main()
