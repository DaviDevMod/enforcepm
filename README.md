# enforcepm

Enforce the usage of a single package manager within your project.

## Usage

There's no need to install the package. Just create a Git pre-commit [hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) and put the following command in there:

```sh
npx enforcepm <pm>
```

Where `<pm>` is the name of package manager you want to use within your project.  
Currently only [**npm**](https://docs.npmjs.com/about-npm), [**yarn**](https://yarnpkg.com/) and [**pnpm**](https://pnpm.io/) are supported.

Feel free to open an issue requesting the implementation of your preferred package manager, or even better send a PR.

## Why enforcepm?

As I started using yarn in my projects, I looked for a safety net against running npm commands.  
It turns out there is no clean way to implement one (see yarn issue [#4895](https://github.com/yarnpkg/yarn/issues/4895)).

The best options available are:

I) [using a `preinstall` script](https://github.com/yarnpkg/yarn/issues/4895#issuecomment-343438785) in which `npm_execpath` is examinated to find out which package manager was designated to run the install command

II) [using a fictitious npm engine](https://github.com/yarnpkg/yarn/issues/4895#issuecomment-545644733) along with an `.npmrc` file with the rule `engine-strict = true`, so that any npm command would fail

The first approach doesn't really work, as `preinstall` only runs before install command with no arguments (eg, it runs before `npm install`, but not before `npm install enforcepm`).

The second approach works, though someone reports [it may cause problems later on](https://github.com/yarnpkg/yarn/issues/4895#issuecomment-1057095337), but it's quite "dirty" as it requires to create a file appositely for the job, and needs you to specify as many fake engines as the number of package manager you want to prevent from running commands.

There must be a better way to enforce a package manager.

## How does _enforcepm_ enforce a package manager?

When prevention is somewhat cumbersome, a cure may be the right path.

Rather than preventing a package manager from running, _enforcepm_ deals with the consequences of having used the wrong package manager.

The main problem with using wrong package managers is the generation of lock files, which are redundant and may cause [_"consistency issues"_](https://classic.yarnpkg.com/blog/2018/06/04/yarn-import-package-lock/)

_enforcepm_ is just a script that deletes any staged lock file other than the desired one. The script is meant to be run in a pre-commit hook.

## Contribution

Feel free to fill up issues and send pull requests for fixes or features.
