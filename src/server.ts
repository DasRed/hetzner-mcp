import {registerReferenceResource} from '@lazyants/hetzner-mcp-server/dist/resources/hetzner-reference.js';
import {SPLITS} from '@lazyants/hetzner-mcp-server/dist/splits.js';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {createRequire} from 'node:module';
import type {Config} from './config.ts';
import {isToolEnabled} from './filter.ts';

const require = createRequire(import.meta.url);
const pkg     = require('../package.json') as { name: string; version: string };

interface RegisteredToolLike {
    annotations?: { readOnlyHint?: boolean };

    remove(): void;
}

function registeredTools(server: McpServer): Record<string, RegisteredToolLike> {
    // The SDK keeps registered tools in a private map; it is the only way to inspect annotations after registration.
    return (server as unknown as { _registeredTools: Record<string, RegisteredToolLike> })._registeredTools;
}

export function createMcpServer(config: Config): McpServer {
    const server = new McpServer({name: 'hetzner-mcp', version: pkg.version});

    const registrars = new Set(config.splits.flatMap((split) => SPLITS[split]?.registrars ?? []));
    for (const register of registrars) {
        register(server);
    }
    registerReferenceResource(server);

    for (const [name, tool] of Object.entries(registeredTools(server))) {
        const enabled = isToolEnabled(
            {name, readOnly: tool.annotations?.readOnlyHint === true},
            {readOnly: config.readOnly, allow: config.toolsAllow, deny: config.toolsDeny},
        );
        if (!enabled) {
            tool.remove();
        }
    }

    return server;
}

export function listToolNames(server: McpServer): string[] {
    return Object.keys(registeredTools(server)).sort();
}

export const packageInfo = pkg;
