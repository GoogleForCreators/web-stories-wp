# Create Web stories

Scaffold a minimal story editor, dashboard or both.

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

Go to any other folder outside the project and run

```bash
npm --registry http://localhost:4873/ init @googleforcreators/web-stories
```



#### Flags

Note that `npm init`  would install all dependencies from npm registry by default. If you want to install them from the local registry, you should  publish them and use the `--private` flag. ( Be sure to bundle and locally publish packages first )

Example:

```bash
npm --registry http://localhost:4873/ init @googleforcreators/web-stories -- --private
```



You can also skip all questionnaires by providing options in `--name`, `--setupType` and `--boilerplate` flags.

Example:

```bash
npm --registry http://localhost:4873/ init -y @googleforcreators/web-stories -- --name custom-web-stories --setupType custom --boilerplate editor
```



