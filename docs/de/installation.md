---
title:       Installation
description: hetzner-mcp als Docker-Container starten, per docker run oder Docker Compose, mit Ports, Endpunkten, mehreren Projekten und Betrieb hinter einem Reverse Proxy.
order:       10
slug:        installation
section:     Einrichtung
---

## Image

Das Image liegt in der GitHub Container Registry und ist für `linux/amd64` und `linux/arm64` gebaut:

```text
ghcr.io/dasred/hetzner-mcp
```

Verfügbare Tags: `latest`, `<major>` (z. B. `1`), `<major>.<minor>` und die volle Version. Für den Dauerbetrieb nimmst du am besten den Major-Tag, dann bekommst du Fixes, aber keine Breaking Changes.

## Schnellstart

Du brauchst nur einen Hetzner API-Token (siehe [Konfiguration](configuration.md#api-token-holen)):

```sh
docker run -d --name hetzner-mcp \
  -p 3000:3000 \
  -e HETZNER_API_TOKEN=dein-read-token \
  ghcr.io/dasred/hetzner-mcp:1
```

Prüfen, ob der Server läuft:

```sh
curl http://localhost:3000/healthz
```

Antwort: `{"status":"ok"}`.

## Docker Compose

```yaml
services:
  hetzner-mcp:
    image:     ghcr.io/dasred/hetzner-mcp:1
    restart:   unless-stopped
    read_only: true
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    environment:
      HETZNER_API_TOKEN: ${HETZNER_API_TOKEN}
      MCP_SPLITS:        all
      MCP_READ_ONLY:     'true'
    ports:
      - '127.0.0.1:3000:3000'
```

Den Token legst du in eine `.env` neben der `compose.yaml`, nicht direkt in die Datei.

> [!TIP]
> Der Server speichert nichts. `read_only: true` und `cap_drop: ALL` funktionieren deshalb ohne Volumes.

## Ports und Endpunkte

| Pfad       | Methode | Beschreibung                                 |
|------------|---------|----------------------------------------------|
| `/mcp`     | `POST`  | MCP-Endpunkt (Pfad über `MCP_PATH` änderbar) |
| `/healthz` | `GET`   | Health-Check, ohne Authentifizierung         |

Der Container lauscht auf Port `3000`. Andere Methoden als `POST` auf `/mcp` beantwortet der Server mit `405`, weil er stateless läuft.

Das Image hat einen eingebauten `HEALTHCHECK`, Docker zeigt den Status also direkt an.

## Mehrere Projekte

Ein Hetzner API-Token gilt immer nur für ein Projekt. Wenn du mehrere Projekte hast, startest du pro Projekt einen eigenen Container mit eigenem Port.

## Hinter einem Reverse Proxy

Wenn Claude den Server erreichen soll, muss er über HTTPS aus dem Internet erreichbar sein. Stell ihn dafür hinter einen Reverse Proxy (z. B. Nginx Proxy Manager) mit TLS. Wie du den Zugriff absicherst, steht unter [Sicherheit](security.md).
