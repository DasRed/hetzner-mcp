---
title: In Claude einbinden
description: hetzner-mcp als Custom Connector in Claude (Web, Desktop, Mobile), als Remote-MCP-Server in Claude Code oder per JSON-Konfiguration in anderen MCP-Clients einbinden, die Verbindung testen und Fehler finden.
order: 30
slug: claude
section: Einrichtung
---

## Voraussetzungen

- hetzner-mcp läuft und ist per HTTPS aus dem Internet erreichbar, z. B. unter `https://hetzner.mcp.example.com/mcp`.
- Der Zugriff ist abgesichert (siehe [Sicherheit](security.md)).

> [!IMPORTANT]
> Custom Connectors in Claude verbinden sich von den Servern von Anthropic aus, nicht von deinem Rechner. Eine URL, die nur in deinem Heimnetz funktioniert, reicht nicht.

## Claude (Web, Desktop, Mobile)

1. **Einstellungen** → **Connectors** → **Custom Connector hinzufügen**.
2. Name: z. B. `Hetzner`.
3. URL: `https://hetzner.mcp.example.com/mcp`
4. Speichern.

Claude-Connectors können keine eigenen Header mitschicken, also auch keinen Bearer-Token. Sichere den Endpunkt deshalb am Reverse Proxy ab, z. B. über eine Access List mit den [ausgehenden IP-Adressen von Anthropic](https://docs.claude.com/en/api/ip-addresses).

## Claude Code

In Claude Code kannst du den Bearer-Token direkt mitgeben:

```sh
claude mcp add --transport http hetzner https://hetzner.mcp.example.com/mcp \
  --header "Authorization: Bearer dein-mcp-auth-token"
```

Dafür muss `MCP_AUTH_TOKEN` am Server gesetzt sein.

## Andere MCP-Clients (JSON-Konfiguration)

Viele MCP-Clients werden über einen JSON-Eintrag unter `mcpServers` konfiguriert, z. B. die `.mcp.json` von Claude Code oder Clients mit eigener Weboberfläche. Für hetzner-mcp sieht der Eintrag so aus:

```json
{
  "mcpServers": {
    "hetzner": {
      "type": "http",
      "url": "https://hetzner.mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer dein-mcp-auth-token"
      }
    }
  }
}
```

- `type` heißt je nach Client `http` oder `streamable-http`.
- `headers` lässt du weg, wenn `MCP_AUTH_TOKEN` auf dem Server nicht gesetzt ist.
- Solche Clients verbinden sich von deinem Rechner aus. Hier reicht deshalb auch eine Adresse im Heimnetz, z. B. `http://192.168.1.10:3000/mcp`.

Clients, die nur lokale Server per stdio starten (z. B. die `claude_desktop_config.json` von Claude Desktop), bindest du über [mcp-remote](https://www.npmjs.com/package/mcp-remote) an:

```json
{
  "mcpServers": {
    "hetzner": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://hetzner.mcp.example.com/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer dein-mcp-auth-token"
      }
    }
  }
}
```

Der Token steht in `env`, weil manche Clients Leerzeichen in `args` nicht sauber übergeben. Für eine `http://`-Adresse außerhalb von `localhost` braucht mcp-remote zusätzlich `--allow-http`.

## Testen

Frag Claude zum Beispiel:

- „Welche Server laufen in meinem Hetzner-Projekt?"
- „Was kosten meine Hetzner-Server pro Monat?"
- „Zeig mir die Regeln der Firewall von web-1."

Claude sollte dafür `hetzner_list_servers`, `hetzner_get_pricing` bzw. `hetzner_list_firewalls` aufrufen.

## Fehlersuche

| Symptom                              | Ursache                                                                                 |
|--------------------------------------|-----------------------------------------------------------------------------------------|
| Connector lässt sich nicht verbinden | Server nicht öffentlich erreichbar oder Reverse Proxy blockt die IPs von Anthropic.     |
| `401 Unauthorized`                   | `MCP_AUTH_TOKEN` ist gesetzt, der Client schickt aber keinen oder einen falschen Token. |
| `405 Method not allowed`             | Normal bei `GET`. Der Server ist stateless und nimmt nur `POST` an.                     |
| Tools fehlen                         | `MCP_READ_ONLY`, `MCP_SPLITS` oder die Allow/Deny-Listen filtern sie raus.              |
| Hetzner-Fehler `unauthorized`        | `HETZNER_API_TOKEN` falsch, abgelaufen oder für ein anderes Projekt.                    |

Nach Änderungen an den Tools musst du den Connector in Claude einmal trennen und neu verbinden, damit Claude die neue Tool-Liste lädt.
