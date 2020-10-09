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

/**
 * Internal dependencies
 */
import base64Encode from '../base64Encode';

// see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa.
function fromBinary(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

describe('base64Encode', () => {
  it('prefixes encoded content', () => {
    expect(base64Encode('Hello World')).toStartWith('__WEB_STORIES_ENCODED__');
  });

  it('converts Unicode characters', () => {
    const actual = base64Encode('Hello 🌍');
    expect(actual).toStrictEqual(
      '__WEB_STORIES_ENCODED__SABlAGwAbABvACAAPNgN3w=='
    ); // Hello 🌍
    expect(
      fromBinary(atob(actual.replace('__WEB_STORIES_ENCODED__', '')))
    ).toStrictEqual('Hello 🌍');
  });
});
