// Replaces everything on the sdsc.fsu.edu WebDAV share with out/.
//
//   npm run build
//   npm run deploy:webdav -- --dry-run   # list what would be deleted
//   npm run deploy:webdav                # delete everything, then upload out/
//
// Credentials come from WEBDAV_USER / WEBDAV_PASSWORD, else from
// .webdav-credentials.json (gitignored, password encrypted with Windows DPAPI,
// offered after a typed sign-in), else are prompted for. Delete that file to
// forget them. WEBDAV_URL overrides the target folder. --yes skips the
// confirmation. deploy.mjs in the repo root imports this to commit, build and
// publish.
//
// The site is down from the first delete until the upload finishes.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { pathToFileURL } from 'node:url';

const ROOT_DIR = process.cwd();
const OUT_DIR = path.join(ROOT_DIR, 'out');
const CREDENTIALS_FILE = path.join(ROOT_DIR, '.webdav-credentials.json');
// DPAPI is reached through PowerShell, so saving only works on Windows;
// elsewhere the password is asked for every time.
const CAN_SAVE_CREDENTIALS = process.platform === 'win32';
const WEBDAV_URL = withTrailingSlash(
  process.env.WEBDAV_URL ?? 'https://webdav.fsu.edu/sdsc/production/'
);
const UPLOAD_CONCURRENCY = 4;
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 10 * 60 * 1000;
const RECENT_ITEMS = 5;

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';

let authorization = '';
let pipedInput;
let pipedLines;

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const args = new Set(process.argv.slice(2));
  try {
    await connect();
    await wipeAndUpload({
      dryRun: args.has('--dry-run'),
      skipConfirm: args.has('--yes')
    });
  } catch (error) {
    console.error(`\nDeploy failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    closePrompts();
  }
}

// Signs in with WEBDAV_USER / WEBDAV_PASSWORD, else the saved credentials,
// else typed ones, which it then offers to save.
export async function connect() {
  const { WEBDAV_USER, WEBDAV_PASSWORD } = process.env;
  if (WEBDAV_USER && WEBDAV_PASSWORD) {
    return signIn({ user: WEBDAV_USER, password: WEBDAV_PASSWORD });
  }

  const fileName = path.basename(CREDENTIALS_FILE);
  const saved = await loadCredentials();
  if (saved) {
    try {
      await signIn(saved);
      console.log(`Used the credentials saved in ${fileName}.`);
      return;
    } catch (error) {
      if (error.code !== 'EAUTH') throw error;
      console.log('The saved credentials were rejected. Sign in again.');
    }
  }

  const user = WEBDAV_USER || (await ask('WebDAV username: '));
  const password = WEBDAV_PASSWORD || (await askHidden('WebDAV password: '));
  await signIn({ user, password });

  if (CAN_SAVE_CREDENTIALS) {
    const answer = await ask(
      `Save them in ${fileName}, encrypted for your Windows account? (y/N) `
    );
    if (/^y(es)?$/i.test(answer)) {
      await saveCredentials({ user, password });
      console.log(`Saved. Delete ${fileName} to forget them.`);
    }
  }
}

// Lists the share once so a wrong password fails before anything changes.
async function signIn({ user, password }) {
  authorization = `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;
  await listRemote();
  console.log(`Signed in to ${WEBDAV_URL} as ${user}.`);
}

async function loadCredentials() {
  if (!CAN_SAVE_CREDENTIALS) return null;
  try {
    const saved = JSON.parse(await fs.readFile(CREDENTIALS_FILE, 'utf8'));
    return { user: saved.user, password: unprotect(saved.password) };
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.log(
        `Could not read the saved credentials in ${path.basename(CREDENTIALS_FILE)}. Sign in again.`
      );
    }
    return null;
  }
}

async function saveCredentials({ user, password }) {
  const data = { user, password: protect(password) };
  await fs.writeFile(CREDENTIALS_FILE, `${JSON.stringify(data, null, 2)}\n`, {
    mode: 0o600
  });
}

// DPAPI through PowerShell's SecureString cmdlets: only the same Windows
// account on the same machine can decrypt. Text crosses the pipe as base64 so
// the console code page cannot mangle it.
function protect(secret) {
  return powershell(
    '$plain = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd()));' +
      '[Console]::Out.Write((ConvertTo-SecureString -String $plain -AsPlainText -Force | ConvertFrom-SecureString))',
    Buffer.from(secret, 'utf8').toString('base64')
  );
}

function unprotect(encrypted) {
  const base64 = powershell(
    '$secure = ConvertTo-SecureString -String ([Console]::In.ReadToEnd().Trim());' +
      "$plain = (New-Object System.Net.NetworkCredential('', $secure)).Password;" +
      '[Console]::Out.Write([Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($plain)))',
    encrypted
  );
  return Buffer.from(base64, 'base64').toString('utf8');
}

