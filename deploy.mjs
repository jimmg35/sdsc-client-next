// Publishes the site in one go:
//   1. sign in to the WebDAV share (saved credentials, or asks for them)
//   2. commit every change, with a message generated from what changed
//      (scripts/commit-message.mjs), and push the current branch
//   3. yarn build
//   4. wipe the WebDAV share and upload out/
//
//   node deploy.mjs             # do all of it
//   node deploy.mjs --dry-run   # sign in, build and show the plan; no
//                               # commit, push or upload
//
// It stops at the first step that fails, so a failed push or build never
// touches the live site.
import { execFileSync, spawnSync } from 'node:child_process';
import { commitMessage, pendingChanges } from './scripts/commit-message.mjs';
import {
  closePrompts,
  connect,
  wipeAndUpload
} from './scripts/deploy-webdav.mjs';

const dryRun = process.argv.includes('--dry-run');
const SHOWN_CHANGES = 10;

try {
  await main();
} catch (error) {
  console.error(`\nDeploy failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  closePrompts();
}

async function main() {
  step(1, 'Sign in to WebDAV');
  await connect();

  step(2, 'Commit and push');
  commitAndPush();

  step(3, 'yarn build');
  // yarn is a .cmd shim on Windows, which only starts through a shell.
  check(
    spawnSync('yarn build', { stdio: 'inherit', shell: true }),
    'yarn build'
  );

  step(4, 'Wipe WebDAV and upload out/');
  await wipeAndUpload({ dryRun, skipConfirm: true });
}

function commitAndPush() {
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  const changes = pendingChanges();

  if (changes.length === 0) {
    console.log('Nothing to commit.');
  } else {
    console.log(`${changes.length} changed files on ${branch}:`);
    changes
      .slice(0, SHOWN_CHANGES)
      .forEach(({ status, path }) => console.log(`  ${status} ${path}`));
    if (changes.length > SHOWN_CHANGES) {
      console.log(`  ... and ${changes.length - SHOWN_CHANGES} more`);
    }

    const { subject, body } = commitMessage(changes);
    console.log(`\nCommit message:\n  ${subject}\n`);
    body.split('\n').forEach((line) => console.log(`  ${line}`));
    console.log();

    if (dryRun) {
      console.log('Dry run: not committing.');
    } else {
      run('git', ['add', '-A']);
      run('git', ['commit', '-m', subject, '-m', body]);
    }
  }

  const hasUpstream =
    spawnSync('git', ['rev-parse', '--abbrev-ref', '@{u}'], { stdio: 'ignore' })
      .status === 0;
  const pushArgs = hasUpstream ? ['push'] : ['push', '-u', 'origin', branch];
  if (dryRun) {
    console.log(`Dry run: not running git ${pushArgs.join(' ')}`);
    return;
  }
  run('git', pushArgs);
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trimEnd();
}

function run(command, args) {
  check(
    spawnSync(command, args, { stdio: 'inherit' }),
    `${command} ${args[0]}`
  );
}

function check(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  if (result.status !== 0) {
    throw new Error(`${label} exited with code ${result.status}`);
  }
}

function step(number, title) {
  const heading = `[${number}/4] ${title}`;
  console.log(
    process.stdout.isTTY ? `\n\x1b[1;36m${heading}\x1b[0m` : `\n${heading}`
  );
}
