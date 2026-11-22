---
title: Connect to Claude
description: Add hetzner-mcp as a custom connector in Claude or as a remote MCP server in Claude Code, and test it.
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
