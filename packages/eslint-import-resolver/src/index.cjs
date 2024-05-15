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

/**
 * External dependencies
 */
const path = require('path');
const nodeResolver = require('eslint-import-resolver-node');

exports.interfaceVersion = 2;

exports.resolve = (source, file, config) => {
  function nodeResolve(src) {
    return nodeResolver.resolve(src, file, {
      ...config,
      extensions: ['.tsx', '.ts', '.mjs', '.js', '.json', '.node'],
    });
  }

  if (!config.mapping) {
    return nodeResolve(source);
  }

  for (const [regex, dir] of Object.entries(config.mapping)) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const sourceLocation = source.replace(new RegExp(regex), dir);
    const result = nodeResolve(path.resolve(sourceLocation));

    if (result.found) {
      return result;
    }
  }

  return nodeResolve(source);
};
