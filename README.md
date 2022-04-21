# enforcepm

Enforce the usage of a single package manager within your project.

## Usage

There's no need to install the package. Just create a Git pre-commit [hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) and put the following command in there:

```sh
npx enforcepm <pm>
```

Where `<pm>` is the name of the package manager you want to use within your project.  
Currently only [**npm**](https://docs.npmjs.com/about-npm), [**yarn**](https://yarnpkg.com/) and [**pnpm**](https://pnpm.io/) are supported.

Feel free to open an issue requesting the implementation of your preferred package manager, or even better send a PR.

## How does it work?

Since, currently, there is no clean way to prevent a package manager from running (see [#4895](https://github.com/yarnpkg/yarn/issues/4895)), the approach chosen by _enforcepm_ is to deals with the consequences of using the wrong package manager.

The main problem with using wrong package managers is the generation of lock files, which are redundant and may cause [_"consistency issues"_](https://classic.yarnpkg.com/blog/2018/06/04/yarn-import-package-lock/)

_enforcepm_ deletes any staged lock file other than the desired ones. The deletion is meant to take place in a pre-commit hook.

## Contribution

Feel free to fill up issues and send pull requests for fixes or features.