function powershell(script, input) {
  const result = spawnSync(
    'powershell.exe',
    [
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      `$ErrorActionPreference = 'Stop'; ${script}`
    ],
    { input, encoding: 'utf8' }
  );
  if (result.error) throw result.error;
  // stderr is in the console code page, so only the exit code is reported.
  if (result.status !== 0) {
    throw new Error(`PowerShell exited with code ${result.status}`);
  }
  return result.stdout.trim();
}

export function closePrompts() {
  pipedInput?.close();
}

export async function wipeAndUpload({ dryRun = false, skipConfirm = false }) {
  const local = await listLocal();
  if (!local.files.some(({ rel }) => rel === 'index.html')) {
    throw new Error('out/index.html not found. Run the build first.');
  }

  console.log(`\nReading ${WEBDAV_URL}`);
  const remote = await listRemote();

  console.log(`Delete all ${remote.length} items on the share:`);
  remote.forEach(({ rel, isDir }) =>
    console.log(`  ${rel}${isDir ? '/' : ''}`)
  );
  console.log(
    `Then upload out/: ${local.files.length} files in ${local.dirs.length} folders`
  );

  if (dryRun) {
    console.log('\nDry run: nothing was changed.');
    return;
  }
  if (!skipConfirm) {
    const answer = await ask(
      `\nDelete everything in ${WEBDAV_URL} and upload out/? (y/N) `
    );
    if (!/^y(es)?$/i.test(answer)) {
      console.log('Cancelled.');
      return;
    }
  }

  const started = Date.now();
  console.log();

  const deleting = createProgress('Deleting', remote.length);
  for (const entry of remote) {
    await remove(entry);
    deleting.tick(`${entry.rel}${entry.isDir ? '/' : ''}`);
  }
  deleting.finish();

  const folders = createProgress('Folders', local.dirs.length);
  for (const dir of local.dirs) {
    await request('MKCOL', toUrl(dir, true), { okStatuses: [201, 405] });
    folders.tick(`${dir}/`);
  }
  folders.finish();

  const totalBytes = local.files.reduce((sum, { size }) => sum + size, 0);
  const uploading = createProgress('Uploading', local.files.length, {
    totalBytes
  });
  await runPool(local.files, UPLOAD_CONCURRENCY, async ({ rel, size }) => {
    const body = await fs.readFile(path.join(OUT_DIR, ...rel.split('/')));
    await request('PUT', toUrl(rel), { body, okStatuses: [200, 201, 204] });
    uploading.tick(rel, size);
  });
  uploading.finish();

  console.log(
    `\nDone in ${formatDuration(Date.now() - started)}. ` +
      `${WEBDAV_URL} now matches out/.`
  );
}

// On a terminal, each phase is one live block: the last few finished items
// scroll up above a progress bar and collapse into the bar when the phase
// ends. Without a terminal (piped to a log) it prints one line per item.
function createProgress(label, total, { totalBytes = 0 } = {}) {
  const { stdout } = process;
  const live = stdout.isTTY;
  const started = Date.now();
  const recent = [];
  let done = 0;
  let bytes = 0;
  let drawnLines = 0;
  const timer = live ? setInterval(render, 1000).unref() : null;

  function barLine() {
    const ratio = total ? done / total : 1;
    const stats = [
      `${done}/${total}`,
      `${Math.floor(ratio * 100)}%`.padStart(4),
      ...(totalBytes
        ? [`${formatBytes(bytes)} / ${formatBytes(totalBytes)}`]
        : []),
      formatDuration(Date.now() - started)
    ].join('  ');
    const columns = stdout.columns || 80;
    const width = Math.max(
      10,
      Math.min(30, columns - 1 - 10 - 2 - stats.length - 2)
    );
    const filled = Math.round(ratio * width);
    return (
      `${CYAN}${label.padEnd(10)}${RESET}` +
      `${GREEN}${'█'.repeat(filled)}${DIM}${'░'.repeat(width - filled)}${RESET}` +
      `  ${stats}`
    );
  }

  function render(lines = [...recent.map(itemLine), barLine()]) {
    let frame = drawnLines ? `\x1b[${drawnLines}A` : '';
    for (const line of lines) frame += `\x1b[2K${line}\n`;
    // A shorter frame leaves old lines below it; blank them and step back.
    const leftover = drawnLines - lines.length;
    if (leftover > 0)
      frame += `${'\x1b[2K\n'.repeat(leftover)}\x1b[${leftover}A`;
    stdout.write(frame);
    drawnLines = lines.length;
  }

  function itemLine(item) {
    const room = (stdout.columns || 80) - 5;
    const text = item.length > room ? `…${item.slice(-(room - 1))}` : item;
    return `  ${DIM}${text}${RESET}`;
  }

  if (live) render();

  return {
    tick(item, size = 0) {
      done += 1;
      bytes += size;
      if (!live) {
        console.log(`${label} [${done}/${total}] ${item}`);
        return;
      }
      recent.push(item);
      if (recent.length > RECENT_ITEMS) recent.shift();
      render();
    },
    finish() {
      if (!live) return;
      clearInterval(timer);
      render([barLine()]);
    }
  };
}

