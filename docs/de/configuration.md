---
title: Konfiguration
description: Alle Umgebungsvariablen von hetzner-mcp mit Standardwerten, dazu wie du einen API-Token für die Hetzner Cloud holst und die Tools per Filter einschränkst.
order: 20
slug: konfiguration
section: Einrichtung
---

## Umgebungsvariablen

hetzner-mcp wird komplett über Umgebungsvariablen konfiguriert. Eine Vorlage findest du in [`.env.example`](https://github.com/DasRed/hetzner-mcp/blob/main/.env.example).

| Name                        | Standard  | Beschreibung                                                                                                                            |
|-----------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `HETZNER_API_TOKEN`         | –         | API-Token eines Hetzner-Cloud-Projekts. Pflicht, außer du setzt nur `HETZNER_STORAGE_API_TOKEN`.                                        |
| `HETZNER_STORAGE_API_TOKEN` | –         | Eigener Token für Storage Boxes. Fällt auf `HETZNER_API_TOKEN` zurück.                                                                  |
| `HOST`                      | `0.0.0.0` | Adresse, auf der der Server lauscht.                                                                                                    |
| `PORT`                      | `3000`    | Port des Servers.                                                                                                                       |
| `MCP_PATH`                  | `/mcp`    | Pfad des MCP-Endpunkts.                                                                                                                 |
| `MCP_SPLITS`                | `all`     | `all` oder eine kommagetrennte Liste aus `servers`, `networking`, `load-balancers`, `ips`, `storage`, `storage-boxes`, `config`, `dns`. |
| `MCP_READ_ONLY`             | `true`    | Nur Tools mit `readOnlyHint: true` anbieten. Akzeptiert `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`.                                |
| `MCP_TOOLS_ALLOW`           | –         | Kommagetrennte Tool-Namen, die übrig bleiben sollen. `*` ist Platzhalter.                                                               |
| `MCP_TOOLS_DENY`            | –         | Kommagetrennte Tool-Namen, die entfernt werden. `*` ist Platzhalter.                                                                    |
| `MCP_AUTH_TOKEN`            | –         | Wenn gesetzt, verlangt `/mcp` den Header `Authorization: Bearer <token>`.                                                               |

Ungültige Werte (unbekannte Gruppe, falscher Port, kaputter Boolean) brechen den Start mit einer klaren Fehlermeldung ab.

## API-Token holen

1. In der [Hetzner Console](https://console.hetzner.com) das Projekt öffnen.
2. **Sicherheit** → **API-Tokens** → **API-Token generieren**.
3. Berechtigung **Lesen** wählen. Das reicht für den Standardmodus.
4. Token kopieren und als `HETZNER_API_TOKEN` setzen.

> [!IMPORTANT]
> Hetzner zeigt den Token nur einmal an. Speicher ihn direkt in deinem Passwortmanager oder in der `.env` deines Servers.

**Lesen & Schreiben** brauchst du nur, wenn du `MCP_READ_ONLY=false` setzt und Claude wirklich Dinge ändern soll. Lies dazu vorher [Sicherheit](security.md).

## Tool-Filter

Die Filter laufen in dieser Reihenfolge:

1. **`MCP_SPLITS`** lädt nur die gewählten Gruppen.
2. **`MCP_READ_ONLY`** wirft alle schreibenden Tools raus.
3. **`MCP_TOOLS_ALLOW`** behält nur passende Tools (wenn gesetzt).
4. **`MCP_TOOLS_DENY`** entfernt passende Tools.

Beispiele:

```sh
# Nur Server, IPs und Preise
MCP_SPLITS=servers,ips

# Nur list- und get-Tools
MCP_TOOLS_ALLOW=hetzner_list_*,hetzner_get_*

# Schreiben erlaubt, aber nichts löschen
MCP_READ_ONLY=false
MCP_TOOLS_DENY=hetzner_delete_*
```

Welche Tools in welcher Gruppe stecken, siehst du unter [Tools](tools.md).

## Beispiel

```sh
HETZNER_API_TOKEN=dein-read-token
MCP_SPLITS=all
MCP_READ_ONLY=true
MCP_TOOLS_DENY=hetzner_get_server_metrics
```
