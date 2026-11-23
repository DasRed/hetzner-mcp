---
title: Connect to Claude
description: Connect hetzner-mcp to Claude as a custom connector, in Claude Code or via JSON config in other MCP clients, then test it and fix common problems.
order: 30
slug: claude
section: Setup
---

## Requirements

- hetzner-mcp is running and reachable from the internet via HTTPS, e.g. at `https://hetzner.mcp.example.com/mcp`.
- Access is restricted (see [Security](security.md)).

> [!IMPORTANT]
> Custom connectors in Claude connect from Anthropic's servers, not from your machine. A URL that only works in your home network is not enough.

## Claude (web, desktop, mobile)

1. **Settings** → **Connectors** → **Add custom connector**.
2. Name: e.g. `Hetzner`.
3. URL: `https://hetzner.mcp.example.com/mcp`
4. Save.

Claude connectors cannot send custom headers, so no bearer token either. Restrict the endpoint at the reverse proxy instead, e.g. with an access list containing [Anthropic's outbound IP addresses](https://docs.claude.com/en/api/ip-addresses).

## Claude Code

In Claude Code you can pass the bearer token directly:

```sh
claude mcp add --transport http hetzner https://hetzner.mcp.example.com/mcp \
  --header "Authorization: Bearer your-mcp-auth-token"
```

This requires `MCP_AUTH_TOKEN` to be set on the server.

## Other MCP clients (JSON configuration)

Many MCP clients are configured with a JSON entry under `mcpServers`, e.g. the `.mcp.json` of Claude Code or clients with their own web UI. For hetzner-mcp the entry looks like this:

```json
{
  "mcpServers": {
    "hetzner": {
      "type": "http",
      "url": "https://hetzner.mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer your-mcp-auth-token"
      }
    }
  }
}
```

- Depending on the client, `type` is `http` or `streamable-http`.
- Leave out `headers` if `MCP_AUTH_TOKEN` is not set on the server.
- These clients connect from your machine, so an address in your home network is enough, e.g. `http://192.168.1.10:3000/mcp`.

Clients that only start local servers via stdio (e.g. the `claude_desktop_config.json` of Claude Desktop) connect through [mcp-remote](https://www.npmjs.com/package/mcp-remote):

```json
{
  "mcpServers": {
    "hetzner": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://hetzner.mcp.example.com/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer your-mcp-auth-token"
      }
    }
  }
}
```

The token goes into `env` because some clients do not pass spaces in `args` correctly. For an `http://` address other than `localhost`, mcp-remote also needs `--allow-http`.

## Test

Ask Claude for example:

- "Which servers are running in my Hetzner project?"
- "What do my Hetzner servers cost per month?"
- "Show me the firewall rules of web-1."

Claude should call `hetzner_list_servers`, `hetzner_get_pricing` or `hetzner_list_firewalls` for that.

## Troubleshooting

| Symptom                      | Cause                                                                       |
|------------------------------|-----------------------------------------------------------------------------|
| Connector does not connect   | Server not publicly reachable, or the reverse proxy blocks Anthropic's IPs. |
| `401 Unauthorized`           | `MCP_AUTH_TOKEN` is set but the client sends no or a wrong token.           |
| `405 Method not allowed`     | Expected for `GET`. The server is stateless and only accepts `POST`.        |
| Tools are missing            | `MCP_READ_ONLY`, `MCP_SPLITS` or the allow/deny lists filter them out.      |
| Hetzner error `unauthorized` | `HETZNER_API_TOKEN` is wrong, expired or belongs to another project.        |

After changing the tool set, disconnect and reconnect the connector in Claude once so it loads the new tool list.
