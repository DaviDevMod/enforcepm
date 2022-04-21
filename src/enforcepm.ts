#!/usr/bin/env node
import cp = require('child_process');

// An hash table of the lock files of the supported package managers
const lockFiles = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'npm-lock.yaml',
};

// Git command with output as utf-8 encoded string
const git = (args: string[]) => cp.spawnSync('git', args, { encoding: 'utf-8' });

const chosenPM = process.argv[2];

if (lockFiles.hasOwnProperty(chosenPM)) {
  const allowedLock = lockFiles[chosenPM as keyof typeof lockFiles];

  const forbiddenLocks = Object.values(lockFiles).filter((lock) => lock !== allowedLock);

  const stagedFiles = git(['diff', '--name-only', '--cached']).stdout.trim().split('\n');

  for (let lock of forbiddenLocks) {
    if (stagedFiles.indexOf(lock) !== -1) {
      // Remove the forbidden lock file
      git(['rm', '-f', lock]);

      // Notify
      const yellow = '\x1b[1;33m';
      const green = '\x1b[0;32m';
      const blue = '\x1b[0;34m';
      const resetColor = '\x1b[0m';
      const forbiddenPMUsed = Object.keys(lockFiles).find((pm) => lockFiles[pm as keyof typeof lockFiles] === lock);
      console.log(yellow, `WARNING: It looks like you used ${forbiddenPMUsed}. Please remember to use ${chosenPM}.`);
      console.log(green, `"${lock}" has been deleted prior to commit.`);
      console.log(blue, '\t\t~ enforcepm ~', resetColor);
    }
  }
} else {
  throw new Error(
    `"${chosenPM}" is not supported by enforcepm.\n\tFor a list of supported package managers, visit https://github.com/DaviDevMod/enforcepm#usage`
  );
}
