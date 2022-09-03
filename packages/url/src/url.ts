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

export function toAbsoluteUrl(base: string, path: string): string {
  try {
    return new URL(path, base).href;
  } catch (error) {
    return path;
  }
}

export function isValidUrl(url: string): boolean {
  try {
    // eslint-disable-next-line no-new -- Needed here just to catch errors.
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Prepends a protocol (default https) to a URL that doesn't have one
 *
 * @param url URL.
 * @param [protocol=https] default protocol to prepend
 * @return the url with the protocol prepended to it
 */
export function withProtocol(
  url: string,
  protocol: 'http' | 'https' | 'tel' | 'mailto' = 'https'
): string {
  return /^(http:\/\/|https:\/\/|tel:|mailto:)/.test(url)
    ? url
    : `${protocol}://${url}`;
}
