---
title:       Überblick
description: hetzner-mcp macht die Hetzner Cloud API als Remote-MCP-Server für Claude nutzbar, standardmäßig nur lesend. Was er kann, wofür er gedacht ist und der Status.
order:       0
section:     Einstieg
---

## Was ist hetzner-mcp?

hetzner-mcp ist ein [MCP](https://modelcontextprotocol.io)-Server für die Hetzner Cloud API. Er läuft als Docker-Container und spricht Streamable HTTP, damit du ihn in Claude als Custom Connector einbinden kannst.

Damit kann Claude deinen Hetzner-Bestand abfragen: Server, Netzwerke, Firewalls, IPs, Volumes, Storage Boxes, DNS-Zonen und Preise.

## Wofür?

- **Überblick**: Was läuft in welchem Projekt, mit welchem Servertyp, an welchem Standort?
- **Kosten**: Zusammen mit `hetzner_get_pricing` kann Claude ausrechnen, was dein Bestand pro Monat kostet.
- **Fehlersuche**: Firewall-Regeln, Netzwerke oder DNS-Records prüfen, ohne die Hetzner Console zu öffnen.

> [!NOTE]
> Rechnungen gibt es in der Hetzner Cloud API nicht. Die Kosten lassen sich nur aus Bestand und Preisliste ableiten.

## Tools

Die Tools stammen aus [`@lazyants/hetzner-mcp-server`](https://github.com/lazyants/hetzner-mcp-server) und sind in acht Gruppen aufgeteilt: `servers`, `networking`, `load-balancers`, `ips`, `storage`, `storage-boxes`, `config` und `dns`. Insgesamt sind es 185 Tools, davon 59 nur lesend.

Standardmäßig sind nur die lesenden Tools aktiv. Die komplette Liste findest du unter [Tools](tools.md).

## Was hetzner-mcp dazu baut

Das Basispaket kann nur stdio. hetzner-mcp ergänzt:

- HTTP-Transport (stateless, jeder `POST` bekommt eine eigene MCP-Instanz)
- Nur-Lesen-Modus als Standard
- Auswahl der Tool-Gruppen per `MCP_SPLITS`
- Allow- und Deny-Listen mit `*` als Platzhalter
- Optionaler Bearer-Token für den MCP-Endpunkt
- Health-Check unter `/healthz`

## Status

Aktiv im Einsatz. Das Image wird bei jedem Release automatisch nach `ghcr.io/dasred/hetzner-mcp` gebaut.

## Weiter

1. [Installation](installation.md)
2. [Konfiguration](configuration.md)
3. [In Claude einbinden](claude.md)
4. [Andere MCP-Clients](clients.md)
