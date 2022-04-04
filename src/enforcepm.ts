#!/usr/bin/env node
import cp = require('child_process');

// A map of package managers and relative lock files supported by enforcepm
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

  const stagedFiles = git(['diff', '--name-only', '--cached']).stdout.split('\n');
  stagedFiles.pop(); // pop trailing empty string

  for (let lock of forbiddenLocks) {
    if (stagedFiles.indexOf(lock) !== -1) {
      // Remove the staged forbidden lock file
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
}
