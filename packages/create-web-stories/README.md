# Create Web stories

Scaffold a minimal story editor or dashboard.

## Usage

```bash
npm init @googleforcreators/web-stories
```

### Testing in Local Registry

Start local registry

```bash
npm run local-registry:start
```

Create a new version of the `create-web-stories` package

```bash
npm version --workspace=@googleforcreators/create-web-stories --no-git-tag-version "0.1.$(date -u +%Y%m%d%H%M)"
```

Publish the package locally

```bash
npm --registry http://localhost:4873/ --workspace=@googleforcreators/create-web-stories publish
```

Go a folder outside the project and run

```bash
npm --registry http://localhost:4873/ init @googleforcreators/web-stories
```

Note that `npm init`  would install all dependencies from npm registry by default. If you want to install local packages, you should  publish them and use the `--private` flag.

Example:

```bash
npm --registry http://localhost:4873/ init @googleforcreators/web-stories -- --private
```



