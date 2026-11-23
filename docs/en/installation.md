---
title: Installation
description: Run hetzner-mcp as a Docker container with docker run or Docker Compose, including ports and endpoints, multiple projects and running it behind a reverse proxy.
order: 10
slug: installation
section: Setup
---

## Image

The image is published to the GitHub Container Registry for `linux/amd64` and `linux/arm64`:

```text
ghcr.io/dasred/hetzner-mcp
```

Available tags: `latest`, `<major>` (e.g. `1`), `<major>.<minor>` and the full version. For long-running setups use the major tag: you get fixes but no breaking changes.

## Quick start

All you need is a Hetzner API token (see [Configuration](configuration.md#get-an-api-token)):

```sh
docker run -d --name hetzner-mcp \
  -p 3000:3000 \
  -e HETZNER_API_TOKEN=your-read-token \
  ghcr.io/dasred/hetzner-mcp:1
```

Check that the server is running:

```sh
curl http://localhost:3000/healthz
```

Response: `{"status":"ok"}`.

## Docker Compose

```yaml
services:
  hetzner-mcp:
    image: ghcr.io/dasred/hetzner-mcp:1
    restart: unless-stopped
    read_only: true
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    environment:
      HETZNER_API_TOKEN: ${HETZNER_API_TOKEN}
      MCP_SPLITS: all
      MCP_READ_ONLY: 'true'
    ports:
      - '127.0.0.1:3000:3000'
```

Put the token into a `.env` file next to `compose.yaml`, not into the file itself.

> [!TIP]
> The server stores nothing. That is why `read_only: true` and `cap_drop: ALL` work without any volumes.

## Ports and endpoints

| Path       | Method | Description                                     |
|------------|--------|-------------------------------------------------|
| `/mcp`     | `POST` | MCP endpoint (path configurable via `MCP_PATH`) |
| `/healthz` | `GET`  | Health check, no authentication                 |

The container listens on port `3000`. Methods other than `POST` on `/mcp` return `405` because the server is stateless.

The image ships with a `HEALTHCHECK`, so Docker shows the status directly.

## Multiple projects

A Hetzner API token is always scoped to one project. If you have several projects, run one container per project on its own port.

## Behind a reverse proxy

For Claude to reach the server, it must be reachable from the internet via HTTPS. Put it behind a reverse proxy (e.g. Nginx Proxy Manager) with TLS. How to restrict access is described in [Security](security.md).
