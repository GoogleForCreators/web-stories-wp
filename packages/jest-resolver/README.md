# jest-resolver

Custom [Jest resolver](https://jestjs.io/docs/configuration#resolver-string) to resolve packages locally in a monorepo.

Makes sure that Jest looks for files in the `src` directory, not in the `dist` or `dist-module` directories.
