---
title: Tools
description: Referenz aller 185 Tools von hetzner-mcp, nach Gruppen sortiert, mit Parametern und Nur-Lesen-Markierung.
order: 40
slug: tools
section: Referenz
---

## Übersicht

hetzner-mcp bringt 185 Tools aus `@lazyants/hetzner-mcp-server` 4.1.0 mit, davon 59 nur lesend. Alle Namen beginnen mit `hetzner_`.

Im Standardmodus (`MCP_READ_ONLY=true`) sind nur die Tools mit ✅ in der Spalte **Lesen** aktiv. Welche Gruppen geladen werden, steuerst du mit `MCP_SPLITS` (siehe [Konfiguration](configuration.md)).

| Gruppe | Inhalt | Tools | Davon lesend |
|---|---|---|---|
| `servers` | Server, Servertypen, Standorte, Preise und Metriken | 33 | 10 |
| `networking` | Private Netzwerke und Firewalls | 22 | 7 |
| `load-balancers` | Load Balancer und Zertifikate | 28 | 8 |
| `ips` | Floating IPs und Primary IPs | 20 | 6 |
| `storage` | Volumes und Images (Snapshots, Backups) | 17 | 6 |
| `storage-boxes` | Storage Boxes, Subaccounts und Snapshots | 29 | 10 |
| `config` | SSH-Keys, ISOs und Placement Groups | 14 | 6 |
| `dns` | DNS-Zonen und Records | 22 | 6 |

`hetzner_wait_for_action` wird von allen Gruppen geteilt und steht hier unter `servers`.

Außerdem gibt es die Resource `reference://hetzner/api` mit einer Kurzreferenz der Hetzner API, die Claude bei Bedarf lesen kann.

> [!NOTE]
> Die Beschreibungen kommen unverändert aus dem Basispaket und sind deshalb englisch. Optionale Parameter sind mit `?` markiert.

## Beispiele

Alle Server mit dem Label `env=prod`:

```json
{
    "name": "hetzner_list_servers",
    "arguments": {"label_selector": "env=prod"}
}
```

Preise aller Servertypen und Zusatzleistungen:

```json
{
    "name": "hetzner_get_pricing",
    "arguments": {}
}
```

Records einer DNS-Zone:

```json
{
    "name": "hetzner_list_zone_rrsets",
    "arguments": {"id_or_name": "example.com"}
}
```

## `servers`

Server, Servertypen, Standorte, Preise und Metriken.

