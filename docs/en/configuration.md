---
title: Configuration
description: All environment variables of hetzner-mcp with their defaults, plus how to get an API token for the Hetzner Cloud and limit the available tools with filters.
order: 20
slug: configuration
section: Setup
---

## Environment variables

hetzner-mcp is configured entirely through environment variables. A template is in [`.env.example`](https://github.com/DasRed/hetzner-mcp/blob/main/.env.example).

| Name                        | Default   | Description                                                                                                                       |
|-----------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------|
| `HETZNER_API_TOKEN`         | –         | API token of a Hetzner Cloud project. Required unless only `HETZNER_STORAGE_API_TOKEN` is set.                                    |
| `HETZNER_STORAGE_API_TOKEN` | –         | Separate token for Storage Boxes. Falls back to `HETZNER_API_TOKEN`.                                                              |
| `HOST`                      | `0.0.0.0` | Listen address.                                                                                                                   |
| `PORT`                      | `3000`    | Listen port.                                                                                                                      |
| `MCP_PATH`                  | `/mcp`    | Path of the MCP endpoint.                                                                                                         |
| `MCP_SPLITS`                | `all`     | `all` or a comma separated list of `servers`, `networking`, `load-balancers`, `ips`, `storage`, `storage-boxes`, `config`, `dns`. |
| `MCP_READ_ONLY`             | `true`    | Expose only tools with `readOnlyHint: true`. Accepts `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`.                             |
| `MCP_TOOLS_ALLOW`           | –         | Comma separated tool names to keep. `*` is a wildcard.                                                                            |
| `MCP_TOOLS_DENY`            | –         | Comma separated tool names to remove. `*` is a wildcard.                                                                          |
| `MCP_AUTH_TOKEN`            | –         | If set, `/mcp` requires the header `Authorization: Bearer <token>`.                                                               |

Invalid values (unknown group, bad port, broken boolean) stop the server at startup with a clear error.

## Get an API token

1. Open the project in the [Hetzner Console](https://console.hetzner.com).
2. **Security** → **API tokens** → **Generate API token**.
3. Choose permission **Read**. That is enough for the default mode.
4. Copy the token and set it as `HETZNER_API_TOKEN`.

> [!IMPORTANT]
> Hetzner shows the token only once. Store it right away in your password manager or the `.env` on your server.

You only need **Read & Write** if you set `MCP_READ_ONLY=false` and really want Claude to change things. Read [Security](security.md) first.

## Tool filters

Filters are applied in this order:

1. **`MCP_SPLITS`** loads only the selected groups.
2. **`MCP_READ_ONLY`** drops all write tools.
3. **`MCP_TOOLS_ALLOW`** keeps only matching tools (if set).
4. **`MCP_TOOLS_DENY`** removes matching tools.

Examples:

```sh
# Only servers, IPs and prices
MCP_SPLITS=servers,ips

# Only list and get tools
MCP_TOOLS_ALLOW=hetzner_list_*,hetzner_get_*

# Writing allowed, but no deletes
MCP_READ_ONLY=false
MCP_TOOLS_DENY=hetzner_delete_*
```

See [Tools](tools.md) for which tools belong to which group.

## Example

```sh
HETZNER_API_TOKEN=your-read-token
MCP_SPLITS=all
MCP_READ_ONLY=true
MCP_TOOLS_DENY=hetzner_get_server_metrics
```
