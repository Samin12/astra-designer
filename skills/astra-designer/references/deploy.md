# Deploy a website

Default static hosting: here.now. Honor explicit hosting choices. Read current https://here.now/docs and any installed here-now skill before publishing. This adapter uses the official helper rather than bundling a stale copy.

Install the helper if needed: `npx skills add heredotnow/skill --skill here-now -g`.

Prepare a public directory containing `index.html` and only the assets needed by the site. Keep build notes, raw media, credentials, lab screenshots, `.git` and dependencies outside it. The only permitted hidden publish path is `.herenow/data.json`, a Site Data schema manifest. Use owner-only read/update/delete for email collections; verify a real insert and private owner readback before claiming capture works. Include LICENSE when distributing the bundled engine. Build framework projects first; use an appropriate runtime host for server features.

```bash
node <skill>/scripts/deploy.mjs /absolute/path/to/site/public
# Update only an existing site the user authorized you to change:
node <skill>/scripts/deploy.mjs /absolute/path/to/site/public --slug EXISTING_SLUG
```

The wrapper finds the helper under the standard Codex/agent skill directories. For other installations set `ASTRA_DESIGNER_PUBLISH_SCRIPT` to the official `publish.sh` path. It forwards `--spa` when a static single-page application needs fallback routing. Provider credentials remain in the provider's supported private storage, never in the site or GitHub repository. The helper may write private state into cwd; keep it ignored and out of the public directory.

Use the current publish result as truth. Share its actual site URL. For anonymous publishes explain the reported expiry and provide the exact private claim link to the user, never in a public repo. For authenticated publishes confirm the reported account/permanence status. Do not print credential files. Do not promise a custom domain without configuring and verifying one.

Open the returned site, check its headline, script/style/media responses and CTA destinations, and inspect at least one mobile state. A failed publish or inaccessible URL is not completion. Preserve an existing slug on authorized updates; do not accidentally create duplicates.
