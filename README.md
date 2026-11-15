# hetzner-mcp

Streamable HTTP [MCP](https://modelcontextprotocol.io) server for the Hetzner Cloud API, shipped as a Docker image.

It wraps the tools of [`@lazyants/hetzner-mcp-server`](https://github.com/lazyants/hetzner-mcp-server) (stdio only) and serves them over HTTP, so it can be used as a remote MCP server / custom connector. On top of that it adds:

- **Read-only by default**: only tools annotated with `readOnlyHint: true` are exposed unless `MCP_READ_ONLY=false`.
- **Tool groups**: load only the Hetzner domains you need (`MCP_SPLITS`).
- **Allow/deny lists** for single tools with `*` wildcards.
- **Optional bearer token** for the MCP endpoint.
- **Health check** at `/healthz`.

The server is stateless: every `POST` to the MCP endpoint is handled by a fresh MCP server instance.

## Configuration

All settings are environment variables (see [`.env.example`](.env.example)).

| Variable                    | Default   | Description                                                                                                                               |
|-----------------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `HETZNER_API_TOKEN`         | –         | Hetzner Cloud API token of one project (Hetzner Console → project → Security → API tokens). A **Read** token is enough in read-only mode. |
| `HETZNER_STORAGE_API_TOKEN` | –         | Optional token for Storage Boxes, falls back to `HETZNER_API_TOKEN`.                                                                      |
| `HOST`                      | `0.0.0.0` | Listen address.                                                                                                                           |
| `PORT`                      | `3000`    | Listen port.                                                                                                                              |
| `MCP_PATH`                  | `/mcp`    | Path of the MCP endpoint.                                                                                                                 |
| `MCP_SPLITS`                | `all`     | `all` or a comma separated list of `servers`, `networking`, `load-balancers`, `ips`, `storage`, `storage-boxes`, `config`, `dns`.         |
| `MCP_READ_ONLY`             | `true`    | Expose only read-only tools.                                                                                                              |
| `MCP_TOOLS_ALLOW`           | –         | Comma separated tool names to keep, `*` as wildcard (e.g. `hetzner_list_*,hetzner_get_pricing`).                                          |
| `MCP_TOOLS_DENY`            | –         | Comma separated tool names to remove, `*` as wildcard.                                                                                    |
| `MCP_AUTH_TOKEN`            | –         | If set, the MCP endpoint requires `Authorization: Bearer <token>`.                                                                        |

Filters are applied in this order: read-only mode, allow list, deny list.

A Hetzner API token is always scoped to one project. Run one container per project if you have more than one.

## Docker

```sh
docker run -d --name hetzner-mcp \
  -p 3000:3000 \
  -e HETZNER_API_TOKEN=your-read-token \
  ghcr.io/dasred/hetzner-mcp:latest
```

Example `docker-compose.yml`:

```yaml
services:
  hetzner-mcp:
    image: ghcr.io/dasred/hetzner-mcp:1
    restart: unless-stopped
    environment:
      HETZNER_API_TOKEN: ${HETZNER_API_TOKEN}
      MCP_SPLITS: servers,ips,storage,storage-boxes
    ports:
      - "3000:3000"
```

The MCP endpoint is `http://<host>:3000/mcp`. When exposing it to the internet, put it behind a reverse proxy with TLS and authentication (or set `MCP_AUTH_TOKEN`).

## Development

Requires Node.js 26.

```sh
npm ci
cp .env.example .env   # set HETZNER_API_TOKEN
npm run dev            # runs src/index.ts with watch mode
npm test               # type check + node:test
npm run build          # compiles to dist/
```

## Release

Releases are created by [semantic-release](https://github.com/semantic-release/semantic-release) on every push to `main` based on [Conventional Commits](https://www.conventionalcommits.org). The CI pipeline (`DasRed/github-workflows` → `node-docker.yml`) runs tests and build, creates the release and publishes the multi-arch image (`linux/amd64`, `linux/arm64`) to `ghcr.io/dasred/hetzner-mcp` with the tags `latest`, `<major>`, `<major>.<minor>` and `<version>`.

## License

MIT for this repository. The bundled `@lazyants/hetzner-mcp-server` is licensed under [FSL-1.1-MIT](https://github.com/lazyants/hetzner-mcp-server/blob/main/LICENSE).
