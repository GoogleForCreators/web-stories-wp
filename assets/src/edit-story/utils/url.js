/*
 * Copyright 2020 Google LLC
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

export { isWebUri as isValidUrl } from 'valid-url';

/**
 * Prepends a protocol (default http) to a URL that
 * doesn't have one
 *
 * @param {string} url
 * @param {string=} protocol default protocol to prepend
 * @return {string} the url with the protocol prepended to it
 */
export function withProtocol(url, protocol = 'http') {
  return /^(?:f|ht)tps?:\/\//.test(url) ? url : `${protocol}://${url}`;
}

export function toAbsoluteUrl(base, path) {
  try {
    return new URL(path, base).href;
  } catch (error) {
    return path;
  }
}
