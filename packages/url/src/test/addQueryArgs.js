/*
 * Copyright 2021 Google LLC
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
import addQueryArgs from '../addQueryArgs';

describe('addQueryArgs', () => {
  it('should leave URL unaffected if no args passed', () => {
    const url = 'https://google.com/';
    const args = {};

    expect(addQueryArgs(url, args)).toBe(url);
  });

  it('should append args', () => {
    const url = 'https://google.com/';
    const args = { q: 'test' };

    expect(addQueryArgs(url, args)).toBe('https://google.com/?q=test');
  });

  it('should append args to existing ones', () => {
    const url = 'https://google.com/?foo=bar';
    const args = { q: 'test' };

    expect(addQueryArgs(url, args)).toBe('https://google.com/?foo=bar&q=test');
  });

  it('should replace existing args', () => {
    const url = 'https://google.com/?foo=bar';
    const args = { foo: 'baz' };

    expect(addQueryArgs(url, args)).toBe('https://google.com/?foo=baz');
  });

  it('should append args to relative URL', () => {
    const url = '/foo/bar';
    const args = { q: 'test' };

    expect(addQueryArgs(url, args)).toBe('/foo/bar?q=test');
  });

  it('should disregard keys with undefined or null values', () => {
    const url = 'https://google.com/';
    const args = { foo: 'true', bar: undefined, baz: null };

    expect(addQueryArgs(url, args)).toBe('https://google.com/?foo=true');
  });
});
