# hetzner-mcp

Streamable HTTP [MCP](https://modelcontextprotocol.io) server for the Hetzner Cloud API, shipped as a Docker image. It serves the tools of [`@lazyants/hetzner-mcp-server`](https://github.com/lazyants/hetzner-mcp-server) over HTTP so they can be used as a Claude custom connector – read-only by default, with tool groups, allow/deny lists and an optional bearer token.

Documentation: https://www.marco-starker.de/en/projects/hetzner-mcp/docs

## Quick start

```sh
docker run -d --name hetzner-mcp \
  -p 3000:3000 \
  -e HETZNER_API_TOKEN=your-read-token \
  ghcr.io/dasred/hetzner-mcp:1
```

The MCP endpoint is `http://localhost:3000/mcp`. Never expose it to the internet without TLS and access control.

## Development

Requires Node.js 26.

```sh
npm ci
cp .env.example .env
npm run dev
npm test
npm run build
```

Releases are created by semantic-release from Conventional Commits on `main`.

## License

MIT. The bundled `@lazyants/hetzner-mcp-server` is licensed under [FSL-1.1-MIT](https://github.com/lazyants/hetzner-mcp-server/blob/main/LICENSE).