| Tool | Lesen | Parameter | Beschreibung |
|---|---|---|---|
| `hetzner_list_servers` | ✅ | `name?`, `sort?`, `label_selector?`, `status?`, `page?`, `per_page?` | List all servers in the project, with optional filtering by name, label, or status. |
| `hetzner_get_server` | ✅ | `id` | Get details of a specific server by ID. |
| `hetzner_create_server` | – | `name`, `server_type`, `image`, `location?`, `ssh_keys?`, `networks?`, `volumes?`, `firewalls?`, `user_data?`, `labels?`, `placement_group?`, `public_net?`, `automount?`, `start_after_create?` | Create a new server with the specified type, image, and configuration options. |
| `hetzner_update_server` | – | `id`, `name?`, `labels?` | Update a server's name or labels. |
| `hetzner_delete_server` | – | `id` | Permanently delete a server. This destroys the server and all associated data. |
| `hetzner_power_on` | – | `id` | Start a stopped server by powering it on. |
| `hetzner_power_off` | – | `id` | Force power off a server immediately. This is like pulling the power cord. |
| `hetzner_reboot` | – | `id` | Send an ACPI reboot signal to the server for a soft reboot. |
| `hetzner_reset` | – | `id` | Perform a hard reset on the server, equivalent to pressing the reset button. |
| `hetzner_shutdown` | – | `id` | Send an ACPI shutdown signal for a graceful OS shutdown. |
| `hetzner_rebuild_server` | – | `id`, `image`, `user_data?` | Rebuild a server from an image, wiping all data on the server. |
| `hetzner_resize_server` | – | `id`, `server_type`, `upgrade_disk` | Change the server type. The server will be stopped and migrated if needed. |
| `hetzner_enable_rescue` | – | `id`, `type?`, `ssh_keys?` | Enable rescue mode on a server. The server must be rebooted to enter rescue mode. |
| `hetzner_disable_rescue` | – | `id` | Disable rescue mode on a server. The next reboot will boot normally. |
| `hetzner_get_server_metrics` | ✅ | `id`, `type`, `start`, `end`, `step?` | Retrieve time series metrics (CPU, disk, network) for a server over a time range. |
| `hetzner_list_server_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions for a specific server, such as power changes and rebuilds. |
| `hetzner_change_server_protection` | – | `id`, `delete?`, `rebuild?` | Enable or disable delete and rebuild protection on a server to guard against accidental destruction. |
| `hetzner_request_console` | – | `id` | Request a noVNC WebSocket URL and credentials to access the server console. The URL is valid for a limited time. |
| `hetzner_enable_backup` | – | `id` | Enable automatic daily backups for a server. Backups increase the server price by 20 percent. The backup window is chosen automatically. |
| `hetzner_disable_backup` | – | `id` | Disable automatic backups for a server and remove all existing backup snapshots. |
| `hetzner_change_alias_ips` | – | `id`, `network`, `alias_ips` | Replace the alias IPs that a server has on a private network. The list overrides any existing alias IPs for that network. |
| `hetzner_change_dns_ptr` | – | `id`, `ip`, `dns_ptr` | Change the reverse DNS entry for one of a server's public IPv4 or IPv6 addresses. Set dns_ptr to null to reset to the default. |
| `hetzner_attach_server_to_network` | – | `id`, `network`, `ip?`, `alias_ips?`, `ip_range?` | Attach a server to a private network, optionally assigning a specific IP, alias IPs, or IP range. |
| `hetzner_detach_server_from_network` | – | `id`, `network` | Detach a server from a private network, removing its private connectivity on that network. |
| `hetzner_add_server_to_placement_group` | – | `id`, `placement_group` | Add a server to a placement group. The server must be powered off before it can be added. |
| `hetzner_remove_server_from_placement_group` | – | `id` | Remove a server from its placement group. |
| `hetzner_reset_server_password` | – | `id` | Reset the root password of a server. The server is rebooted and a new root password is returned in the result. |
| `hetzner_list_locations` | ✅ | `name?`, `page?`, `per_page?` | List all available Hetzner Cloud locations (regions). |
| `hetzner_get_location` | ✅ | `id` | Get details of a specific location by ID. |
| `hetzner_list_server_types` | ✅ | `name?`, `page?`, `per_page?` | List server types with specs, pricing, and per-location availability and recommendations. |
| `hetzner_get_server_type` | ✅ | `id` | Get details of a specific server type, including specs and pricing. |
| `hetzner_get_pricing` | ✅ | `resource?` | Get current Hetzner Cloud prices, optionally selecting one resource category or traffic prices. Currency and VAT rate are included with filtered results. |
| `hetzner_wait_for_action` | ✅ | `domain`, `resource_id`, `action_id`, `timeout?` | Wait for a resource action to reach success or error and return its full details. The timeout includes API requests and rate-limit delays. |

## `networking`

Private Netzwerke und Firewalls.

| Tool | Lesen | Parameter | Beschreibung |
|---|---|---|---|
| `hetzner_list_networks` | ✅ | `name?`, `sort?`, `label_selector?`, `page?`, `per_page?` | List all networks in the project, with optional filtering by name or labels. |
| `hetzner_list_network_members` | ✅ | `id`, `type?`, `subnet?`, `status?`, `sort?`, `page?`, `per_page?` | List resources attached to a network, with their subnet, IP addresses, and attachment status. Filter by resource type, subnet, or status. |
| `hetzner_get_network` | ✅ | `id` | Get details of a specific network by its ID. |
| `hetzner_create_network` | – | `name`, `ip_range`, `subnets?`, `routes?`, `labels?`, `expose_routes_to_vswitch?` | Create a new network with the specified IP range, and optionally subnets and routes. |
| `hetzner_update_network` | – | `id`, `name?`, `labels?`, `expose_routes_to_vswitch?` | Update properties of a network such as name, labels, or vSwitch route exposure. |
| `hetzner_delete_network` | – | `id` | Delete a network. All subnets and routes within it will also be deleted. |
| `hetzner_add_subnet` | – | `id`, `type`, `network_zone`, `ip_range?`, `vswitch_id?` | Add a subnet to an existing network. |
| `hetzner_delete_subnet` | – | `id`, `ip_range` | Remove a subnet from an existing network by its IP range. |
| `hetzner_add_route` | – | `id`, `destination`, `gateway` | Add a route to an existing network. |
| `hetzner_delete_route` | – | `id`, `destination`, `gateway` | Remove a route from an existing network. |
| `hetzner_change_ip_range` | – | `id`, `ip_range` | Expand the IP range of an existing network. The new CIDR range must contain the current range; shrinking is not supported. |
| `hetzner_change_network_protection` | – | `id`, `delete?` | Enable or disable delete protection on a network to guard against accidental destruction. |
| `hetzner_list_network_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific network, such as subnet and route changes. |
| `hetzner_list_firewalls` | ✅ | `name?`, `sort?`, `label_selector?`, `page?`, `per_page?` | List all firewalls in the project, with optional filtering by name or labels. |
| `hetzner_get_firewall` | ✅ | `id` | Get details of a specific firewall by its ID. |
| `hetzner_create_firewall` | – | `name`, `rules?`, `apply_to?`, `labels?` | Create a new firewall with optional rules and resource assignments. |
| `hetzner_update_firewall` | – | `id`, `name?`, `labels?` | Update a firewall name or labels. |
| `hetzner_delete_firewall` | – | `id` | Delete a firewall. It must be removed from all resources first. |
| `hetzner_set_firewall_rules` | – | `id`, `rules` | Replace all rules of a firewall with a new set of rules. |
| `hetzner_apply_firewall` | – | `id`, `apply_to` | Apply a firewall to one or more servers or label selectors. |
| `hetzner_remove_firewall` | – | `id`, `remove_from` | Remove a firewall from one or more servers or label selectors. |
| `hetzner_list_firewall_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific firewall, such as rule and resource attachment changes. |

## `load-balancers`

Load Balancer und Zertifikate.

| Tool | Lesen | Parameter | Beschreibung |
|---|---|---|---|
| `hetzner_list_load_balancers` | ✅ | `name?`, `sort?`, `label_selector?`, `page?`, `per_page?` | List all load balancers in the project, with optional filtering by name or labels. |
| `hetzner_get_load_balancer` | ✅ | `id` | Get details of a specific load balancer by its ID. |
| `hetzner_create_load_balancer` | – | `name`, `load_balancer_type`, `location?`, `network_zone?`, `algorithm?`, `targets?`, `services?`, `labels?`, `network?`, `public_interface?`, `public_net?` | Create a new load balancer with the specified type, location, and optional targets and services. |
| `hetzner_update_load_balancer` | – | `id`, `name?`, `labels?` | Update a load balancer name or labels. |
| `hetzner_delete_load_balancer` | – | `id` | Permanently delete a load balancer. |
| `hetzner_add_lb_target` | – | `id`, `type`, `server?`, `label_selector?`, `ip?`, `use_private_ip?` | Add a target (server, label selector, or IP) to a load balancer. |
| `hetzner_remove_lb_target` | – | `id`, `type`, `server?`, `label_selector?`, `ip?` | Remove a target from a load balancer. |
| `hetzner_add_lb_service` | – | `id`, `protocol`, `listen_port`, `destination_port`, `proxyprotocol?`, `health_check?`, `http?` | Add a service (port listener with forwarding rules) to a load balancer. |
| `hetzner_update_lb_service` | – | `id`, `protocol`, `listen_port`, `destination_port`, `proxyprotocol?`, `health_check?`, `http?` | Update an existing service on a load balancer. |
| `hetzner_delete_lb_service` | – | `id`, `listen_port` | Remove a service from a load balancer by its listen port. |
| `hetzner_change_lb_algorithm` | – | `id`, `type` | Change the balancing algorithm of a load balancer. |
| `hetzner_change_lb_type` | – | `id`, `load_balancer_type` | Change the type (plan) of a load balancer. |
| `hetzner_attach_lb_to_network` | – | `id`, `network`, `ip?`, `ip_range?` | Attach a load balancer to a network. |
| `hetzner_detach_lb_from_network` | – | `id`, `network` | Detach a load balancer from a network. |
| `hetzner_get_lb_metrics` | ✅ | `id`, `type`, `start`, `end`, `step?` | Get metrics for a load balancer over a specified time range. |
| `hetzner_list_lb_types` | ✅ | `name?`, `page?`, `per_page?` | List all available load balancer types with pricing and limits. |
| `hetzner_change_load_balancer_protection` | – | `id`, `delete?` | Enable or disable delete protection on a load balancer to guard against accidental destruction. |
| `hetzner_list_load_balancer_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific load balancer, such as service changes and target attachments. |
| `hetzner_enable_lb_public_interface` | – | `id` | Enable the public network interface of a load balancer so it can be reached over public IPs. |
| `hetzner_disable_lb_public_interface` | – | `id` | Disable the public network interface of a load balancer, removing its public connectivity. |
| `hetzner_change_lb_dns_ptr` | – | `id`, `ip`, `dns_ptr` | Change the reverse DNS entry for one of a load balancer's public IP addresses. Set dns_ptr to null to reset to the default. |
| `hetzner_list_certificates` | ✅ | `name?`, `sort?`, `label_selector?`, `type?`, `page?`, `per_page?` | List all SSL/TLS certificates in the project, with optional filtering. |
| `hetzner_get_certificate` | ✅ | `id` | Get details of a specific certificate by its ID. |
| `hetzner_create_certificate` | – | `name`, `type?`, `certificate?`, `private_key?`, `domain_names?`, `labels?` | Create an uploaded certificate (provide PEM data) or a managed certificate (provide domain names). |
| `hetzner_update_certificate` | – | `id`, `name?`, `labels?` | Update a certificate name or labels. |
| `hetzner_delete_certificate` | – | `id` | Delete a certificate. It must not be in use by any load balancer. |
| `hetzner_retry_certificate` | – | `id` | Retry issuance or renewal of a managed certificate that has failed. |
| `hetzner_list_certificate_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific certificate, such as issuance and renewal retries. |

## `ips`

Floating IPs und Primary IPs.

| Tool | Lesen | Parameter | Beschreibung |
|---|---|---|---|
| `hetzner_list_floating_ips` | ✅ | `name?`, `sort?`, `label_selector?`, `page?`, `per_page?` | List all floating IPs in the project, with optional filtering by name or label. |
| `hetzner_get_floating_ip` | ✅ | `id` | Get details of a specific floating IP by ID. |
| `hetzner_create_floating_ip` | – | `type`, `home_location?`, `server?`, `description?`, `name?`, `labels?` | Create a new floating IP. Either home_location or server must be provided. |
| `hetzner_update_floating_ip` | – | `id`, `name?`, `description?`, `labels?` | Update a floating IP's name, description, or labels. |
| `hetzner_delete_floating_ip` | – | `id` | Delete a floating IP permanently. Since 2026-05-01 the floating IP must be unassigned first; otherwise the API returns the must_be_unassigned error code. |
| `hetzner_assign_floating_ip` | – | `id`, `server` | Assign a floating IP to a server in the same location. |
| `hetzner_unassign_floating_ip` | – | `id` | Unassign a floating IP from the server it is currently assigned to. |
| `hetzner_change_floating_ip_rdns` | – | `id`, `ip`, `dns_ptr` | Change the reverse DNS entry for a floating IP. Set dns_ptr to null to reset. |
| `hetzner_change_floating_ip_protection` | – | `id`, `delete?` | Enable or disable delete protection on a floating IP to guard against accidental destruction. |
| `hetzner_list_floating_ip_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific floating IP, such as assign, unassign, and rDNS changes. |
| `hetzner_list_primary_ips` | ✅ | `name?`, `sort?`, `label_selector?`, `ip?`, `page?`, `per_page?` | List all primary IPs in the project, with optional filtering by name, label, or IP address. |
| `hetzner_get_primary_ip` | ✅ | `id` | Get details of a specific primary IP by ID. |
| `hetzner_create_primary_ip` | – | `type`, `assignee_type?`, `name`, `location?`, `assignee_id?`, `auto_delete?`, `labels?` | Create a new primary IP with the specified type, optional location, and optional assignee type. |
| `hetzner_update_primary_ip` | – | `id`, `name?`, `auto_delete?`, `labels?` | Update a primary IP's name, auto_delete setting, or labels. |
| `hetzner_delete_primary_ip` | – | `id` | Delete a primary IP permanently. Since 2026-05-01 the primary IP must be unassigned first; otherwise the API returns the must_be_unassigned error code. |
| `hetzner_assign_primary_ip` | – | `id`, `assignee_id`, `assignee_type` | Assign a primary IP to a server. |
| `hetzner_unassign_primary_ip` | – | `id` | Unassign a primary IP from the server it is currently assigned to. |
| `hetzner_change_primary_ip_rdns` | – | `id`, `ip`, `dns_ptr` | Change the reverse DNS entry for a primary IP. Set dns_ptr to null to reset. |
| `hetzner_change_primary_ip_protection` | – | `id`, `delete?` | Enable or disable delete protection on a primary IP to guard against accidental destruction. |
| `hetzner_list_primary_ip_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific primary IP, such as assign, unassign, and rDNS changes. |

## `storage`

Volumes und Images (Snapshots, Backups).

| Tool | Lesen | Parameter | Beschreibung |
|---|---|---|---|
| `hetzner_list_volumes` | ✅ | `name?`, `sort?`, `label_selector?`, `status?`, `page?`, `per_page?` | List all volumes in the project, with optional filtering by name, label, or status. |
| `hetzner_get_volume` | ✅ | `id` | Get details of a specific volume by ID. |
| `hetzner_create_volume` | – | `name`, `size`, `location?`, `assignee?`, `server?`, `format?`, `automount?`, `labels?` | Create a new volume. Either location or assignee must be provided to determine placement. |
| `hetzner_update_volume` | – | `id`, `name?`, `labels?` | Update a volume's name or labels. |
| `hetzner_delete_volume` | – | `id` | Delete a volume permanently. The volume must be detached from any server. |
| `hetzner_attach_volume` | – | `id`, `assignee?`, `server?`, `automount?` | Attach a volume to a resource such as a server. The resource and volume must be in the same location. |
| `hetzner_detach_volume` | – | `id` | Detach a volume from the server it is attached to. |
| `hetzner_resize_volume` | – | `id`, `size` | Increase the size of a volume. Volumes can only be made larger, not smaller. |
| `hetzner_change_volume_protection` | – | `id`, `delete?` | Enable or disable delete protection on a volume to guard against accidental destruction. |
| `hetzner_list_volume_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific volume, such as attach, detach, and resize operations. |
| `hetzner_list_images` | ✅ | `type?`, `status?`, `architecture?`, `name?`, `bound_to?`, `include_deprecated?`, `label_selector?`, `sort?`, `page?`, `per_page?` | List all available images, including system, snapshot, and backup images. |
| `hetzner_get_image` | ✅ | `id` | Get details of a specific image by ID. |
| `hetzner_update_image` | – | `id`, `description?`, `type?`, `labels?` | Update an image's description, type, or labels. |
| `hetzner_delete_image` | – | `id` | Permanently delete a snapshot or backup image. |
| `hetzner_create_image` | – | `server_id`, `type?`, `description?`, `labels?` | Create a snapshot image from an existing server. |
| `hetzner_change_image_protection` | – | `id`, `delete?` | Enable or disable delete protection on a snapshot or backup image to guard against accidental destruction. |
| `hetzner_list_image_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific image, such as snapshot creation and protection changes. |

## `storage-boxes`

Storage Boxes, Subaccounts und Snapshots.

| Tool | Lesen | Parameter | Beschreibung |
|---|---|---|---|
| `hetzner_list_storage_boxes` | ✅ | `name?`, `label_selector?`, `sort?`, `page?`, `per_page?` | List all Storage Boxes in the project, with optional filtering by name or labels. |
| `hetzner_create_storage_box` | – | `name`, `storage_box_type`, `location`, `password`, `labels?`, `ssh_keys?`, `access_settings?` | Create a new Storage Box in the given location and type. Billing applies for the provisioned resource. |
| `hetzner_get_storage_box` | ✅ | `id` | Get details of a specific Storage Box by ID. |
| `hetzner_update_storage_box` | – | `id`, `name?`, `labels?` | Update the name and/or labels of a Storage Box. |
| `hetzner_delete_storage_box` | – | `id` | Delete a Storage Box and all of its data permanently. The Storage Box must not be delete-protected. |
| `hetzner_list_storage_box_folders` | ✅ | `id`, `path?` | List the folders inside a Storage Box, optionally under a given path. |
| `hetzner_list_storage_box_actions` | ✅ | `id`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific Storage Box, such as type changes and password resets. |
| `hetzner_change_storage_box_protection` | – | `id`, `delete?` | Enable or disable delete protection on a Storage Box to guard against accidental destruction. |
| `hetzner_change_storage_box_type` | – | `id`, `storage_box_type` | Change the type (capacity tier) of a Storage Box. The new type must have at least the current usage capacity. |
| `hetzner_reset_storage_box_password` | – | `id`, `password` | Reset the password of a Storage Box main account to the supplied value. |
| `hetzner_update_storage_box_access_settings` | – | `reachable_externally?`, `samba_enabled?`, `ssh_enabled?`, `webdav_enabled?`, `zfs_enabled?`, `id` | Update which access protocols (SSH, Samba, WebDAV, ZFS, external reachability) are enabled on a Storage Box. |
| `hetzner_rollback_storage_box_snapshot` | – | `id`, `snapshot` | Roll a Storage Box back to a snapshot. This overwrites current data with the snapshot contents. |
| `hetzner_enable_storage_box_snapshot_plan` | – | `id`, `max_snapshots`, `minute`, `hour`, `day_of_week?`, `day_of_month?` | Enable or update the automatic snapshot plan for a Storage Box (schedule and retention). |
| `hetzner_disable_storage_box_snapshot_plan` | – | `id` | Disable the automatic snapshot plan for a Storage Box. Existing snapshots are kept. |
| `hetzner_list_storage_box_types` | ✅ | `name?`, `page?`, `per_page?` | List all available Storage Box types with their capacity, limits, and pricing. |
| `hetzner_get_storage_box_type` | ✅ | `id` | Get details of a specific Storage Box type by ID, including capacity and pricing. |
| `hetzner_list_storage_box_snapshots` | ✅ | `id`, `name?`, `label_selector?`, `sort?`, `is_automatic?` | List the snapshots of a Storage Box, with optional filtering by name, labels, or automatic-vs-manual. |
| `hetzner_create_storage_box_snapshot` | – | `id`, `description?`, `labels?` | Create a manual snapshot of a Storage Box, optionally with a description and labels. |
| `hetzner_get_storage_box_snapshot` | ✅ | `id`, `snapshot_id` | Get details of a specific Storage Box snapshot by ID. |
| `hetzner_update_storage_box_snapshot` | – | `id`, `snapshot_id`, `description?`, `labels?` | Update the description and/or labels of a Storage Box snapshot. |
| `hetzner_delete_storage_box_snapshot` | – | `id`, `snapshot_id` | Delete a Storage Box snapshot permanently. |
| `hetzner_list_storage_box_subaccounts` | ✅ | `id`, `name?`, `username?`, `label_selector?`, `sort?` | List the subaccounts of a Storage Box, with optional filtering by name, username, or labels. |
| `hetzner_create_storage_box_subaccount` | – | `id`, `home_directory`, `password`, `name?`, `description?`, `labels?`, `access_settings?` | Create a subaccount on a Storage Box, scoped to a home directory with its own password and access settings. |
| `hetzner_get_storage_box_subaccount` | ✅ | `id`, `subaccount_id` | Get details of a specific Storage Box subaccount by ID. |
| `hetzner_update_storage_box_subaccount` | – | `id`, `subaccount_id`, `name?`, `description?`, `labels?` | Update the name, description, and/or labels of a Storage Box subaccount. |
| `hetzner_delete_storage_box_subaccount` | – | `id`, `subaccount_id` | Delete a Storage Box subaccount permanently. Its home directory contents are not removed. |
| `hetzner_change_storage_box_subaccount_home_directory` | – | `id`, `subaccount_id`, `home_directory` | Change the home directory a Storage Box subaccount is scoped to. |
| `hetzner_reset_storage_box_subaccount_password` | – | `id`, `subaccount_id`, `password` | Reset the password of a Storage Box subaccount to the supplied value. |
| `hetzner_update_storage_box_subaccount_access_settings` | – | `readonly?`, `reachable_externally?`, `samba_enabled?`, `ssh_enabled?`, `webdav_enabled?`, `id`, `subaccount_id` | Update the access settings (read-only, SSH, Samba, WebDAV, external reachability) of a Storage Box subaccount. |

## `config`

SSH-Keys, ISOs und Placement Groups.

| Tool | Lesen | Parameter | Beschreibung |
|---|---|---|---|
| `hetzner_list_ssh_keys` | ✅ | `name?`, `sort?`, `label_selector?`, `fingerprint?`, `page?`, `per_page?` | List all SSH keys in the project, with optional filtering by name, label, or fingerprint. |
| `hetzner_get_ssh_key` | ✅ | `id` | Get details of a specific SSH key by ID. |
| `hetzner_create_ssh_key` | – | `name`, `public_key`, `labels?` | Add a new SSH public key to the project for use when creating servers. |
| `hetzner_update_ssh_key` | – | `id`, `name?`, `labels?` | Update an SSH key's name or labels. |
| `hetzner_delete_ssh_key` | – | `id` | Delete an SSH key from the project permanently. |
| `hetzner_list_isos` | ✅ | `name?`, `architecture?`, `page?`, `per_page?` | List all available ISO images for mounting on servers. |
| `hetzner_get_iso` | ✅ | `id` | Get details of a specific ISO image by ID. |
| `hetzner_attach_iso` | – | `server_id`, `iso` | Attach an ISO image to a server. The server must be rebooted to boot from the ISO. |
| `hetzner_detach_iso` | – | `server_id` | Detach an ISO image from a server. The server must be rebooted for the change to take effect. |
| `hetzner_list_placement_groups` | ✅ | `name?`, `sort?`, `label_selector?`, `page?`, `per_page?` | List all placement groups in the project. |
| `hetzner_get_placement_group` | ✅ | `id` | Get details of a specific placement group by ID. |
| `hetzner_create_placement_group` | – | `name`, `type`, `labels?` | Create a new placement group to control server distribution across hosts. |
| `hetzner_update_placement_group` | – | `id`, `name?`, `labels?` | Update a placement group's name or labels. |
| `hetzner_delete_placement_group` | – | `id` | Delete a placement group. All servers must be removed from it first. |

## `dns`

DNS-Zonen und Records.

| Tool | Lesen | Parameter | Beschreibung |
|---|---|---|---|
| `hetzner_list_zones` | ✅ | `name?`, `mode?`, `label_selector?`, `sort?`, `page?`, `per_page?` | List all DNS zones in the project, with optional filtering by name, mode (primary/secondary), or labels. |
| `hetzner_get_zone` | ✅ | `id_or_name` | Get details of a specific DNS zone by its numeric ID or zone name (e.g. "example.com"). |
| `hetzner_create_zone` | – | `name`, `mode`, `ttl?`, `labels?`, `primary_nameservers?`, `rrsets?`, `zonefile?` | Create a new DNS zone in primary or secondary mode. Optionally provide TTL, primary nameservers (for secondary), initial RRSets, or a zonefile. |
| `hetzner_update_zone` | – | `id_or_name`, `labels?` | Update a DNS zone's labels. Other zone properties are managed via dedicated change_* action tools. |
| `hetzner_delete_zone` | – | `id_or_name` | Delete a DNS zone and all of its RRSets permanently. The zone must not be delete-protected. |
| `hetzner_export_zonefile` | ✅ | `id_or_name` | Export the current contents of a DNS zone as an RFC 1035 zonefile string. |
| `hetzner_import_zonefile` | – | `id_or_name`, `zonefile` | Replace the contents of a DNS zone with the given RFC 1035 zonefile. This overwrites all existing RRSets. |
| `hetzner_change_zone_protection` | – | `id_or_name`, `delete?` | Enable or disable delete protection on a DNS zone to guard against accidental destruction. |
| `hetzner_change_zone_ttl` | – | `id_or_name`, `ttl` | Change the default TTL applied to records in a DNS zone that do not have an explicit TTL. |
| `hetzner_change_zone_primary_nameservers` | – | `id_or_name`, `primary_nameservers` | Replace the list of primary nameservers used by a secondary DNS zone for AXFR/IXFR transfers. |
| `hetzner_list_zone_actions` | ✅ | `id_or_name`, `sort?`, `status?`, `page?`, `per_page?` | List all actions performed on a specific DNS zone, such as imports, TTL changes, and protection toggles. |
| `hetzner_list_zone_rrsets` | ✅ | `id_or_name`, `name?`, `type?`, `label_selector?`, `sort?`, `page?`, `per_page?` | List all RRSets in a DNS zone, with optional filtering by name, type, or labels. |
| `hetzner_get_zone_rrset` | ✅ | `id_or_name`, `name`, `type` | Get a specific RRSet by zone, name, and record type. |
| `hetzner_create_zone_rrset` | – | `id_or_name`, `name`, `type`, `ttl?`, `labels?`, `records?` | Create a new RRSet (record set) inside a DNS zone. |
| `hetzner_update_zone_rrset` | – | `id_or_name`, `name`, `type`, `labels?` | Update an RRSet's labels. Records and TTL are managed via dedicated action tools. |
| `hetzner_delete_zone_rrset` | – | `id_or_name`, `name`, `type` | Delete an RRSet from a DNS zone permanently. The RRSet must not be change-protected. |
| `hetzner_change_zone_rrset_protection` | – | `id_or_name`, `name`, `type`, `change?` | Enable or disable change protection on an RRSet to guard against accidental modification or deletion. |
| `hetzner_change_zone_rrset_ttl` | – | `id_or_name`, `name`, `type`, `ttl` | Change the TTL of an RRSet. Pass ttl=null to fall back to the zone default TTL. |
| `hetzner_set_zone_rrset_records` | – | `id_or_name`, `name`, `type`, `records` | Replace the full list of records in an RRSet. Existing records not in the payload are removed. |
| `hetzner_add_zone_rrset_records` | – | `id_or_name`, `name`, `type`, `records`, `ttl?` | Add new records to an existing RRSet without removing existing ones. Optionally update the RRSet TTL. |
| `hetzner_update_zone_rrset_records` | – | `id_or_name`, `name`, `type`, `records` | Update the comment on existing records in an RRSet (matched by value). The comment field is always sent — use an empty string to clear. |
| `hetzner_remove_zone_rrset_records` | – | `id_or_name`, `name`, `type`, `records` | Remove specific records from an RRSet (matched by value) without deleting the RRSet itself. |
