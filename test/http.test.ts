import assert from 'node:assert/strict';
import type {Server} from 'node:http';
import type {AddressInfo} from 'node:net';
import {after, before, describe, it} from 'node:test';
import {loadConfig} from '../src/config.ts';
import {createHttpServer, isAuthorized} from '../src/http.ts';

const headers = {'Content-Type': 'application/json', Accept: 'application/json, text/event-stream'};

describe('http transport', () => {
    let server: Server;
    let baseUrl: string;

    before(async () => {
        server = createHttpServer(loadConfig({HETZNER_API_TOKEN: 'test-token', MCP_AUTH_TOKEN: 'secret'}));
        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    after(() => {
        server.close();
    });

    it('answers the health check without auth', async () => {
        const response = await fetch(`${baseUrl}/healthz`);
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), {status: 'ok'});
    });

    it('rejects requests without a valid bearer token', async () => {
        const response = await fetch(`${baseUrl}/mcp`, {method: 'POST', headers, body: '{}'});
        assert.equal(response.status, 401);
    });

    it('handles initialize and tools/list', async () => {
        const auth = {...headers, Authorization: 'Bearer secret'};
        const init = await fetch(`${baseUrl}/mcp`, {
            method:  'POST',
            headers: auth,
            body:    JSON.stringify({
                jsonrpc: '2.0',
                id:      1,
                method:  'initialize',
                params:  {protocolVersion: '2025-06-18', capabilities: {}, clientInfo: {name: 'test', version: '1.0.0'}},
            }),
        });
        assert.equal(init.status, 200);
        const initBody = await init.json() as { result: { serverInfo: { name: string } } };
        assert.equal(initBody.result.serverInfo.name, 'hetzner-mcp');

        const list = await fetch(`${baseUrl}/mcp`, {
            method:  'POST',
            headers: auth,
            body:    JSON.stringify({jsonrpc: '2.0', id: 2, method: 'tools/list', params: {}}),
        });
        assert.equal(list.status, 200);
        const listBody = await list.json() as { result: { tools: { name: string }[] } };
        const names    = listBody.result.tools.map((tool) => tool.name);
        assert.ok(names.includes('hetzner_get_pricing'));
        assert.ok(!names.includes('hetzner_delete_server'));
    });

    it('rejects GET in stateless mode', async () => {
        const response = await fetch(`${baseUrl}/mcp`, {headers: {Authorization: 'Bearer secret'}});
        assert.equal(response.status, 405);
    });

    it('compares tokens safely', () => {
        assert.equal(isAuthorized(undefined, undefined), true);
        assert.equal(isAuthorized('Bearer secret', 'secret'), true);
        assert.equal(isAuthorized('Bearer wrong!', 'secret'), false);
        assert.equal(isAuthorized(undefined, 'secret'), false);
    });
});
