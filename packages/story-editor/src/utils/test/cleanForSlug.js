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
import cleanForSlug from '../cleanForSlug';

describe('cleanForSlug', () => {
  it('should return string prepared for use as URL slug', () => {
    expect(cleanForSlug(' /Déjà_vu. ')).toBe('deja-vu');
  });

  it('should return an empty string for missing argument', () => {
    expect(cleanForSlug()).toBe('');
  });

  it('should return an empty string for falsy argument', () => {
    expect(cleanForSlug(null)).toBe('');
  });

  it('should trim leading and ending whitespace and dashes', () => {
    const result = cleanForSlug('- Hello-World- ');
    expect(result).toBe('hello-world');
  });

  it('should not trim leading and ending whitespace and dashes if editing', () => {
    const result = cleanForSlug('- Hello-World- ', true);
    expect(result).toBe('--hello-world--');
  });

  it('should collapse multiple whitespace and dashes', () => {
    const result = cleanForSlug('Hello   cruel- world');
    expect(result).toBe('hello-cruel-world');
  });

  it('should not collapse multiple whitespace and dashes if editing', () => {
    const result = cleanForSlug('Hello   cruel- world', true);
    expect(result).toBe('hello---cruel--world');
  });

  it('should remove diacritics', () => {
    const result = cleanForSlug('-Hello-World-');
    expect(result).toBe('hello-world');
  });

  it('should remove all illegal characters', () => {
    const result = cleanForSlug('Hello-?,:;!"World');
    expect(result).toBe('hello-world');
  });

  // eslint-disable-next-line jest/no-disabled-tests -- not implemented yet.
  it.skip('should replace umlauts if locale is de-*', () => {
    expect(cleanForSlug('Übergrössengeschäft')).toBe('uebergroessengeschaeft');
  });
});
