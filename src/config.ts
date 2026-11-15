export const SPLIT_NAMES = [
    'servers',
    'networking',
    'load-balancers',
    'ips',
    'storage',
    'storage-boxes',
    'config',
    'dns',
] as const;

export type SplitName = (typeof SPLIT_NAMES)[number];

export interface Config {
    authToken: string | undefined;
    host: string;
    path: string;
    port: number;
    readOnly: boolean;
    splits: SplitName[];
    toolsAllow: string[];
    toolsDeny: string[];
}

type Env = Record<string, string | undefined>;

export function parseList(value: string | undefined): string[] {
    return (value ?? '')
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
}

export function parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (value === undefined || value.trim() === '') {
        return fallback;
    }

    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) {
        return true;
    }
    if (['0', 'false', 'no', 'off'].includes(normalized)) {
        return false;
    }

    throw new Error(`Invalid boolean value "${value}"`);
}

export function parseSplits(value: string | undefined): SplitName[] {
    const entries = parseList(value);
    if (entries.length === 0 || entries.includes('all')) {
        return [...SPLIT_NAMES];
    }

    const unknown = entries.filter((entry) => !(SPLIT_NAMES as readonly string[]).includes(entry));
    if (unknown.length > 0) {
        throw new Error(`Unknown MCP_SPLITS value(s): ${unknown.join(', ')}. Allowed: all, ${SPLIT_NAMES.join(', ')}`);
    }

    return [...new Set(entries)] as SplitName[];
}

function parsePort(value: string | undefined): number {
    const port = Number(value ?? '3000');
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error(`Invalid PORT "${value}"`);
    }
    return port;
}

function parsePath(value: string | undefined): string {
    const path = (value ?? '/mcp').trim() || '/mcp';
    return path.startsWith('/') ? path : `/${path}`;
}

export function loadConfig(env: Env = process.env): Config {
    if (!env.HETZNER_API_TOKEN && !env.HETZNER_STORAGE_API_TOKEN) {
        throw new Error('HETZNER_API_TOKEN (or HETZNER_STORAGE_API_TOKEN for storage boxes only) is required');
    }

    return {
        host:       env.HOST?.trim() || '0.0.0.0',
        port:       parsePort(env.PORT),
        path:       parsePath(env.MCP_PATH),
        splits:     parseSplits(env.MCP_SPLITS),
        readOnly:   parseBoolean(env.MCP_READ_ONLY, true),
        toolsAllow: parseList(env.MCP_TOOLS_ALLOW),
        toolsDeny:  parseList(env.MCP_TOOLS_DENY),
        authToken:  env.MCP_AUTH_TOKEN?.trim() || undefined,
    };
}
