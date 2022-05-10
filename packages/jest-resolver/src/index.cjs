/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const isLocalRepo = (name) =>
  name.startsWith('@googleforcreators/') || name.startsWith('@web-stories-wp/');

// See https://jestjs.io/docs/configuration#resolver-string
module.exports = (request, options) => {
  // Workaround for https://github.com/uuidjs/uuid/pull/616.
  //
  // jest-environment-jsdom 28+ tries to use browser exports instead of default exports,
  // but uuid only offers an ESM browser export and not a CommonJS one. Jest does not yet
  // support ESM modules natively, so this causes a Jest error related to trying to parse
  // "export" syntax.
  //
  // This workaround prevents Jest from considering uuid's module-based exports at all;
  // it falls back to uuid's CommonJS+node "main" property.
  //
  // Once we're able to migrate our Jest config to ESM and a browser crypto
  // implementation is available for the browser+ESM version of uuid to use (eg, via
  // https://github.com/jsdom/jsdom/pull/3352 or a similar polyfill), this can go away.
  if ('uuid' === request) {
    return options.defaultResolver(request, {
      ...options,
      packageFilter: (pkg) => {
        if ('uuid' === pkg.name) {
          delete pkg['exports'];
          delete pkg['module'];
        }

        return pkg;
      },
    });
  }

  if (!isLocalRepo(request)) {
    return options.defaultResolver(request, options);
  }

  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(request, {
    ...options,
    packageFilter: (pkg) => {
      if (isLocalRepo(pkg.name)) {
        return {
          ...pkg,
          // Alter the value of `main` before resolving the package
          main: pkg.source || pkg.module || pkg.main,
        };
      }

      return pkg;
    },
  });
};
