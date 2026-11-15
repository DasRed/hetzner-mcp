import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {loadConfig} from '../src/config.ts';
import {createMcpServer, listToolNames} from '../src/server.ts';

const env = {HETZNER_API_TOKEN: 'test-token'};

describe('mcp server', () => {
    it('exposes only read-only tools by default', () => {
        const tools = listToolNames(createMcpServer(loadConfig(env)));
        assert.ok(tools.length > 0);
        assert.ok(tools.includes('hetzner_get_pricing'));
        assert.ok(tools.includes('hetzner_list_servers'));
        assert.ok(!tools.includes('hetzner_delete_server'));
        assert.ok(!tools.includes('hetzner_create_server'));
    });

    it('exposes write tools when read-only is disabled', () => {
        const tools = listToolNames(createMcpServer(loadConfig({...env, MCP_READ_ONLY: 'false'})));
        assert.ok(tools.includes('hetzner_delete_server'));
    });

    it('limits tools to the selected splits', () => {
        const tools = listToolNames(createMcpServer(loadConfig({...env, MCP_SPLITS: 'dns'})));
        assert.ok(tools.every((name) => !name.includes('_server') || name === 'hetzner_get_action'), tools.join(','));
        assert.ok(!tools.includes('hetzner_get_pricing'));
        assert.ok(tools.some((name) => name.includes('zone')));
    });

    it('applies the allow list', () => {
        const tools = listToolNames(createMcpServer(loadConfig({...env, MCP_TOOLS_ALLOW: 'hetzner_get_pricing'})));
        assert.deepEqual(tools, ['hetzner_get_pricing']);
    });
});
