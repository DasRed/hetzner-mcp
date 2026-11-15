import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, parseBoolean, parseSplits, SPLIT_NAMES } from '../src/config.ts';

describe('config', () => {
    it('requires a Hetzner token', () => {
        assert.throws(() => loadConfig({}), /HETZNER_API_TOKEN/);
    });

    it('uses safe defaults', () => {
        const config = loadConfig({ HETZNER_API_TOKEN: 'x' });
        assert.equal(config.host, '0.0.0.0');
        assert.equal(config.port, 3000);
        assert.equal(config.path, '/mcp');
        assert.equal(config.readOnly, true);
        assert.deepEqual(config.splits, [...SPLIT_NAMES]);
        assert.equal(config.authToken, undefined);
    });

    it('parses all settings', () => {
        const config = loadConfig({
            HETZNER_API_TOKEN: 'x',
            HOST:              '127.0.0.1',
            PORT:              '8080',
            MCP_PATH:          'hetzner',
            MCP_SPLITS:        'servers, ips',
            MCP_READ_ONLY:     'false',
            MCP_TOOLS_ALLOW:   'hetzner_list_*',
            MCP_TOOLS_DENY:    'hetzner_list_isos, hetzner_list_ssh_keys',
            MCP_AUTH_TOKEN:    'secret',
        });
        assert.deepEqual(config, {
            host:       '127.0.0.1',
            port:       8080,
            path:       '/hetzner',
            splits:     ['servers', 'ips'],
            readOnly:   false,
            toolsAllow: ['hetzner_list_*'],
            toolsDeny:  ['hetzner_list_isos', 'hetzner_list_ssh_keys'],
            authToken:  'secret',
        });
    });

    it('rejects invalid values', () => {
        assert.throws(() => parseSplits('servers,unknown'), /unknown/);
        assert.throws(() => parseBoolean('maybe', true), /Invalid boolean/);
        assert.throws(() => loadConfig({ HETZNER_API_TOKEN: 'x', PORT: '70000' }), /Invalid PORT/);
    });

    it('treats "all" as every split', () => {
        assert.deepEqual(parseSplits('all'), [...SPLIT_NAMES]);
    });
});
