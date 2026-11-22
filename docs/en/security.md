---
title: Security
description: Which permissions hetzner-mcp needs, what the server may do and how to protect the endpoint.
order: 50
slug: security
section: Reference
---

## Default: read-only

Without further settings, hetzner-mcp only exposes tools marked `readOnlyHint: true` in the base package. Claude can query inventory, prices and metrics, but cannot create, change or delete anything.

Also use a token with **Read** permission. Then read-only mode is protected twice: even if a write tool slipped through, Hetzner rejects the call.

## Write mode

With `MCP_READ_ONLY=false` and a **Read & Write** token, Claude can among other things:

- create, reboot, rebuild and delete servers
- change firewalls, networks and DNS records
- manage IPs, volumes, snapshots and Storage Boxes

> [!CAUTION]
> New resources cost money, deleted servers and volumes are gone. Only enable this if you really need it, and narrow it down with `MCP_TOOLS_DENY`, e.g. `hetzner_delete_*,hetzner_rebuild_server`.

## Token scope

- A Hetzner token is valid for exactly **one project**. The server sees nothing from other projects.
- Invoices, customer data and payment details are not reachable through the Cloud API.
- The token stays in the container. It is only sent to `api.hetzner.cloud` or `api.hetzner.com`, never to Claude.

## Protecting the endpoint

Anyone who can reach `/mcp` can call all active tools with your token. Never leave the endpoint open on the internet.

| Option                          | Suitable for                  | How                                                                                             |
|---------------------------------|-------------------------------|-------------------------------------------------------------------------------------------------|
| IP allowlist at reverse proxy   | Claude (web, desktop, mobile) | Allow only [Anthropic's IPs](https://docs.claude.com/en/api/ip-addresses) and your own network. |
| Bearer token (`MCP_AUTH_TOKEN`) | Claude Code, own clients      | Set a long random value, e.g. `openssl rand -hex 32`.                                           |
| Internal only                   | Clients in the same network   | Bind the port to `127.0.0.1` or an internal network.                                            |

The token comparison is constant-time. `/healthz` is intentionally unauthenticated and only returns `{"status":"ok"}`.

## Container

- The server is stateless and writes nothing to disk. You can run it with `read_only: true`, `cap_drop: ALL` and `no-new-privileges`.
- Requests to `/mcp` are limited to 4 MB.
- Secrets belong in a `.env` file or a secret store, not in a `compose.yaml` committed to Git.

## Base package license

The tools come from [`@lazyants/hetzner-mcp-server`](https://github.com/lazyants/hetzner-mcp-server) under [FSL-1.1-MIT](https://github.com/lazyants/hetzner-mcp-server/blob/main/LICENSE). hetzner-mcp itself is MIT licensed.
