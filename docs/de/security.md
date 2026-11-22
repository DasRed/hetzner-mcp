---
title:       Sicherheit
description: Welche Rechte hetzner-mcp braucht, was der Server darf und wie du den Endpunkt absicherst.
order:       50
slug:        sicherheit
section:     Referenz
---

## Standard: nur lesen

Ohne weitere Einstellungen bietet hetzner-mcp nur Tools an, die im Basispaket als `readOnlyHint: true` markiert sind. Claude kann dann Bestand, Preise und Metriken abfragen, aber nichts anlegen, ändern oder löschen.

Zusätzlich solltest du einen Token mit der Berechtigung **Lesen** verwenden. Dann ist der Nur-Lesen-Modus doppelt abgesichert: selbst wenn ein schreibendes Tool durchrutscht, lehnt Hetzner den Aufruf ab.

## Schreibender Modus

Mit `MCP_READ_ONLY=false` und einem Token mit **Lesen & Schreiben** kann Claude unter anderem:

- Server anlegen, neu starten, umbauen und löschen
- Firewalls, Netzwerke und DNS-Records ändern
- IPs, Volumes, Snapshots und Storage Boxes verwalten

> [!CAUTION]
> Neue Ressourcen kosten Geld, gelöschte Server und Volumes sind weg. Schalte das nur ein, wenn du es wirklich brauchst, und grenze es mit `MCP_TOOLS_DENY` ein, z. B. `hetzner_delete_*,hetzner_rebuild_server`.

## Token-Umfang

- Ein Hetzner-Token gilt für genau **ein Projekt**. Der Server sieht nichts aus anderen Projekten.
- Rechnungen, Kundendaten und Zahlungsinformationen sind über die Cloud API nicht erreichbar.
- Der Token bleibt im Container. Er wird nur an `api.hetzner.cloud` bzw. `api.hetzner.com` geschickt, nie an Claude.

## Endpunkt absichern

Wer `/mcp` erreicht, kann alle aktiven Tools mit deinem Token aufrufen. Lass den Endpunkt deshalb nie offen im Netz stehen.

| Variante                        | Geeignet für                  | Umsetzung                                                                                                |
|---------------------------------|-------------------------------|----------------------------------------------------------------------------------------------------------|
| IP-Allowlist am Reverse Proxy   | Claude (Web, Desktop, Mobile) | Nur die [IPs von Anthropic](https://docs.claude.com/en/api/ip-addresses) und dein eigenes Netz zulassen. |
| Bearer-Token (`MCP_AUTH_TOKEN`) | Claude Code, eigene Clients   | Langen Zufallswert setzen, z. B. `openssl rand -hex 32`.                                                 |
| Nur intern                      | Clients im selben Netz        | Port nur an `127.0.0.1` oder ein internes Netz binden.                                                   |

Der Token-Vergleich läuft zeitkonstant. `/healthz` ist absichtlich ohne Authentifizierung erreichbar und gibt nur `{"status":"ok"}` zurück.

## Container

- Der Server ist stateless und schreibt nichts auf die Platte. Du kannst ihn mit `read_only: true`, `cap_drop: ALL` und `no-new-privileges` betreiben.
- Anfragen an `/mcp` sind auf 4 MB begrenzt.
- Secrets gehören in eine `.env` oder einen Secret Store, nicht in die `compose.yaml` im Git-Repository.

## Lizenz des Basispakets

Die Tools stammen aus [`@lazyants/hetzner-mcp-server`](https://github.com/lazyants/hetzner-mcp-server) unter [FSL-1.1-MIT](https://github.com/lazyants/hetzner-mcp-server/blob/main/LICENSE). hetzner-mcp selbst steht unter MIT.
