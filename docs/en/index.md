---
title: Overview
description: hetzner-mcp exposes the Hetzner Cloud API as a remote MCP server for Claude, read-only by default. What it can do, what it is meant for and its current status.
order: 0
section: Getting started
---

## What is hetzner-mcp?

hetzner-mcp is an [MCP](https://modelcontextprotocol.io) server for the Hetzner Cloud API. It runs as a Docker container and speaks Streamable HTTP, so you can add it to Claude as a custom connector.

Claude can then query your Hetzner inventory: servers, networks, firewalls, IPs, volumes, Storage Boxes, DNS zones and prices.

## What for?

- **Overview**: what runs in which project, with which server type, in which location?
- **Costs**: combined with `hetzner_get_pricing`, Claude can calculate what your inventory costs per month.
- **Troubleshooting**: check firewall rules, networks or DNS records without opening the Hetzner Console.

> [!NOTE]
> The Hetzner Cloud API has no invoices. Costs can only be derived from inventory and price list.

## Tools

The tools come from [`@lazyants/hetzner-mcp-server`](https://github.com/lazyants/hetzner-mcp-server) and are split into eight groups: `servers`, `networking`, `load-balancers`, `ips`, `storage`, `storage-boxes`, `config` and `dns`. That is 185 tools in total, 59 of them read-only.

By default only the read-only tools are active. See [Tools](tools.md) for the full list.

## What hetzner-mcp adds

The base package only supports stdio. hetzner-mcp adds:

- HTTP transport (stateless, every `POST` gets its own MCP instance)
- Read-only mode by default
- Tool group selection via `MCP_SPLITS`
- Allow and deny lists with `*` as wildcard
- Optional bearer token for the MCP endpoint
- Health check at `/healthz`

## Status

Actively used. The image is built automatically to `ghcr.io/dasred/hetzner-mcp` on every release.

## Next

1. [Installation](installation.md)
2. [Configuration](configuration.md)
3. [Connect to Claude](claude.md)