function formatBytes(n) {
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// Parent folders come before their children, so they can be created in order.
async function listLocal() {
  const files = [];
  const dirs = [];

  async function walk(rel) {
    const entries = await fs.readdir(path.join(OUT_DIR, ...rel.split('/')), {
      withFileTypes: true
    });
    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        dirs.push(childRel);
        await walk(childRel);
      } else if (entry.isFile()) {
        const { size } = await fs.stat(
          path.join(OUT_DIR, ...childRel.split('/'))
        );
        files.push({ rel: childRel, size });
      }
    }
  }

  try {
    await walk('');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return { files, dirs };
}

// Only the top level is needed: deleting a folder removes everything in it.
async function listRemote() {
  const response = await request('PROPFIND', WEBDAV_URL, {
    body:
      '<?xml version="1.0" encoding="utf-8"?>' +
      '<propfind xmlns="DAV:"><prop><resourcetype/></prop></propfind>',
    headers: { Depth: '1', 'Content-Type': 'application/xml' },
    okStatuses: [207]
  });
  return parseMultistatus(await response.text()).filter(({ rel }) => rel);
}

function parseMultistatus(xml) {
  const basePath = decodePath(new URL(WEBDAV_URL).pathname);
  const entries = [];
  const responses = xml.matchAll(
    /<(?:[\w-]+:)?response\b[^>]*>([\s\S]*?)<\/(?:[\w-]+:)?response>/g
  );
  for (const [, block] of responses) {
    const href = block.match(/<(?:[\w-]+:)?href>([^<]*)</)?.[1];
    if (!href) continue;
    const fullPath = decodePath(
      new URL(decodeXml(href.trim()), WEBDAV_URL).pathname
    );
    entries.push({
      rel: fullPath.startsWith(basePath)
        ? fullPath.slice(basePath.length).replace(/\/$/, '')
        : null,
      isDir: /<(?:[\w-]+:)?collection\s*\/>/.test(block)
    });
  }
  return entries;
}

async function remove({ rel, isDir }) {
  await request('DELETE', toUrl(rel, isDir), { okStatuses: [200, 204, 404] });
}

async function request(method, url, { body, headers = {}, okStatuses }) {
  for (let attempt = 1; ; attempt += 1) {
    let response;
    try {
      response = await fetch(url, {
        method,
        body,
        headers: { Authorization: authorization, ...headers },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });
    } catch (error) {
      if (attempt < MAX_ATTEMPTS) {
        await delay(attempt * 1000);
        continue;
      }
      throw new Error(`${method} ${url}: ${error.message}`);
    }

    if (okStatuses.includes(response.status)) return response;
    if (response.status === 401) {
      throw Object.assign(
        new Error('WebDAV rejected the username or password (401).'),
        { code: 'EAUTH' }
      );
    }
    if (response.status >= 500 && attempt < MAX_ATTEMPTS) {
      await delay(attempt * 1000);
      continue;
    }
    throw new Error(`${method} ${url}: HTTP ${response.status}`);
  }
}

async function runPool(items, size, worker) {
  let next = 0;
  let failed = false;
  const run = async () => {
    while (!failed && next < items.length) {
      const item = items[next++];
      try {
        await worker(item);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, run));
}

function toUrl(rel, isDir = false) {
  const encoded = rel.split('/').map(encodeURIComponent).join('/');
  return new URL(isDir && rel ? `${encoded}/` : encoded, WEBDAV_URL).href;
}

function decodePath(pathname) {
  return pathname.split('/').map(decodeURIComponent).join('/');
}

function decodeXml(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function withTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ask(question) {
  if (!process.stdin.isTTY) {
    process.stdout.write(question);
    pipedInput ??= readline.createInterface({ input: process.stdin });
    pipedLines ??= pipedInput[Symbol.asyncIterator]();
    const { value = '' } = await pipedLines.next();
    process.stdout.write('\n');
    return value.trim();
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

// Reads a line from the terminal without echoing it.
async function askHidden(question) {
  const { stdin, stdout } = process;
  if (!stdin.isTTY) return ask(question);

  stdout.write(question);
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  stdin.resume();
  return new Promise((resolve) => {
    let value = '';
    const finish = () => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
    };
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          finish();
          resolve(value);
          return;
        }
        if (char === '\u0003') {
          finish();
          process.exit(130);
        }
        if (char === '\b' || char === '\u007f') {
          value = value.slice(0, -1);
        } else {
          value += char;
        }
      }
    };
    stdin.on('data', onData);
  });
}
