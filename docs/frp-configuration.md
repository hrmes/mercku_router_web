# FRP STCP remote access

The shared FRP page has a dynamic list of STCP proxies. Each entry contains a
name, local IPv4 address and local port. The “+ Add Proxy” button adds an editable
row; rows can be removed, and names can be copied for visitor configuration.
Changes to Enable and the configuration stay in the form until Save.

FRPS server settings and the STCP shared secret remain common to all entries.
`127.0.0.1` targets the router itself. A reachable LAN address targets that
device's service. This forwards individual TCP services, not an entire LAN.

## Device API contract

`router.frp.get` returns the stored configuration:

```json
{
  "enabled": true,
  "server_addr": "frps.example.com",
  "server_port": 7000,
  "token": "server-auth-token",
  "hasSk": true,
  "proxies": [
    { "name": "office_web", "local_ip": "127.0.0.1", "local_port": 80 },
    { "name": "office_ssh", "local_ip": "192.168.1.30", "local_port": 22 },
    { "name": "office_nas", "local_ip": "192.168.1.50", "local_port": 5000 }
  ]
}
```

| Field | FRPC setting / meaning |
| --- | --- |
| `enabled` | Service enable state |
| `server_addr` | `serverAddr`, hostname or IPv4, without scheme/path/port |
| `server_port` | `serverPort`, integer 1–65535; default 7000 |
| `token` | `auth.token`, optional according to server requirements |
| `hasSk` | Read-only boolean indicating whether an SK is stored |
| `sk` | Optional write-only replacement for every STCP proxy's `secretKey` |
| `proxies[].name` | Proxy `name`; corresponding visitor's `serverName` |
| `proxies[].local_ip` | Proxy `localIP`; default 127.0.0.1 |
| `proxies[].local_port` | Proxy `localPort`, integer 1–65535 |

`router.frp.update` accepts the same configuration fields other than `hasSk`.
It accepts an optional `sk` and preserves the stored SK when `sk` is omitted or
blank. A supplied nonblank SK is stored even while disabled. When `enabled` is
true, the device must reject the update without changing the stored state if
there is no supplied or stored SK. Reads must omit `sk`. Router Web can derive
the presence indicator from a legacy read containing `sk` and discards that
value before populating the form. For deployment, the device firmware must
implement the new update semantics.

Firmware must treat `proxies` as the authoritative replacement list: remove
entries omitted by an update, preserve every provided entry and its name, and
return the stored list on subsequent reads. Do not merge it with old Web/SSH
defaults. `proxies: []` means an explicitly empty list and remains empty after
reload. It can be saved while disabled. Enabling requires at least one proxy.
The frontend does not impose an arbitrary proxy-count limit.

Every row requires a name, valid local IPv4 address and valid port. New rows
default to local IP 127.0.0.1, with blank name and port for the user to enter.
Names must be unique within the list. The UI accepts 1–128 ASCII letters, digits,
underscores, hyphens or dots, starting with a letter or digit. This is a frontend
portability policy. Collisions with other clients on FRPS require backend handling.

## Migration from fixed Web/SSH fields

For reads without a `proxies` property, the frontend migrates the old
`web_name` / `web_ip` / `web_port` and `ssh_name` / `ssh_ip` / `ssh_port` fields
into two list entries. Missing legacy IPs default to 127.0.0.1, and missing legacy
ports default to 80 / 22. Explicit lists, including empty lists, always take
precedence over stale legacy fields. A malformed non-array `proxies` value
blocks editing instead of silently creating defaults.

The 80/22 target-port fallback applies only to legacy migration. Missing or
malformed `proxies[].local_port` values remain blank or retain their invalid
text in the form. Saving is blocked until the user enters a valid target port;
reading a dynamic proxy never redirects it to 80.

Updates send only the canonical `proxies` array, without legacy per-service
fields or internal UI row keys. Firmware must support this list contract before
the updated frontend can manage device tunnels; read compatibility alone does
not make older firmware support arbitrary lists.

Existing names are preserved. For missing names on initial read, the page can
fetch the SN from `router.meta.get`: legacy rows receive suggestions
`router_<SN>_web` / `router_<SN>_ssh`; unnamed list entries receive
`router_<SN>_proxy_<number>`. Suggestions remain unsaved until applied and are
marked accordingly. If metadata fails, manual entry remains available.

## Application and failure behavior

Save applies the full draft and the device uses `enabled` to start or stop
`frpc`. The form requires an SK when enabling FRP for the first time. Users can
save a disabled configuration without an SK, or set the SK ahead of enabling
FRP. The SK field is blank on load and after a successful save. When an SK is
already stored, the page indicates that leaving the field blank keeps it.
Entering a replacement shows a reminder to update the visitor's SK.

The form and saved snapshot hold independent copies of every proxy. Failed
writes restore the entire acknowledged list, including added/deleted/edited
rows. Validation errors retain the draft for correction. Controls are blocked
until the initial read succeeds and while a request is pending.

The visitor's `serverName` must match the corresponding STCP proxy `name`.
The visitor's own `name` may differ. Changed names and list additions/removals
show a reminder to save and update visitor configuration. Clipboard copying
supports HTTP router pages with a selection fallback and reports failures.

Firmware source is not in this repository. Frontend and offline-preview tests
do not establish an actual device tunnel. Connection status is not displayed
because the current API does not define a runtime status field.

Reference: [FRP STCP intranet service example](https://gofrp.org/en/docs/examples/stcp/).
