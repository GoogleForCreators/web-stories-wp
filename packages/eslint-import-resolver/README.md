# eslint-import-resolver

Custom resolver for [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) to resolve packages locally in a monorepo.

Example usage:

```json
{
  "settings": {
    "import/resolver": {
      "@web-stories-wp/eslint-import-resolver": {
        "mapping": {
          "^@foo\\/(.*)": "./packages/$1/src/",
        }
      }
    }
  }
}
```

With this config, a package named `@foo/bar` will be looked up in `packages/bar/src`.
