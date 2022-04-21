#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const lockFiles = {
    npm: 'package-lock.json',
    yarn: 'yarn.lock',
    pnpm: 'npm-lock.yaml',
};
const git = (args) => cp.spawnSync('git', args, { encoding: 'utf-8' });
const chosenPM = process.argv[2];
if (lockFiles.hasOwnProperty(chosenPM)) {
    const allowedLock = lockFiles[chosenPM];
    const forbiddenLocks = Object.values(lockFiles).filter((lock) => lock !== allowedLock);
    const stagedFiles = git(['diff', '--name-only', '--cached']).stdout.trim().split('\n');
    for (let lock of forbiddenLocks) {
        const forbiddenLocksFound = stagedFiles.filter((sf) => sf.endsWith(lock));
        if (forbiddenLocksFound.length) {
            for (const flf of forbiddenLocksFound)
                git(['rm', '-f', flf]);
            const yellow = '\x1b[1;33m';
            const green = '\x1b[0;32m';
            const blue = '\x1b[0;34m';
            const resetColor = '\x1b[0m';
            const forbiddenPMUsed = Object.keys(lockFiles).find((pm) => lockFiles[pm] === lock);
            console.log(yellow, `WARNING: It looks like you used ${forbiddenPMUsed}. Please remember to use ${chosenPM}.`);
            for (const flf of forbiddenLocksFound)
                console.log(green, `"${flf}" has been deleted prior to commit.`);
            console.log(blue, '\t\t~ enforcepm ~', resetColor);
        }
    }
}
else {
    throw new Error(`"${chosenPM}" is not supported by enforcepm.\n\tFor a list of supported package managers, visit https://github.com/DaviDevMod/enforcepm#usage`);
}
